import type { Trip, TripItem } from "./types";

const STORAGE_KEY = "croatia360_trip";

export function getStoredTrip(): Trip | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Trip;
  } catch {
    return null;
  }
}

export function setStoredTrip(trip: Trip): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  } catch {
    // ignore
  }
}

export function createDefaultTrip(t: (key: string, opts?: Record<string, unknown>) => string): Trip {
  const id = crypto.randomUUID();
  const items: TripItem[] = [
    { id: crypto.randomUUID(), day: 1, title: t("my_trip_day_1_activity_1"), cost_cents: 80, type: "activity", sort_order: 0 },
    { id: crypto.randomUUID(), day: 1, title: t("my_trip_day_1_activity_2"), cost_cents: 0, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 1, title: t("my_trip_day_1_activity_3"), cost_cents: 100, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 1, title: t("my_trip_day_1_accommodation"), cost_cents: 120, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 2, title: t("my_trip_day_2_activity_1"), cost_cents: 0, type: "activity", sort_order: 0 },
    { id: crypto.randomUUID(), day: 2, title: t("my_trip_day_2_activity_2"), cost_cents: 0, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 2, title: t("my_trip_day_2_activity_3"), cost_cents: 120, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 2, title: t("my_trip_day_2_accommodation"), cost_cents: 120, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 3, title: t("my_trip_day_3_activity_1"), cost_cents: 80, type: "transport", sort_order: 0 },
    { id: crypto.randomUUID(), day: 3, title: t("my_trip_day_3_activity_2"), cost_cents: 70, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 3, title: t("my_trip_day_3_activity_3"), cost_cents: 0, type: "transport", sort_order: 2 },
    { id: crypto.randomUUID(), day: 3, title: t("my_trip_day_3_accommodation"), cost_cents: 120, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 4, title: t("my_trip_day_4_activity_1"), cost_cents: 100, type: "transport", sort_order: 0 },
    { id: crypto.randomUUID(), day: 4, title: t("my_trip_day_4_activity_2"), cost_cents: 0, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 4, title: t("my_trip_day_4_activity_3"), cost_cents: 80, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 4, title: t("my_trip_day_4_accommodation"), cost_cents: 180, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 5, title: t("my_trip_day_5_activity_1"), cost_cents: 60, type: "transport", sort_order: 0 },
    { id: crypto.randomUUID(), day: 5, title: t("my_trip_day_5_activity_2"), cost_cents: 0, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 5, title: t("my_trip_day_5_activity_3"), cost_cents: 130, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 5, title: t("my_trip_day_5_accommodation"), cost_cents: 180, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 6, title: t("my_trip_day_6_activity_1"), cost_cents: 120, type: "transport", sort_order: 0 },
    { id: crypto.randomUUID(), day: 6, title: t("my_trip_day_6_activity_2"), cost_cents: 0, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 6, title: t("my_trip_day_6_activity_3"), cost_cents: 120, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 6, title: t("my_trip_day_6_accommodation"), cost_cents: 120, type: "hotel", sort_order: 3 },
    { id: crypto.randomUUID(), day: 7, title: t("my_trip_day_7_activity_1"), cost_cents: 80, type: "activity", sort_order: 0 },
    { id: crypto.randomUUID(), day: 7, title: t("my_trip_day_7_activity_2"), cost_cents: 60, type: "activity", sort_order: 1 },
    { id: crypto.randomUUID(), day: 7, title: t("my_trip_day_7_activity_3"), cost_cents: 100, type: "restaurant", sort_order: 2 },
    { id: crypto.randomUUID(), day: 7, title: t("my_trip_day_7_accommodation"), cost_cents: 120, type: "hotel", sort_order: 3 },
  ];
  return {
    id,
    title: "7-day Dalmatian coast adventure",
    budget_cents: 150000, // €1500
    start_date: "2025-09-01",
    items,
  };
}

export function getOrCreateTrip(t: (key: string, opts?: Record<string, unknown>) => string): Trip {
  const stored = getStoredTrip();
  if (stored?.items?.length) return stored;
  const defaultTrip = createDefaultTrip(t);
  setStoredTrip(defaultTrip);
  return defaultTrip;
}
