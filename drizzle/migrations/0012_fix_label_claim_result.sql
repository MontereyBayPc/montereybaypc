CREATE OR REPLACE FUNCTION public.claim_label_purchase(p_id uuid, p_rate text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE changed integer;
BEGIN
UPDATE public.build_tracking SET label_purchase_claimed_at=now(), shipping_address_locked_at=coalesce(shipping_address_locked_at,now())
WHERE id=p_id AND fulfillment='us_shipping' AND held_at IS NULL AND refunded_at IS NULL
AND label_url IS NULL AND tracking_number IS NULL AND label_purchase_claimed_at IS NULL
AND p_rate=ANY(shipping_rate_ids) AND stage NOT IN ('completed','refunded');
GET DIAGNOSTICS changed = ROW_COUNT;
RETURN changed=1;
END; $$;
REVOKE ALL ON FUNCTION public.claim_label_purchase(uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_label_purchase(uuid,text) TO service_role;