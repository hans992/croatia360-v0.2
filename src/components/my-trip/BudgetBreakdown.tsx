'use client'
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Demo podaci na hrvatskom
const budgetData = [
  { name: 'Smještaj', value: 650, color: '#1E4B6D' },
  { name: 'Hrana i piće', value: 350, color: '#E94E35' },
  { name: 'Aktivnosti', value: 250, color: '#F9A826' },
  { name: 'Prijevoz', value: 180, color: '#4CAF50' },
  { name: 'Ostalo', value: 70, color: '#9C27B0' }
]

const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)

const BudgetBreakdown = () => (
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

export default BudgetBreakdown
