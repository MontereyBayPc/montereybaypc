ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS parts_cost numeric, ADD COLUMN IF NOT EXISTS labor_cost numeric, ADD COLUMN IF NOT EXISTS other_cost numeric, ADD COLUMN IF NOT EXISTS net_revenue numeric, ADD COLUMN IF NOT EXISTS hold_reason text, ADD COLUMN IF NOT EXISTS hold_until date, ADD COLUMN IF NOT EXISTS held_at timestamptz, ADD COLUMN IF NOT EXISTS hold_previous_status text, ADD COLUMN IF NOT EXISTS carrier_status text, ADD COLUMN IF NOT EXISTS carrier_updated_at timestamptz, ADD COLUMN IF NOT EXISTS delivered_at timestamptz;
ALTER TABLE public.parts ADD COLUMN IF NOT EXISTS cost_override numeric;
COMMENT ON COLUMN public.parts.cost_override IS 'Private staff procurement cost override; does not change customer catalog price.';
REVOKE SELECT ON public.parts FROM anon, authenticated;
GRANT SELECT (id, category, name, base_price, price, price_source, price_updated_at, last_checked_at, sort, active, created_at) ON public.parts TO anon, authenticated;
GRANT ALL ON public.parts TO service_role;
GRANT ALL ON public.build_tracking TO service_role;