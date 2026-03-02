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
import { Button } from "@/components/ui/button";
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
      className="relative bg-cover bg-center text-white text-center rounded-b-3xl overflow-hidden py-16 md:py-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.5)), url(${heroImage})`,
      }}
    >
      <h1 className="text-display text-white mb-2 drop-shadow-md">
        {t("my_trip_title")}
      </h1>
      <p className="text-body-lg text-white/90 mb-6">
        {t("my_trip_tagline")}
      </p>
      <Button asChild size="lg" className="rounded-full font-semibold shadow-elevated">
        <a href="#plan">{t("my_trip_view_plan")}</a>
      </Button>
    </header>
  );
}

function QuickFacts({ trip }: { trip: Trip }) {
  const { t } = useTranslation(defaultNS);
  const destinations = [...new Set(trip.items.map((i) => i.title.split(" ")[0]))].slice(0, 3);

  return (
    <section className="flex flex-wrap justify-center gap-8 md:gap-10 my-12">
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
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-heading font-bold text-foreground text-sm">{label}</div>
      <div className="text-body-lg text-muted-foreground">{value}</div>
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
    { name: t("my_trip_budget_accommodation"), value: byType.hotel, color: "#1e3a5f" },
    { name: t("my_trip_budget_food"), value: byType.restaurant, color: "#dc2626" },
    { name: t("my_trip_budget_activities"), value: byType.activity, color: "#ca8a04" },
    { name: t("my_trip_budget_transport"), value: byType.transport, color: "#16a34a" },
    { name: t("my_trip_budget_other"), value: byType.other, color: "#7c3aed" },
  ].filter((d) => d.value > 0);

  const totalSpent = trip.items.reduce((s, i) => s + i.cost_cents, 0);
  const budgetPercent = Math.min(100, (totalSpent / trip.budget_cents) * 100);

  return (
    <section className="my-16 text-center">
      <h2 className="text-h3 text-foreground mb-6">
        {t("my_trip_budget_breakdown_title")}
      </h2>
      <div className="w-full max-w-[420px] mx-auto">
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
      <div className="max-w-md mx-auto mt-6 space-y-2">
        <Progress value={budgetPercent} className="h-3" />
        <div className="font-semibold text-foreground">
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
    <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl py-12 md:py-14 mt-20 text-center px-6">
      <h2 className="text-h2 text-white mb-4">
        {t("my_trip_cta_title")}
      </h2>
      <p className="text-body-lg text-white/90 mb-6">{t("my_trip_cta_text")}</p>
      <Button asChild size="lg" className="rounded-full font-bold bg-white text-primary hover:bg-white/90 shadow-elevated border-0">
        <Link href={`/${locale}/chat`}>{t("my_trip_cta_button")}</Link>
      </Button>
    </section>
  );
}

function MyTripFooter() {
  const { t } = useTranslation(defaultNS);

  return (
    <footer className="mt-20 py-8 text-center text-caption border-t border-border">
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
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground container mx-auto px-4">
      <HeroSection />
      <QuickFacts trip={trip} />
      <BudgetBreakdown trip={trip} />
      <section id="plan" className="my-16 md:my-20">
        <h2 className="section-title text-center mb-8">
          {t("my_trip_itinerary_title")}
        </h2>
        <DraggableItinerary trip={trip} onTripChange={handleTripChange} />
      </section>
      <CallToAction />
      <MyTripFooter />
    </div>
  );
}
