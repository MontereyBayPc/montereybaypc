CREATE TABLE public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  base_price numeric NOT NULL,
  price numeric NOT NULL,
  price_source text,
  price_updated_at timestamptz,
  last_checked_at timestamptz,
  sort int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, name)
);
GRANT SELECT ON public.parts TO anon, authenticated;
GRANT ALL ON public.parts TO service_role;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active parts" ON public.parts FOR SELECT USING (active = true);

CREATE TABLE public.price_job_state (
  id int PRIMARY KEY DEFAULT 1,
  locked_until timestamptz,
  paused_reason text,
  last_run_at timestamptz
);
GRANT ALL ON public.price_job_state TO service_role;
ALTER TABLE public.price_job_state ENABLE ROW LEVEL SECURITY;
INSERT INTO public.price_job_state (id) VALUES (1);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;