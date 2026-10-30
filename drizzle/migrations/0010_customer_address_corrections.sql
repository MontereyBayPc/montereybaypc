ALTER TABLE public.build_tracking ADD COLUMN IF NOT EXISTS shipping_address_locked_at timestamptz;
CREATE OR REPLACE FUNCTION public.correct_order_address(p_token text, p_address jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE changed uuid;
BEGIN
  IF p_token !~ '^[a-f0-9]{64}$' OR jsonb_typeof(p_address) <> 'object' THEN RETURN false; END IF;
  UPDATE public.build_tracking SET shipping_address = p_address || jsonb_build_object('quoted_zip', shipping_address->>'quoted_zip'), updated_at = now()
  WHERE tracking_token = p_token AND expires_at > now() AND fulfillment = 'us_shipping'
    AND shipping_address_locked_at IS NULL AND tracking_number IS NULL AND label_url IS NULL AND refunded_at IS NULL
    AND stage NOT IN ('ready_for_pickup','completed','refunded') AND workshop_status NOT IN ('ready_to_ship','shipped')
    AND p_address->>'country' = 'US' AND p_address->>'postal_code' = shipping_address->>'postal_code'
    AND p_address->>'postal_code' = shipping_address->>'quoted_zip'
    AND length(p_address->>'name') BETWEEN 1 AND 100 AND length(p_address->>'line1') BETWEEN 1 AND 120
    AND length(p_address->>'city') BETWEEN 1 AND 80 AND length(p_address->>'state') = 2
  RETURNING id INTO changed;
  RETURN changed IS NOT NULL;
END; $$;
REVOKE ALL ON FUNCTION public.correct_order_address(text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.correct_order_address(text,jsonb) TO service_role;