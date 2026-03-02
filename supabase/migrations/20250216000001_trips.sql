-- Trips table for user trip planning
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  budget_cents INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trip items: day, activity, cost, order
CREATE TABLE IF NOT EXISTS trip_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  day INT NOT NULL,
  title TEXT,
  description TEXT,
  cost_cents INT DEFAULT 0,
  type TEXT CHECK (type IN ('hotel', 'activity', 'restaurant', 'transport', 'other')),
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trip_items_trip_id ON trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);

-- RLS policies (enable when auth is configured)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage items of own trips" ON trip_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid())
  );
