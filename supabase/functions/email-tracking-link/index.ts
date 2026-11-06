import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  try {
    const body = await req.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return json({ error: 'Enter a valid email.' }, 400)
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data } = await db.from('build_tracking').select('build_name,tracking_token,customer_email')
      .ilike('customer_email', email.replace(/[%_\\]/g, '\\$&')).is('refunded_at', null)
      .gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }).limit(5)
    const builds = (data ?? []).filter((b) => b.customer_email?.toLowerCase() === email)
      .map((b) => ({ name: b.build_name, url: `https://montereybaypcs.com/build/${b.tracking_token}` }))
    if (builds.length) {
      // One email per address per hour; same key dedupes repeat clicks.
      const hour = new Date().toISOString().slice(0, 13)
      await sendTemplateEmail('tracking-links', email, { templateData: { builds }, idempotencyKey: `tracking-links-${email}-${hour}` })
    }
    // Same response either way so emails cannot be probed.
    return json({ ok: true })
  } catch (e) {
    console.error('email-tracking-link', e)
    return json({ ok: true })
  }
})
