"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { defaultNS, type Locale } from "@/lib/i18n/settings";
import { getOrCreateTrip, setStoredTrip } from "@/lib/trip/storage";
import type { Trip } from "@/lib/trip/types";
import DraggableItinerary from "@/components/my-trip/DraggableItinerary";

const heroImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

function HeroSection() {
  const { t } = useTranslation(defaultNS);

  return (
    <header
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.5)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        padding: "64px 0 48px 0",
        textAlign: "center",
        borderRadius: "0 0 32px 32px",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: 8 }}>
        {t("my_trip_title")}
      </h1>
      <p style={{ fontSize: "1.25rem", fontWeight: 400, marginBottom: 24 }}>
        {t("my_trip_tagline")}
      </p>
      <a
        href="#plan"
        style={{
          background: "#E94E35",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: 32,
          fontWeight: 600,
          fontSize: "1.1rem",
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        }}
      >
        {t("my_trip_view_plan")}
      </a>
    </header>
  );
}

function QuickFacts({ trip }: { trip: Trip }) {
  const { t } = useTranslation(defaultNS);
  const totalSpent = trip.items.reduce((s, i) => s + i.cost_cents, 0);
  const destinations = [...new Set(trip.items.map((i) => i.title.split(" ")[0]))].slice(0, 3);

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 40,
        margin: "32px 0",
        flexWrap: "wrap",
      }}
    >
      <Fact icon="⏱️" label={t("my_trip_duration_label")} value={t("my_trip_duration_value")} />
      <Fact
        icon="💶"
        label={t("my_trip_budget_label")}
        value={`€${(trip.budget_cents / 100).toFixed(0)}`}
      />
      <Fact
        icon="📍"
        label={t("my_trip_destinations_label")}
        value={destinations.length ? destinations.join(", ") : "Split, Hvar, Dubrovnik"}
      />
    </section>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: "#555", fontSize: 18 }}>{value}</div>
    </div>
  );
}

function BudgetBreakdown({ trip }: { trip: Trip }) {
  const { t } = useTranslation(defaultNS);

  const byType: Record<string, number> = {
    hotel: 0,
    activity: 0,
    restaurant: 0,
    transport: 0,
    other: 0,
  };
  trip.items.forEach((item) => {
    const key = item.type in byType ? item.type : "other";
    byType[key] += item.cost_cents;
  });

  const budgetData = [
    { name: t("my_trip_budget_accommodation"), value: byType.hotel, color: "#1E4B6D" },
    { name: t("my_trip_budget_food"), value: byType.restaurant, color: "#E94E35" },
    { name: t("my_trip_budget_activities"), value: byType.activity, color: "#F9A826" },
    { name: t("my_trip_budget_transport"), value: byType.transport, color: "#4CAF50" },
    { name: t("my_trip_budget_other"), value: byType.other, color: "#9C27B0" },
  ].filter((d) => d.value > 0);

  const totalSpent = trip.items.reduce((s, i) => s + i.cost_cents, 0);
  const budgetPercent = Math.min(100, (totalSpent / trip.budget_cents) * 100);

  return (
    <section style={{ margin: "40px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 16 }}>
        {t("my_trip_budget_breakdown_title")}
      </h2>
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={budgetData.length ? budgetData : [{ name: "-", value: 1, color: "#666" }]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                budgetData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {(budgetData.length ? budgetData : [{ color: "#666" }]).map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `€${(value / 100).toFixed(0)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="max-w-md mx-auto mt-4 space-y-2">
        <Progress value={budgetPercent} className="h-3" />
        <div style={{ fontWeight: 600 }}>
          {t("my_trip_estimated_total")}: €{(totalSpent / 100).toFixed(0)} / €
          {(trip.budget_cents / 100).toFixed(0)}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";

  return (
    <section
      style={{
        background: "linear-gradient(90deg, #1E4B6D 60%, #E94E35 100%)",
        color: "#fff",
        borderRadius: 24,
        padding: "40px 0",
        margin: "56px 0 0 0",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>
        {t("my_trip_cta_title")}
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: 24 }}>{t("my_trip_cta_text")}</p>
      <Link
        href={`/${locale}/chat`}
        style={{
          background: "#fff",
          color: "#E94E35",
          padding: "14px 44px",
          borderRadius: 32,
          fontWeight: 700,
          fontSize: "1.2rem",
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        }}
      >
        {t("my_trip_cta_button")}
      </Link>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation(defaultNS);

  return (
    <footer
      style={{
        marginTop: 56,
        padding: 24,
        textAlign: "center",
        color: "#888",
        fontSize: 14,
      }}
    >
      {t("my_trip_footer", { year: new Date().getFullYear() })}
    </footer>
  );
}

export default function MyTripPage() {
  const { t } = useTranslation(defaultNS);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    setTrip(getOrCreateTrip(t));
  }, [t]);

  const handleTripChange = (updated: Trip) => {
    setTrip(updated);
    setStoredTrip(updated);
  };

  if (!trip) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <HeroSection />
      <QuickFacts trip={trip} />
      <BudgetBreakdown trip={trip} />
      <section id="plan" style={{ margin: "56px 0 40px 0", padding: "0 1rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {t("my_trip_itinerary_title")}
        </h2>
        <DraggableItinerary trip={trip} onTripChange={handleTripChange} />
      </section>
      <CallToAction />
      <Footer />
    </div>
  );
}
