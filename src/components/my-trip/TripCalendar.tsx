'use client'
import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Trip } from '@/app/my-trip/page'

interface TripCalendarProps {
  initialTrip: Trip
}

const TripCalendar: React.FC<TripCalendarProps> = ({ initialTrip }) => {
  const [trip, setTrip] = useState<Trip>(initialTrip)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newItem, setNewItem] = useState({ name: '', type: 'Activity' })

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysFromPrevMonth = firstDayOfWeek
    const totalDays = 42
    const days = []
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push({ date: new Date(year, month - 1, i), isCurrentMonth: false, isSelected: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        isSelected: selectedDate && date.toDateString() === selectedDate.toDateString(),
        isInTrip: date >= trip.startDate && date <= trip.endDate
      })
    }
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, isSelected: false })
    }
    return days
  }
  const days = generateCalendarDays()
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  const selectDate = (date: Date) => setSelectedDate(date)
  const getItemsForDate = (date: Date | null) => {
    if (!date) return []
    return trip.items.filter(item => new Date(item.date).toDateString() === date.toDateString())
  }
  const selectedDateItems = getItemsForDate(selectedDate)
  const addItem = () => {
    if (!selectedDate || !newItem.name) return
    const item = { ...newItem, id: Date.now(), date: selectedDate }
    setTrip({ ...trip, items: [...trip.items, item] })
    setNewItem({ name: '', type: 'Activity' })
  }
  const removeItem = (itemId: number) => {
    setTrip({ ...trip, items: trip.items.filter(item => item.id !== itemId) })
  }

  return (
    <div>
      <h2>Trip Calendar</h2>
      <div>
        <button onClick={prevMonth}><ChevronLeft /></button>
        <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={nextMonth}><ChevronRight /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              background: d.isSelected ? '#e0f7fa' : d.isInTrip ? '#f1f8e9' : '#fff',
              border: d.isCurrentMonth ? '1px solid #ccc' : '1px solid #eee',
              cursor: 'pointer',
              padding: 8
            }}
            onClick={() => selectDate(d.date)}
          >
            {d.date.getDate()}
          </div>
        ))}
      </div>
      <div>
        <h3>
          {selectedDate ? formatDate(selectedDate) : 'Select a date'}
        </h3>
        <ul>
          {selectedDateItems.length > 0 ? selectedDateItems.map(item => (
            <li key={item.id}>
              {item.name} ({item.type})
              <button onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
            </li>
          )) : <li>No activities planned for this day.</li>}
        </ul>
        {selectedDate && (
          <div>
            <input
              type="text"
              placeholder="New activity"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />
            <select
              value={newItem.type}
              onChange={e => setNewItem({ ...newItem, type: e.target.value })}
            >
              <option value="Activity">Activity</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
            </select>
            <button onClick={addItem}><Plus size={14} /> Add</button>
          </div>
        )}
      </div>
      <div>
        <small>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </small>
      </div>
    </div>
  )
}

export default TripCalendar
