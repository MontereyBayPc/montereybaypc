ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS approved_total numeric,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_token text UNIQUE;