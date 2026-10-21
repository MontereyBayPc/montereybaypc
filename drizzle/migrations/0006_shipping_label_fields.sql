ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS label_url text;
ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS label_cost numeric;
ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS quote_request_id uuid;