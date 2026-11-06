import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
const HOUR = 3600_000

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: state } = await db.from('price_job_state').select('cron_token').eq('id', 1).single()
  if (!state?.cron_token || req.headers.get('x-cron-token') !== state.cron_token) return json({ error: 'Unauthorized' }, 401)
  const now = Date.now()
  const result = { quotes: 0, reviews: 0, errors: 0 }

  // Saved quotes: 2 to 48 hours old, not submitted, not yet reminded.
  const { data: quotes } = await db.from('quote_reminders').select('*').is('reminded_at', null).is('submitted_at', null)
    .lte('created_at', new Date(now - 2 * HOUR).toISOString()).gte('created_at', new Date(now - 48 * HOUR).toISOString()).limit(50)
  for (const q of quotes ?? []) {
    const { count } = await db.from('quote_requests').select('id', { count: 'exact', head: true }).ilike('email', q.email).gte('created_at', q.created_at)
    if (count) { await db.from('quote_reminders').update({ submitted_at: new Date().toISOString() }).eq('id', q.id); continue }
    try {
      await sendTemplateEmail('quote-saved', q.email, { templateData: { buildUrl: q.build_url, total: q.estimated_total }, idempotencyKey: `quote-saved-${q.id}` })
      await db.from('quote_reminders').update({ reminded_at: new Date().toISOString() }).eq('id', q.id)
      result.quotes++
    } catch (e) { console.error('quote reminder', q.id, e); result.errors++ }
  }

  // Reviews: delivered 7 to 14 days ago, never asked, not refunded.
  const { data: builds } = await db.from('build_tracking').select('id,customer_name,customer_email,build_name')
    .is('review_requested_at', null).is('refunded_at', null).not('customer_email', 'is', null)
    .lte('delivered_at', new Date(now - 7 * 24 * HOUR).toISOString()).gte('delivered_at', new Date(now - 14 * 24 * HOUR).toISOString()).limit(50)
  for (const b of builds ?? []) {
    try {
      await sendTemplateEmail('review-request', b.customer_email!, {
        templateData: { name: b.customer_name?.split(' ')[0], buildName: b.build_name },
        idempotencyKey: `review-request-${b.id}`,
        replyTo: 'montereybaypc@gmail.com',
      })
      await db.from('build_tracking').update({ review_requested_at: new Date().toISOString() }).eq('id', b.id)
      result.reviews++
    } catch (e) { console.error('review request', b.id, e); result.errors++ }
  }
  return json(result)
})
