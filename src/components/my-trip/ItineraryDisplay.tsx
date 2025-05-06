'use client'
import React from 'react'
import { Trip } from '@/app/my-trip/page'

interface ItineraryDisplayProps {
  trip: Trip
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ trip }) => {
  // Group items by date
  const days: { [date: string]: typeof trip.items } = {}
  trip.items.forEach(item => {
    const dateStr = new Date(item.date).toDateString()
    if (!days[dateStr]) days[dateStr] = []
    days[dateStr].push(item)
  })

  // Sort dates
  const sortedDates = Object.keys(days).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div>
      <h2>Itinerary</h2>
      {sortedDates.length === 0 && <p>No planned activities yet.</p>}
      {sortedDates.map(dateStr => (
        <div key={dateStr}>
          <h3>{dateStr}</h3>
          <ul>
            {days[dateStr].map(item => (
              <li key={item.id}>
                {item.name} ({item.type})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default ItineraryDisplay
