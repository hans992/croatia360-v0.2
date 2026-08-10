-- Seed the existing San Luca Magno prototype into the marketplace model.
-- Commercial pricing is intentionally left NULL until operator terms are confirmed.

INSERT INTO operators (name, slug, email, city, country_code, status)
VALUES ('San Luca Magno', 'san-luca-magno', 'info@sanluca-magno.hr', 'Zadar', 'HR', 'active')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  city = EXCLUDED.city,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO boats (
  operator_id,
  name,
  slug,
  boat_type,
  year,
  max_guests,
  home_port,
  description,
  metadata
)
SELECT
  o.id,
  'San Luca Magno',
  'san-luca-magno',
  'motor-sailer',
  1968,
  12,
  'Zadar',
  'Historic motor sailer used for private day trips through the Zadar archipelago.',
  '{"renovated_year": 2020}'::jsonb
FROM operators o
WHERE o.slug = 'san-luca-magno'
ON CONFLICT (operator_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  boat_type = EXCLUDED.boat_type,
  year = EXCLUDED.year,
  max_guests = EXCLUDED.max_guests,
  home_port = EXCLUDED.home_port,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO experiences (
  operator_id,
  boat_id,
  slug,
  title,
  short_description,
  description,
  city,
  region,
  category,
  experience_type,
  duration_minutes,
  max_guests,
  base_price_cents,
  currency,
  pricing_unit,
  instant_booking,
  status,
  meeting_point,
  included,
  important_info,
  metadata
)
SELECT
  o.id,
  b.id,
  'san-luca-magno-kornati-telascica-private-tour',
  'San Luca Magno: Privatni izlet jedrenjakom na Kornate i Telašćicu iz Zadra',
  'Otkrijte Kornate i Telašćicu na privatnom cjelodnevnom izletu autentičnim motornim jedrenjakom iz Zadra, uz kupanje, domaću hranu i fleksibilnu rutu za grupe do 12 osoba.',
  E'Zaplovite iz Zadra na povijesnom jedrenjaku San Luca Magno, izgrađenom 1968. i obnovljenom 2020., te istražite zadarski arhipelag uz privatnu posadu.\n\nCjelodnevni izlet vodi prema Nacionalnom parku Kornati i Parku prirode Telašćica, s pauzama za kupanje, ronjenje i SUP u uvalama koje kapetan prilagođava vremenu i željama gostiju.\n\nDoručak i ručak pripremaju se na brodu, a u iskustvo su uključena pića, gorivo i oprema za aktivnosti na moru.',
  'Zadar',
  'Dalmatia',
  'boat-tour',
  'private',
  540,
  12,
  NULL,
  'EUR',
  'group',
  false,
  'active',
  'Zadar, Croatia',
  '["Privatni najam broda s kapetanom", "Cjelodnevni izlet od približno 9 sati", "Doručak i ručak na brodu", "Voda, kava, limunada i domaće vino", "Oprema za ronjenje i SUP", "Gorivo"]'::jsonb,
  '["Polazak iz Zadra, prema dogovorenoj lokaciji.", "Uobičajeni polazak je oko 09:00.", "Maksimalno 12 gostiju.", "Rezervacija je trenutno dostupna na upit."]'::jsonb,
  '{"source": "legacy-partner-page", "commercial_terms_confirmed": false}'::jsonb
FROM operators o
JOIN boats b ON b.operator_id = o.id AND b.slug = 'san-luca-magno'
WHERE o.slug = 'san-luca-magno'
ON CONFLICT (slug) DO UPDATE SET
  operator_id = EXCLUDED.operator_id,
  boat_id = EXCLUDED.boat_id,
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  category = EXCLUDED.category,
  experience_type = EXCLUDED.experience_type,
  duration_minutes = EXCLUDED.duration_minutes,
  max_guests = EXCLUDED.max_guests,
  currency = EXCLUDED.currency,
  pricing_unit = EXCLUDED.pricing_unit,
  instant_booking = EXCLUDED.instant_booking,
  status = EXCLUDED.status,
  meeting_point = EXCLUDED.meeting_point,
  included = EXCLUDED.included,
  important_info = EXCLUDED.important_info,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO experience_images (experience_id, url, alt_text, sort_order, is_cover)
SELECT e.id, image.url, image.alt_text, image.sort_order, image.is_cover
FROM experiences e
CROSS JOIN (VALUES
  ('https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_1.jpg', 'San Luca Magno u zadarskom arhipelagu', 0, true),
  ('https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_2.jpg', 'Jedrenjak San Luca Magno na moru', 1, false),
  ('https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_3.jpg', 'Privatni izlet brodom iz Zadra', 2, false)
) AS image(url, alt_text, sort_order, is_cover)
WHERE e.slug = 'san-luca-magno-kornati-telascica-private-tour'
  AND NOT EXISTS (
    SELECT 1 FROM experience_images existing
    WHERE existing.experience_id = e.id AND existing.url = image.url
  );

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

CREATE POLICY "Operators can read inquiries for own experiences" ON booking_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM experiences e
      JOIN operators o ON o.id = e.operator_id
      WHERE e.id = experience_id AND o.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Operators can update inquiries for own experiences" ON booking_inquiries
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
