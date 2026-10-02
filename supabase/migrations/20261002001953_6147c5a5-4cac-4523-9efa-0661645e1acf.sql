CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  order_ref text,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ci_kind CHECK (kind IN ('contact','order_status','beast')),
  CONSTRAINT ci_len CHECK (char_length(name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND char_length(message) <= 2000 AND coalesce(char_length(phone),0) <= 30 AND coalesce(char_length(order_ref),0) <= 100)
);
GRANT INSERT ON public.contact_inquiries TO anon, authenticated;
GRANT ALL ON public.contact_inquiries TO service_role;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  parts_total numeric NOT NULL DEFAULT 0,
  build_fee numeric NOT NULL DEFAULT 0,
  estimated_total numeric NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT qr_len CHECK (char_length(name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND coalesce(char_length(notes),0) <= 2000 AND coalesce(char_length(phone),0) <= 30)
);
GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a quote request" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');