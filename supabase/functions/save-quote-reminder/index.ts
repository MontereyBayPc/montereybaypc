import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return json({ error: 'Invalid email' }, 400)
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const since = new Date(Date.now() - 48 * 3600_000).toISOString()

  if (body.action === 'submitted') {
    await db.from('quote_reminders').update({ submitted_at: new Date().toISOString() }).eq('email', email).is('submitted_at', null)
    return json({ ok: true })
  }

  const share = typeof body.share === 'string' ? body.share : ''
  if (!share || share.length > 16000 || !/^[A-Za-z0-9+/=]+$/.test(share)) return json({ error: 'Invalid build' }, 400)
  const total = Number(body.total)
  const buildUrl = `https://montereybaypcs.com/quote?b=${encodeURIComponent(share)}`
  // Keep only the latest pending build per email.
  const { data: pending } = await db.from('quote_reminders').select('id').eq('email', email).is('reminded_at', null).is('submitted_at', null).gt('created_at', since).limit(1)
  const row = { build_url: buildUrl, estimated_total: Number.isFinite(total) && total > 0 && total < 100000 ? total : null }
  if (pending?.length) await db.from('quote_reminders').update(row).eq('id', pending[0].id)
  else await db.from('quote_reminders').insert({ email, ...row })
  return json({ ok: true })
})
