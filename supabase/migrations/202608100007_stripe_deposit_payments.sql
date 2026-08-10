-- Stripe deposit payment state for Croatia360 bookings.
-- Operators may initiate a Checkout Session only through a controlled RPC.
-- Payment state itself is updated only by the verified Stripe webhook server path.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS deposit_cents INT CHECK (deposit_cents IS NULL OR deposit_cents > 0),
  ADD COLUMN IF NOT EXISTS payment_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_stripe_checkout_session_unique
  ON bookings(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE OR REPLACE FUNCTION operator_start_booking_payment(
  p_booking_id UUID,
  p_checkout_session_id TEXT,
  p_deposit_cents INT
)
RETURNS bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking bookings;
BEGIN
  IF p_checkout_session_id IS NULL OR length(trim(p_checkout_session_id)) < 8 THEN
    RAISE EXCEPTION 'Invalid checkout session id';
  END IF;

  IF p_deposit_cents IS NULL OR p_deposit_cents <= 0 THEN
    RAISE EXCEPTION 'Deposit must be greater than zero';
  END IF;

  SELECT b.*
    INTO v_booking
  FROM bookings b
  JOIN experiences e ON e.id = b.experience_id
  JOIN operators o ON o.id = e.operator_id
  WHERE b.id = p_booking_id
    AND o.owner_user_id = auth.uid()
  FOR UPDATE;

  IF v_booking.id IS NULL THEN
    RAISE EXCEPTION 'Booking not found or access denied';
  END IF;

  IF v_booking.total_cents IS NULL OR v_booking.quote_status <> 'quoted' THEN
    RAISE EXCEPTION 'A final quote is required before requesting payment';
  END IF;

  IF v_booking.payment_status <> 'unpaid' THEN
    RAISE EXCEPTION 'Payment has already been recorded for this booking';
  END IF;

  IF v_booking.status IN ('cancelled', 'completed', 'refunded') THEN
    RAISE EXCEPTION 'Booking cannot accept payment';
  END IF;

  IF p_deposit_cents > v_booking.total_cents THEN
    RAISE EXCEPTION 'Deposit cannot exceed booking total';
  END IF;

  UPDATE bookings
  SET stripe_checkout_session_id = p_checkout_session_id,
      deposit_cents = p_deposit_cents,
      payment_requested_at = now(),
      updated_at = now()
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$;

REVOKE ALL ON FUNCTION operator_start_booking_payment(UUID, TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION operator_start_booking_payment(UUID, TEXT, INT) TO authenticated;
