import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { convertToModelMessages, type UIMessage } from 'npm:ai@7.0.143';
import { createResponsesCall } from '../_shared/ai-responses.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length > 80 || JSON.stringify(body.messages).length > 60000 || body.messages.some((m: UIMessage) => !['user', 'assistant'].includes(m.role) || !Array.isArray(m.parts) || m.parts.some((p) => !['text','reasoning','step-start'].includes(p.type)))) {
      return new Response(JSON.stringify({ error: 'Please start a new chat or shorten your message.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return new Response(JSON.stringify({ error: 'The assistant is not configured. Please call (831) 718-7730.' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const { response } = createResponsesCall(req, { baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey: key, model: 'openai/gpt-6-astra' }, await convertToModelMessages(body.messages),
      `You are Bay, the AI-powered PC adviser for Monterey Bay PCs. Be concise, friendly and practical. Business: montereybaypc@gmail.com, (831) 718-7730, Monterey CA, founded 2024. Hours 9am-6:30pm. Local pickup is free; local delivery is $75 within 30 miles, subject to address confirmation. No nationwide shipping. Custom builds normally 1-2 weeks; rush 48-72 hours costs $100 subject to availability. Bring-your-own-parts assembly costs $50. Parts carry manufacturer warranties; technical support is included. Trade-ins accept only working CPUs/GPUs, provisional credit never above 50% of reference price, subject to inspection. Bay Starter $899 Ryzen 5 5600 RTX 4060; Bay Mid $1599 Ryzen 7 7700X RTX 4070 Super; Bay High-End $2799 i7-14700K RTX 4080 Super; Bay Extreme $4499 Ryzen 9 9950X RTX 5090. The Beast $100000 is one-of-one, consultation reservation. Quote build fee 10% minimum $75. Prices, parts and compatibility need final technician confirmation. Link customers to /quote, /prebuilts, /services, /repair-request, /trade-in, /order-status, /service-agreement or /contact as appropriate. Never invent stock, benchmarks, pickup addresses, review links, offers or claim access to private orders. Do not ask for passwords or sensitive data. Do not promise bookings or submit forms. AI advice is not a technician diagnosis. Only answer PC and shop-related questions.`);
    const stream = await response();
    const headers = new Headers(stream.headers);
    Object.entries(corsHeaders).forEach(([k,v]) => headers.set(k,v));
    return new Response(stream.body, { status: stream.status, headers });
  } catch (e) {
    const status = e instanceof Error && e.name === 'AbortError' ? 499 : 500;
    return new Response(JSON.stringify({ error: status === 499 ? 'Stopped.' : 'Assistant unavailable. Please try later or call (831) 718-7730.' }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});