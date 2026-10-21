import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { dispatchError, scheduleError, WORKSHOP_STATUSES } from '../_shared/workshop.ts';

const STAGES = ['parts_ordered', 'bench_assembly', 'cable_management', 'stress_testing', 'ready_for_pickup', 'completed'] as const;
const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);

const createOwnerSchema = z.object({
  action: z.literal('create-owner'),
  passcode: z.string().min(1).max(128),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});
const createSchema = z.object({
  action: z.literal('create'),
  build_name: z.string().trim().min(1).max(120),
});
const listSchema = z.object({ action: z.literal('list') });
const updateSchema = z.object({
  action: z.literal('update'),
  id: z.string().uuid(),
  stage: z.enum(STAGES).optional(),
  customer_note: z.string().max(2000).optional(),
  carrier: z.enum(['ups','fedex','usps']).nullable().optional(),
  tracking_number: z.string().max(40).nullable().optional(),
  technician_name: z.string().trim().max(120).optional(),
  scheduled_build_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  planned_ship_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  workshop_status: z.enum(WORKSHOP_STATUSES).optional(),
  internal_note: z.string().max(2000).optional(),
});
const uploadSchema = z.object({
  action: z.literal('upload-photo'),
  id: z.string().uuid(),
  photo: z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),
});
const deletePhotoSchema = z.object({
  action: z.literal('delete-photo'),
  id: z.string().uuid(),
  path: z.string().min(1).max(300),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const MIME: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const BUILD_SELECT = 'id, build_name, tracking_token, manage_token, stage, customer_note, photo_paths, updated_at, expires_at, order_ref, customer_name, customer_email, customer_phone, items, amount_total, fulfillment, shipping_address, carrier, tracking_number, created_at, technician_name, scheduled_build_date, planned_ship_date, workshop_status, internal_note';

const serviceClient = () =>
  createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

// Returns the admin user's id, or null if the caller is not a signed-in admin.
async function adminUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get('Authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const anon = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  const { data, error } = await anon.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: isAdmin } = await serviceClient().rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
  return isAdmin ? data.user.id : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json();
    const client = serviceClient();

    // One-time owner account setup, guarded by the owner passcode.
    if (body?.action === 'create-owner') {
      const parsed = createOwnerSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Enter a valid email and a password of at least 8 characters.' }, 400);
      const passcode = Deno.env.get('OWNER_PASSCODE') ?? '';
      if (!passcode || parsed.data.passcode !== passcode) return json({ error: 'Wrong passcode.' }, 403);
      const { data: existing } = await client.from('user_roles').select('id').eq('role', 'admin').limit(1);
      if (existing && existing.length > 0) return json({ error: 'An owner account already exists. Sign in instead.' }, 409);
      const { data: created, error: createError } = await client.auth.admin.createUser({
        email: parsed.data.email,
        password: parsed.data.password,
        email_confirm: true,
      });
      if (createError || !created.user) {
        const msg = createError?.message ?? '';
        if (/weak|easy to guess|pwned/i.test(msg)) return json({ error: 'That password is too common and easy to guess. Choose a longer, unique password (for example 3-4 random words plus a number).' }, 400);
        if (/already|registered|exists/i.test(msg)) return json({ error: 'That email already has an account. Use a different email.' }, 400);
        return json({ error: msg || 'Could not create the account. Please try again.' }, 400);
      }
      const { error: roleError } = await client.from('user_roles').insert({ user_id: created.user.id, role: 'admin' });
      if (roleError) return json({ error: 'Account created but role setup failed. Contact support.' }, 503);
      return json({ ok: true });
    }

    // Everything below requires a signed-in admin.
    const adminId = await adminUserId(req);
    if (!adminId) return json({ error: 'Sign in as the owner to do that.' }, 401);

    if (body?.action === 'list') {
      const parsed = listSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid request.' }, 400);
      const { data, error } = await client.from('build_tracking').select(BUILD_SELECT).order('updated_at', { ascending: false });
      if (error) return json({ error: 'Could not load builds.' }, 503);
      return json({ builds: data ?? [] });
    }

    if (body?.action === 'create') {
      const parsed = createSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid build details.' }, 400);
      const { data, error } = await client.from('build_tracking').insert({ build_name: parsed.data.build_name }).select(BUILD_SELECT).single();
      if (error || !data) return json({ error: 'Could not create the build.' }, 503);
      return json({ build: data });
    }

    if (body?.action === 'update') {
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid update.' }, 400);
      const { data: existing, error: readError } = await client.from('build_tracking').select(BUILD_SELECT).eq('id', parsed.data.id).maybeSingle();
      if (readError) return json({ error: 'Could not load this build.' }, 503);
      if (!existing) return json({ error: 'Build not found.' }, 404);
      const invalidDate = scheduleError(parsed.data.scheduled_build_date === undefined ? existing.scheduled_build_date : parsed.data.scheduled_build_date, parsed.data.planned_ship_date === undefined ? existing.planned_ship_date : parsed.data.planned_ship_date);
      if (invalidDate) return json({ error: invalidDate }, 400);
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (parsed.data.stage) patch.stage = parsed.data.stage;
      if (parsed.data.customer_note !== undefined) patch.customer_note = parsed.data.customer_note;
      if (parsed.data.carrier !== undefined) patch.carrier = parsed.data.carrier;
      if (parsed.data.tracking_number !== undefined) patch.tracking_number = parsed.data.tracking_number ? parsed.data.tracking_number.replace(/[\s-]/g, '').toUpperCase() : null;
      for (const key of ['technician_name','scheduled_build_date','planned_ship_date','workshop_status','internal_note'] as const) {
        if (parsed.data[key] !== undefined) patch[key] = parsed.data[key];
      }
      const tracking = parsed.data.tracking_number === undefined ? existing.tracking_number : parsed.data.tracking_number;
      const carrier = parsed.data.carrier === undefined ? existing.carrier : parsed.data.carrier;
      const invalidDispatch = dispatchError(parsed.data.workshop_status, existing.fulfillment, tracking, carrier);
      if (invalidDispatch) return json({ error: invalidDispatch }, 400);
      const { data, error } = await client.from('build_tracking').update(patch).eq('id', parsed.data.id).select(BUILD_SELECT).maybeSingle();
      if (error?.code === '23505') return json({ error: 'That date already has its one active build. Choose another day.' }, 409);
      if (error) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!data) return json({ error: 'Build not found.' }, 404);
      return json({ build: data });
    }

    if (body?.action === 'upload-photo') {
      const parsed = uploadSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Photos must be JPG, PNG, or WebP.' }, 400);
      const { data: build, error: findError } = await client.from('build_tracking').select(BUILD_SELECT).eq('id', parsed.data.id).maybeSingle();
      if (findError) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!build) return json({ error: 'Build not found.' }, 404);
      if ((build.photo_paths ?? []).length >= 20) return json({ error: 'This build already has the maximum of 20 photos.' }, 400);

      const match = parsed.data.photo.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!match) return json({ error: 'Photos must be JPG, PNG, or WebP.' }, 400);
      const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
      if (bytes.length > 9_000_000) return json({ error: 'Photo is too large. Keep it under 9 MB.' }, 400);
      const path = `${build.id}/${crypto.randomUUID()}.${MIME[match[1]]}`;
      const { error: uploadError } = await client.storage.from('build-progress-photos').upload(path, bytes, { contentType: match[1], upsert: false });
      if (uploadError) return json({ error: 'Photo upload failed. Please try again.' }, 503);

      const { data, error } = await client
        .from('build_tracking')
        .update({ photo_paths: [...(build.photo_paths ?? []), path], updated_at: new Date().toISOString() })
        .eq('id', build.id)
        .select(BUILD_SELECT)
        .single();
      if (error || !data) return json({ error: 'Photo saved but the build could not be refreshed.' }, 503);
      return json({ build: data });
    }

    if (body?.action === 'delete-photo') {
      const parsed = deletePhotoSchema.safeParse(body);
      if (!parsed.success) return json({ error: 'Invalid request.' }, 400);
      const { data: build, error: findError } = await client.from('build_tracking').select(BUILD_SELECT).eq('id', parsed.data.id).maybeSingle();
      if (findError) return json({ error: 'Build updates are temporarily unavailable.' }, 503);
      if (!build) return json({ error: 'Build not found.' }, 404);
      if (!parsed.data.path.startsWith(`${build.id}/`) || parsed.data.path.includes('..')) return json({ error: 'Invalid photo.' }, 400);
      await client.storage.from('build-progress-photos').remove([parsed.data.path]);
      const { data, error } = await client
        .from('build_tracking')
        .update({ photo_paths: (build.photo_paths ?? []).filter((p: string) => p !== parsed.data.path), updated_at: new Date().toISOString() })
        .eq('id', build.id)
        .select(BUILD_SELECT)
        .single();
      if (error || !data) return json({ error: 'Could not remove the photo.' }, 503);
      return json({ build: data });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch {
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});
