ALTER TABLE public.build_tracking
  ADD COLUMN IF NOT EXISTS order_ref text UNIQUE,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS amount_total numeric,
  ADD COLUMN IF NOT EXISTS fulfillment text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();