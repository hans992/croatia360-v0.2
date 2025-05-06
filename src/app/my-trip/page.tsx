'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// --- MOCK PODACI ---
const itinerary = {
  title: "7-dnevna avantura dalmatinske obale",
  tagline: "Isplanirajte svoje idealno putovanje duž zadivljujuće hrvatske obale.",
  heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  budget: 1500,
  duration: "7 dana",
  destinations: ["Split", "Hvar", "Dubrovnik"],
  days: [
    {
      day: 1,
      title: "Dolazak u Split",
      activities: [
        "Prijava u smještaj u staroj gradskoj jezgri Splita",
        "Večernja šetnja Dioklecijanovom palačom",
        "Večera u tradicionalnoj konobi"
      ],
      accommodation: "Apartman u staroj gradskoj jezgri Splita",
      cost: 180
    },
    {
      day: 2,
      title: "Istraživanje Splita",
      activities: [
        "Jutarnji uspon na Marjan s panoramskim pogledom",
        "Popodne na plaži Bačvice",
        "Večernja gastro tura u centru"
      ],
      accommodation: "Apartman u staroj gradskoj jezgri Splita",
      cost: 120
    },
    {
      day: 3,
      title: "Izlet u Trogir",
      activities: [
        "Jutarnji trajekt do Trogira (UNESCO)",
        "Vođeni obilazak srednjovjekovnog grada",
        "Povratak u Split navečer"
      ],
      accommodation: "Apartman u staroj gradskoj jezgri Splita",
      cost: 150
    },
    {
      day: 4,
      title: "Split – Hvar",
      activities: [
        "Jutarnji trajekt za otok Hvar",
        "Prijava u smještaj",
        "Popodne istraživanje Hvara",
        "Zalazak sunca u Hula Hula Beach Baru"
      ],
      accommodation: "Boutique hotel u Hvaru",
      cost: 220
    },
    {
      day: 5,
      title: "Obilazak otoka Hvara",
      activities: [
        "Najam skutera za obilazak otoka",
        "Posjet poljima lavande i vinogradima",
        "Kupanje na plaži Dubovica",
        "Večernja degustacija vina"
      ],
      accommodation: "Boutique hotel u Hvaru",
      cost: 190
    },
    {
      day: 6,
      title: "Hvar – Dubrovnik",
      activities: [
        "Jutarnji katamaran za Dubrovnik",
        "Prijava u smještaj",
        "Popodne šetnja dubrovačkim zidinama",
        "Večera u staroj gradskoj jezgri"
      ],
      accommodation: "Gostinjska kuća u staroj gradskoj jezgri Dubrovnika",
      cost: 240
    },
    {
      day: 7,
      title: "Istraživanje Dubrovnika",
      activities: [
        "Obilazak lokacija iz serije 'Igra prijestolja'",
        "Uspon žičarom na Srđ za zalazak sunca",
        "Završna večera u restoranu s panoramskim pogledom"
      ],
      accommodation: "Gostinjska kuća u staroj gradskoj jezgri Dubrovnika",
      cost: 200
    }
  ]
}

const budgetData = [
  { name: 'Smještaj', value: 650, color: '#1E4B6D' },
  { name: 'Hrana i piće', value: 350, color: '#E94E35' },
  { name: 'Aktivnosti', value: 250, color: '#F9A826' },
  { name: 'Prijevoz', value: 180, color: '#4CAF50' },
  { name: 'Ostalo', value: 70, color: '#9C27B0' }
]

// --- KOMPONENTE ---

function HeroSection() {
  return (
    <header style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.5)), url(${itinerary.heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
      padding: '64px 0 48px 0',
      textAlign: 'center',
      borderRadius: '0 0 32px 32px'
    }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 8 }}>{itinerary.title}</h1>
      <p style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: 24 }}>{itinerary.tagline}</p>
      <a href="#plan" style={{
        background: "#E94E35",
        color: "#fff",
        padding: "12px 32px",
        borderRadius: 32,
        fontWeight: 600,
        fontSize: "1.1rem",
        textDecoration: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
      }}>Pogledaj plan</a>
    </header>
  )
}

function QuickFacts() {
  return (
    <section style={{
      display: 'flex', justifyContent: 'center', gap: 40, margin: '32px 0'
    }}>
      <Fact icon="⏱️" label="Trajanje" value={itinerary.duration} />
      <Fact icon="💶" label="Budžet" value={`€${itinerary.budget}`} />
      <Fact icon="📍" label="Destinacije" value={itinerary.destinations.join(', ')} />
    </section>
  )
}
function Fact({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: '#555', fontSize: 18 }}>{value}</div>
    </div>
  )
}

function BudgetBreakdown() {
  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)
  return (
    <section style={{ margin: '40px 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>Raspodjela budžeta</h2>
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
      <div style={{ marginTop: 12, fontWeight: 600 }}>Procijenjeni ukupni trošak: €{totalBudget}</div>
    </section>
  )
}

function ItineraryDisplay() {
  return (
    <section id="plan" style={{ margin: '56px 0 40px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>Vaš itinerar</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32, maxWidth: 1000, margin: '0 auto'
      }}>
        {itinerary.days.map(day => (
          <div key={day.day} style={{
            background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(30,75,109,0.08)',
            padding: 24, display: 'flex', flexDirection: 'column', minHeight: 320
          }}>
            <div style={{ color: '#E94E35', fontWeight: 700, marginBottom: 4 }}>Dan {day.day}</div>
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
  return (
    <section style={{
      background: 'linear-gradient(90deg, #1E4B6D 60%, #E94E35 100%)',
      color: '#fff',
      borderRadius: 24,
      padding: '40px 0',
      margin: '56px 0 0 0',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Spremni za svoju avanturu?</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>Prilagodite ovaj plan ili kreirajte svoje putovanje po Hrvatskoj već sada.</p>
      <a href="#" style={{
        background: "#fff",
        color: "#E94E35",
        padding: "14px 44px",
        borderRadius: 32,
        fontWeight: 700,
        fontSize: "1.2rem",
        textDecoration: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
      }}>Započni planiranje</a>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      marginTop: 56, padding: 24, textAlign: 'center', color: '#888', fontSize: 14
    }}>
      © {new Date().getFullYear()} Croatia360. Izrađeno s ❤️ za vašu sljedeću avanturu.
    </footer>
  )
}

// --- GLAVNA STRANICA ---
export default function PrezentacijskiItinerar() {
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
