'use client'
import React from 'react'
import { Trip } from '@/app/my-trip/page'

interface CostEstimatorProps {
  trip: Trip
}

const CostEstimator: React.FC<CostEstimatorProps> = ({ trip }) => {
  // Example cost calculation by type
  const costByType: { [key: string]: number } = {
    Accommodation: 120,
    Activity: 80,
    Food: 40,
    Transport: 60
  }
  const categories = ['Accommodation', 'Food', 'Activity', 'Transport']
  const tripCosts = {
    total: trip.items.reduce((sum, item) => sum + (costByType[item.type] || 50), 0),
    categories: categories.map(cat => ({
      name: cat,
      amount: trip.items.filter(item => item.type === cat).length * (costByType[cat] || 50),
      icon: cat === 'Accommodation' ? '🏨' : cat === 'Food' ? '🍽️' : cat === 'Activity' ? '🏄‍♂️' : '🚗'
    }))
  }

  return (
    <div>
      <h2>Estimated total: €{tripCosts.total}</h2>
      <ul>
        {tripCosts.categories.map(cat => (
          <li key={cat.name}>{cat.icon} {cat.name}: €{cat.amount}</li>
        ))}
      </ul>
    </div>
  )
}

export default CostEstimator
