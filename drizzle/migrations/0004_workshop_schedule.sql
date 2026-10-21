ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS technician_name text NOT NULL DEFAULT '', ADD COLUMN IF NOT EXISTS scheduled_build_date date, ADD COLUMN IF NOT EXISTS planned_ship_date date, ADD COLUMN IF NOT EXISTS workshop_status text NOT NULL DEFAULT 'queued', ADD COLUMN IF NOT EXISTS internal_note text NOT NULL DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS one_active_build_per_day ON public.build_tracking (scheduled_build_date) WHERE scheduled_build_date IS NOT NULL AND stage <> 'completed';
CREATE OR REPLACE FUNCTION public.validate_workshop_schedule() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
IF NEW.workshop_status NOT IN ('queued','in_progress','blocked','ready_to_ship','shipped') THEN RAISE EXCEPTION 'Invalid workshop status'; END IF;
IF length(NEW.technician_name) > 120 OR length(NEW.internal_note) > 2000 THEN RAISE EXCEPTION 'Workshop details are too long'; END IF;
IF NEW.scheduled_build_date IS NOT NULL AND NEW.planned_ship_date IS NOT NULL AND NEW.planned_ship_date < NEW.scheduled_build_date THEN RAISE EXCEPTION 'Ship date must be on or after build date'; END IF;
RETURN NEW; END; $$;
CREATE TRIGGER validate_workshop_schedule BEFORE INSERT OR UPDATE ON public.build_tracking FOR EACH ROW EXECUTE FUNCTION public.validate_workshop_schedule();