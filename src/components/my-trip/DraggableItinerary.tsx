"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { defaultNS } from "@/lib/i18n/settings";
import type { Trip, TripItem } from "@/lib/trip/types";
import { setStoredTrip } from "@/lib/trip/storage";
import { GripVertical } from "lucide-react";

interface DraggableItineraryProps {
  trip: Trip;
  onTripChange: (trip: Trip) => void;
}

function DraggableItem({ item }: { item: TripItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border border-white/10 bg-card/50 p-3 backdrop-blur-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.cost_cents > 0 && (
          <p className="text-xs text-muted-foreground">€{(item.cost_cents / 100).toFixed(0)}</p>
        )}
      </div>
    </div>
  );
}

function DroppableDayColumn({
  day,
  items,
}: {
  day: number;
  items: TripItem[];
}) {
  const { t } = useTranslation(defaultNS);
  const { setNodeRef, isOver } = useDroppable({ id: `day-${day}` });
  const dayTitle = t(`my_trip_day_${day}_title`);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border backdrop-blur-md p-4 min-h-[200px] transition-colors ${
        isOver ? "border-accent/50 bg-accent/5" : "border-white/10 bg-card/30"
      }`}
    >
      <div className="text-primary font-semibold mb-2">
        {t("my_trip_day", { n: day })}
      </div>
      <div className="text-base font-bold mb-3">{dayTitle}</div>
      <div className="flex flex-col gap-2 flex-1">
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function DraggableItinerary({ trip, onTripChange }: DraggableItineraryProps) {
  const { t } = useTranslation(defaultNS);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const itemsByDay = React.useMemo(() => {
    const map: Record<number, TripItem[]> = {};
    for (let d = 1; d <= 7; d++) map[d] = [];
    trip.items
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((item) => {
        if (!map[item.day]) map[item.day] = [];
        map[item.day].push(item);
      });
    return map;
  }, [trip.items]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = String(over.id);

    const activeItem = trip.items.find((i) => i.id === activeId);
    if (!activeItem) return;

    let overDay: number;
    if (overId.startsWith("day-")) {
      overDay = parseInt(overId.replace("day-", ""), 10);
    } else {
      const overItem = trip.items.find((i) => i.id === overId);
      overDay = overItem ? overItem.day : activeItem.day;
    }

    if (Number.isNaN(overDay) || overDay < 1 || overDay > 7) return;

    const targetDayItems = trip.items.filter((i) => i.day === overDay && i.id !== activeId);
    const newSortOrder = targetDayItems.length;

    const newItems = trip.items.map((item) => {
      if (item.id !== activeId) return item;
      return { ...item, day: overDay, sort_order: newSortOrder };
    });

    const reordered = reorderSortOrders(newItems);
    const updatedTrip = { ...trip, items: reordered };
    onTripChange(updatedTrip);
    setStoredTrip(updatedTrip);

    // Weather toast for outdoor activities when moved to new day
    if (activeItem.day !== overDay && activeItem.type === "activity") {
      const startDate = trip.start_date || "2025-09-01";
      const d = new Date(startDate);
      d.setDate(d.getDate() + overDay - 1);
      const dateStr = d.toISOString().slice(0, 10);
      fetch(`/api/weather?city=Split&date=${dateStr}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.hasRain) {
            toast(t("my_trip_weather_rain_toast"), {
              description: t("my_trip_weather_rain_description"),
              action: {
                label: t("my_trip_weather_rain_ok"),
                onClick: () => {},
              },
            });
          }
        })
        .catch(() => {});
    }
  };

  const activeItem = activeId ? trip.items.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <DroppableDayColumn
            key={day}
            day={day}
            items={itemsByDay[day] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="rounded-lg border border-accent/50 bg-card p-3 shadow-lg opacity-95">
            <p className="text-sm font-medium">{activeItem.title}</p>
            {activeItem.cost_cents > 0 && (
              <p className="text-xs text-muted-foreground">€{(activeItem.cost_cents / 100).toFixed(0)}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function reorderSortOrders(items: TripItem[]): TripItem[] {
  const byDay: Record<number, TripItem[]> = {};
  items.forEach((i) => {
    if (!byDay[i.day]) byDay[i.day] = [];
    byDay[i.day].push(i);
  });
  Object.keys(byDay).forEach((d) => {
    byDay[Number(d)].sort((a, b) => a.sort_order - b.sort_order);
    byDay[Number(d)].forEach((item, idx) => {
      item.sort_order = idx;
    });
  });
  return items;
}
