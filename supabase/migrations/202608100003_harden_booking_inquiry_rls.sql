-- Anonymous request-to-book submissions must go through the server API,
-- where experience status, date and capacity are validated.
-- The service-role key bypasses RLS server-side; the public anon key must not
-- be able to insert arbitrary inquiry rows directly.

DROP POLICY IF EXISTS "Authenticated users can create inquiries" ON booking_inquiries;

CREATE POLICY "Authenticated users can create own inquiries" ON booking_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
