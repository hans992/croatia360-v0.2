-- AdriaticByBoat rebrand: new bookings use ABB references.
-- Existing C360-* references are intentionally preserved for audit/history integrity.

CREATE OR REPLACE FUNCTION operator_decide_inquiry(
  p_inquiry_id UUID,
  p_decision TEXT
)
RETURNS booking_inquiries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inquiry booking_inquiries;
  v_operator_owned BOOLEAN;
  v_base_price_cents INT;
  v_currency TEXT;
BEGIN
  IF p_decision NOT IN ('accepted', 'declined', 'contacted') THEN
    RAISE EXCEPTION 'Unsupported inquiry decision';
  END IF;

  SELECT bi.*,
         EXISTS (
           SELECT 1
           FROM experiences e
           JOIN operators o ON o.id = e.operator_id
           WHERE e.id = bi.experience_id
             AND o.owner_user_id = auth.uid()
         )
    INTO v_inquiry, v_operator_owned
  FROM booking_inquiries bi
  WHERE bi.id = p_inquiry_id
  FOR UPDATE;

  IF v_inquiry.id IS NULL OR NOT v_operator_owned THEN
    RAISE EXCEPTION 'Inquiry not found or access denied';
  END IF;

  IF v_inquiry.status IN ('converted', 'expired') THEN
    RAISE EXCEPTION 'Inquiry can no longer be changed';
  END IF;

  UPDATE booking_inquiries
  SET status = p_decision,
      updated_at = now()
  WHERE id = p_inquiry_id
  RETURNING * INTO v_inquiry;

  IF p_decision = 'accepted' THEN
    SELECT base_price_cents, currency
      INTO v_base_price_cents, v_currency
    FROM experiences
    WHERE id = v_inquiry.experience_id;

    INSERT INTO availability (experience_id, service_date, status, notes, updated_at)
    VALUES (
      v_inquiry.experience_id,
      v_inquiry.requested_date,
      'blocked',
      'Blocked automatically after accepted booking inquiry ' || v_inquiry.id::text,
      now()
    )
    ON CONFLICT (experience_id, service_date)
    DO UPDATE SET
      status = 'blocked',
      notes = EXCLUDED.notes,
      updated_at = now();

    INSERT INTO bookings (
      inquiry_id,
      experience_id,
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      service_date,
      guests,
      total_cents,
      currency,
      status,
      payment_status,
      booking_reference,
      quote_status
    )
    VALUES (
      v_inquiry.id,
      v_inquiry.experience_id,
      v_inquiry.user_id,
      v_inquiry.customer_name,
      v_inquiry.customer_email,
      v_inquiry.customer_phone,
      v_inquiry.requested_date,
      v_inquiry.guests,
      v_base_price_cents,
      COALESCE(v_currency, 'EUR'),
      'pending',
      'unpaid',
      'ABB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
      CASE WHEN v_base_price_cents IS NULL THEN 'pending' ELSE 'quoted' END
    )
    ON CONFLICT (inquiry_id) WHERE inquiry_id IS NOT NULL
    DO NOTHING;
  END IF;

  RETURN v_inquiry;
END;
$$;

REVOKE ALL ON FUNCTION operator_decide_inquiry(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION operator_decide_inquiry(UUID, TEXT) TO authenticated;
