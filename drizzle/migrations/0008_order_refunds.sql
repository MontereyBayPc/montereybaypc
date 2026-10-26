ALTER TABLE public.build_tracking DROP CONSTRAINT build_tracking_stage_check;
ALTER TABLE public.build_tracking ADD CONSTRAINT build_tracking_stage_check CHECK (stage IN ('parts_ordered','bench_assembly','cable_management','stress_testing','ready_for_pickup','completed','refunded'));
ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS stripe_env text;
ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS refunded_at timestamptz;
DROP INDEX IF EXISTS public.one_active_build_per_day;
CREATE UNIQUE INDEX one_active_build_per_day ON public.build_tracking (scheduled_build_date) WHERE scheduled_build_date IS NOT NULL AND stage NOT IN ('completed','refunded');