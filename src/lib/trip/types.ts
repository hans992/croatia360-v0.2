export type TripItemType = "hotel" | "activity" | "restaurant" | "transport" | "other";

export interface TripItem {
  id: string;
  trip_id?: string;
  day: number;
  title: string;
  description?: string;
  cost_cents: number;
  type: TripItemType;
  sort_order: number;
}

export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  budget_cents: number;
  start_date?: string; // YYYY-MM-DD
  items: TripItem[];
}
