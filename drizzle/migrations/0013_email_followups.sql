ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS review_requested_at timestamptz;
CREATE TABLE public.quote_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  build_url text NOT NULL,
  estimated_total numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  reminded_at timestamptz,
  submitted_at timestamptz
);
GRANT ALL ON public.quote_reminders TO service_role;
ALTER TABLE public.quote_reminders ENABLE ROW LEVEL SECURITY;
CREATE INDEX quote_reminders_email_idx ON public.quote_reminders (lower(email));