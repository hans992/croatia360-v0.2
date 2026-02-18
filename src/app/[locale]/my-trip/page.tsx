'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { defaultNS, type Locale } from '@/lib/i18n/settings'

// --- MOCK DATA (structure only; content comes from translations) ---
const heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
const budget = 1500
const destinations = ["Split", "Hvar", "Dubrovnik"]
const dayCosts = [180, 120, 150, 220, 190, 240, 200]

const budgetDataKeys = [
  { key: 'my_trip_budget_accommodation', value: 650, color: '#1E4B6D' },
  { key: 'my_trip_budget_food', value: 350, color: '#E94E35' },
  { key: 'my_trip_budget_activities', value: 250, color: '#F9A826' },
  { key: 'my_trip_budget_transport', value: 180, color: '#4CAF50' },
  { key: 'my_trip_budget_other', value: 70, color: '#9C27B0' }
]

// --- COMPONENTS ---

function HeroSection() {
  const { t } = useTranslation(defaultNS)

  return (
    <header style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.5)), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
      padding: '64px 0 48px 0',
      textAlign: 'center',
      borderRadius: '0 0 32px 32px'
    }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 8 }}>{t('my_trip_title')}</h1>
      <p style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: 24 }}>{t('my_trip_tagline')}</p>
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
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
        }}
      >
        {t('my_trip_view_plan')}
      </a>
    </header>
  )
}

function QuickFacts() {
  const { t } = useTranslation(defaultNS)

  return (
    <section style={{
      display: 'flex', justifyContent: 'center', gap: 40, margin: '32px 0'
    }}>
      <Fact icon="⏱️" label={t('my_trip_duration_label')} value={t('my_trip_duration_value')} />
      <Fact icon="💶" label={t('my_trip_budget_label')} value={`€${budget}`} />
      <Fact icon="📍" label={t('my_trip_destinations_label')} value={destinations.join(', ')} />
    </section>
  )
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: '#555', fontSize: 18 }}>{value}</div>
    </div>
  )
}

function BudgetBreakdown() {
  const { t } = useTranslation(defaultNS)
  const budgetData = budgetDataKeys.map(({ key, value, color }) => ({
    name: t(key),
    value,
    color
  }))
  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)

  return (
    <section style={{ margin: '40px 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>{t('my_trip_budget_breakdown_title')}</h2>
      <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={budgetData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {budgetData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `€${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 12, fontWeight: 600 }}>{t('my_trip_estimated_total')}: €{totalBudget}</div>
    </section>
  )
}

function ItineraryDisplay() {
  const { t } = useTranslation(defaultNS)

  const days = [1, 2, 3, 4, 5, 6, 7].map((dayNum) => ({
    day: dayNum,
    title: t(`my_trip_day_${dayNum}_title`),
    activities: [
      t(`my_trip_day_${dayNum}_activity_1`),
      t(`my_trip_day_${dayNum}_activity_2`),
      t(`my_trip_day_${dayNum}_activity_3`)
    ],
    accommodation: t(`my_trip_day_${dayNum}_accommodation`),
    cost: dayCosts[dayNum - 1]
  }))

  return (
    <section id="plan" style={{ margin: '56px 0 40px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>{t('my_trip_itinerary_title')}</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32, maxWidth: 1000, margin: '0 auto'
      }}>
        {days.map(day => (
          <div key={day.day} style={{
            background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(30,75,109,0.08)',
            padding: 24, display: 'flex', flexDirection: 'column', minHeight: 320
          }}>
            <div style={{ color: '#E94E35', fontWeight: 700, marginBottom: 4 }}>{t('my_trip_day', { n: day.day })}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{day.title}</div>
            <ul style={{ paddingLeft: 18, marginBottom: 12, color: '#333' }}>
              {day.activities.map((act, i) => <li key={i}>{act}</li>)}
            </ul>
            <div style={{ marginTop: 'auto', fontSize: 15, color: '#555' }}>
              <span style={{ marginRight: 8 }}>🏨 {day.accommodation}</span>
              <span style={{ float: 'right', fontWeight: 700 }}>€{day.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CallToAction() {
  const { t } = useTranslation(defaultNS)
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'

  return (
    <section style={{
      background: 'linear-gradient(90deg, #1E4B6D 60%, #E94E35 100%)',
      color: '#fff',
      borderRadius: 24,
      padding: '40px 0',
      margin: '56px 0 0 0',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{t('my_trip_cta_title')}</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>{t('my_trip_cta_text')}</p>
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
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
        }}
      >
        {t('my_trip_cta_button')}
      </Link>
    </section>
  )
}

function Footer() {
  const { t } = useTranslation(defaultNS)

  return (
    <footer style={{
      marginTop: 56, padding: 24, textAlign: 'center', color: '#888', fontSize: 14
    }}>
      {t('my_trip_footer', { year: new Date().getFullYear() })}
    </footer>
  )
}

// --- MAIN PAGE ---
export default function MyTripPage() {
  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f7f9fc', minHeight: '100vh' }}>
      <HeroSection />
      <QuickFacts />
      <BudgetBreakdown />
      <ItineraryDisplay />
      <CallToAction />
      <Footer />
    </div>
  )
}
