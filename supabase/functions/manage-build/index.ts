import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const STAGES = ['parts_ordered', 'bench_assembly', 'cable_management', 'stress_testing', 'ready_for_pickup'] as const;
const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);

const createSchema = z.object({
  action: z.literal('create'),
  passcode: z.string().min(1).max(128),
  build_name: z.string().trim().min(1).max(120),
});
const getSchema = z.object({ action: z.literal('get'), manage_token: tokenSchema });
const updateSchema = z.object({
  action: z.literal('update'),
  manage_token: tokenSchema,
  stage: z.enum(STAGES).optional(),
  customer_note: z.string().max(2000).optional(),
});
const uploadSchema = z.object({
  action: z.literal('upload-photo'),
  manage_token: tokenSchema,
  photo: z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const MIME: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json();
    const client = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    if (body?.action === 'create') {
      const parsed = createSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid build details.' }, 400);
      const passcode = Deno.env.get('OWNER_PASSCODE') ?? '';
      if (!passcode || parsed.data.passcode !== passcode) return json({ error: 'Wrong passcode.' }, 403);
      const { data, error } = await client
        .from('build_tracking')
        .insert({ build_name: parsed.data.build_name })
        .select('id, build_name, tracking_token, manage_token, stage, customer_note, expires_at')
        .single();
      if (error || !data) return json({ error: 'Could not create the build.' }, 503);
      return json({ build: data });
    }

    if (body?.action === 'get') {
      const parsed = getSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'This update link is invalid.' }, 404);
      const { data, error } = await client
        .from('build_tracking')
        .select('id, build_name, tracking_token, stage, customer_note, photo_paths, updated_at, expires_at')
        .eq('manage_token', parsed.data.manage_token)
        .maybeSingle();
      if (error) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!data) return json({ error: 'This update link is invalid.' }, 404);
      return json({ build: data });
    }

    if (body?.action === 'update') {
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid update.' }, 400);
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (parsed.data.stage) patch.stage = parsed.data.stage;
      if (parsed.data.customer_note !== undefined) patch.customer_note = parsed.data.customer_note;
      const { data, error } = await client
        .from('build_tracking')
        .update(patch)
        .eq('manage_token', parsed.data.manage_token)
        .select('id, build_name, tracking_token, stage, customer_note, photo_paths, updated_at, expires_at')
        .maybeSingle();
      if (error) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!data) return json({ error: 'This update link is invalid.' }, 404);
      return json({ build: data });
    }

    if (body?.action === 'upload-photo') {
      const parsed = uploadSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Photos must be JPG, PNG, or WebP.' }, 400);
      const { data: build, error: findError } = await client
        .from('build_tracking')
        .select('id, build_name, tracking_token, stage, customer_note, photo_paths, updated_at, expires_at')
        .eq('manage_token', parsed.data.manage_token)
        .maybeSingle();
      if (findError) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!build) return json({ error: 'This update link is invalid.' }, 404);
      if ((build.photo_paths ?? []).length >= 20) return json({ error: 'This build already has the maximum of 20 photos.' }, 400);

      const match = parsed.data.photo.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!match) return json({ error: 'Photos must be JPG, PNG, or WebP.' }, 400);
      const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
      if (bytes.length > 9_000_000) return json({ error: 'Photo is too large. Keep it under 9 MB.' }, 400);
      const path = `${build.id}/${crypto.randomUUID()}.${MIME[match[1]]}`;
      const { error: uploadError } = await client.storage
        .from('build-progress-photos')
        .upload(path, bytes, { contentType: match[1], upsert: false });
      if (uploadError) return json({ error: 'Photo upload failed. Please try again.' }, 503);

      const { data, error } = await client
        .from('build_tracking')
        .update({ photo_paths: [...(build.photo_paths ?? []), path], updated_at: new Date().toISOString() })
        .eq('id', build.id)
        .select('id, build_name, tracking_token, stage, customer_note, photo_paths, updated_at, expires_at')
        .single();
      if (error || !data) return json({ error: 'Photo saved but the build could not be refreshed.' }, 503);
      return json({ build: data });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch {
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});
