CREATE TABLE public.service_work_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 100),
 customer_email text NOT NULL CHECK (char_length(customer_email) BETWEEN 3 AND 255),
 hardware text NOT NULL CHECK (char_length(hardware) BETWEEN 1 AND 500),
 requested_work text NOT NULL CHECK (char_length(requested_work) BETWEEN 1 AND 1000),
 agreement_version text NOT NULL,
 accepted_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.service_work_orders TO service_role;
ALTER TABLE public.service_work_orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.build_tracking (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tracking_token text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-',''),
 build_name text NOT NULL CHECK (char_length(build_name) BETWEEN 1 AND 160),
 stage text NOT NULL DEFAULT 'parts_ordered' CHECK (stage IN ('parts_ordered','bench_assembly','cable_management','stress_testing','ready_for_pickup')),
 customer_note text NOT NULL DEFAULT '' CHECK (char_length(customer_note)<=2000),
 photo_paths text[] NOT NULL DEFAULT '{}',
 updated_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT now() + interval '180 days'
);
GRANT ALL ON public.build_tracking TO service_role;
ALTER TABLE public.build_tracking ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.touch_build_tracking() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_build_tracking BEFORE UPDATE ON public.build_tracking FOR EACH ROW EXECUTE FUNCTION public.touch_build_tracking();
COMMENT ON TABLE public.build_tracking IS 'Owner manages stages and private photo paths through Lovable Cloud. Public customers read only via unguessable, expiring tracking token edge function. No public table access.';