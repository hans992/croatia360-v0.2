-- Operator workflow permissions for marketplace operations.
-- Operator ownership is determined exclusively through operators.owner_user_id = auth.uid().

CREATE POLICY "Operators manage own experience images" ON experience_images
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators manage own availability" ON availability
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators read own booking inquiries" ON booking_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators update own booking inquiries" ON booking_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators read own bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators update own bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );
