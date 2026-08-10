-- Croatia360 marketplace foundation
-- Operators, boats, experiences, availability, inquiries and bookings.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  website TEXT,
  city TEXT,
  country_code TEXT NOT NULL DEFAULT 'HR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  boat_type TEXT,
  manufacturer TEXT,
  model TEXT,
  year INT,
  max_guests INT NOT NULL CHECK (max_guests > 0),
  home_port TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (operator_id, slug)
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  boat_id UUID REFERENCES boats(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  city TEXT NOT NULL,
  region TEXT,
  category TEXT NOT NULL DEFAULT 'boat-tour',
  experience_type TEXT NOT NULL DEFAULT 'private' CHECK (experience_type IN ('private', 'shared', 'rental')),
  duration_minutes INT,
  max_guests INT CHECK (max_guests IS NULL OR max_guests > 0),
  base_price_cents INT CHECK (base_price_cents IS NULL OR base_price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  pricing_unit TEXT NOT NULL DEFAULT 'group' CHECK (pricing_unit IN ('group', 'person', 'hour', 'day')),
  instant_booking BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  meeting_point TEXT,
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  important_info JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_request', 'sold_out', 'blocked')),
  capacity INT,
  price_override_cents INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (experience_id, service_date)
);

CREATE TABLE IF NOT EXISTS booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  requested_date DATE NOT NULL,
  guests INT NOT NULL CHECK (guests > 0),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'accepted', 'declined', 'expired', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES booking_inquiries(id) ON DELETE SET NULL,
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  service_date DATE NOT NULL,
  guests INT NOT NULL CHECK (guests > 0),
  total_cents INT NOT NULL CHECK (total_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid', 'refunded', 'partially_refunded')),
  external_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boats_operator_id ON boats(operator_id);
CREATE INDEX IF NOT EXISTS idx_experiences_operator_id ON experiences(operator_id);
CREATE INDEX IF NOT EXISTS idx_experiences_city_status ON experiences(city, status);
CREATE INDEX IF NOT EXISTS idx_availability_experience_date ON availability(experience_id, service_date);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_experience_id ON booking_inquiries(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_date ON bookings(experience_id, service_date);

ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active operators" ON operators
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read active experiences" ON experiences
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read boats for active operators" ON boats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM operators o WHERE o.id = operator_id AND o.status = 'active')
  );

CREATE POLICY "Public can read active experience images" ON experience_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM experiences e WHERE e.id = experience_id AND e.status = 'active')
  );

CREATE POLICY "Public can read availability for active experiences" ON availability
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM experiences e WHERE e.id = experience_id AND e.status = 'active')
  );

CREATE POLICY "Authenticated users can create inquiries" ON booking_inquiries
  FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can read own inquiries" ON booking_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Operators manage own operator profile" ON operators
  FOR ALL USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Operators manage own boats" ON boats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM operators o WHERE o.id = operator_id AND o.owner_user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM operators o WHERE o.id = operator_id AND o.owner_user_id = auth.uid())
  );

CREATE POLICY "Operators manage own experiences" ON experiences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM operators o WHERE o.id = operator_id AND o.owner_user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM operators o WHERE o.id = operator_id AND o.owner_user_id = auth.uid())
  );
