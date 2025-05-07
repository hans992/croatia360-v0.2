// src/components/ui/calendar.tsx
"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils" // Pretpostavljam da ova putanja postoji i da je ispravna
import { buttonVariants } from "@/components/ui/button" // Pretpostavljam da ova putanja postoji i da je ispravna
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CalendarProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  inline?: boolean
  className?: string
  // Dodajte ostale propove koje react-datepicker podržava ako ih koristite
  // month?: Date; // Na primjer, ako kontrolirate prikazani mjesec
  // onMonthChange?: (date: Date) => void;
}

function Calendar({
  selected,
  onChange,
  inline = true, // Zadana vrijednost za inline
  className,
  // ...otherProps // Ako prosljeđujete ostale propove DatePickeru
}: CalendarProps) {
  return (
    <div className={cn("p-3 bg-card text-card-foreground rounded-md shadow", className)}> {/* Dodana osnovna stilizacija */}
      <DatePicker
        selected={selected}
        onChange={onChange}
        inline={inline}
        // {...otherProps} // Prosljeđivanje ostalih propova ako ih imate
        renderCustomHeader={({
          date, // Ovaj 'date' se koristi u date.toLocaleString
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center mb-2 px-1">
            <button
              type="button" // Dodan type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }), // Korištenje ghost varijante za bolji izgled
                "h-7 w-7 p-0 opacity-70 hover:opacity-100 disabled:opacity-30"
              )}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {/* Koristimo toLocaleString za formatiranje datuma ovisno o lokalizaciji */}
              {date.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button" // Dodan type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }), // Korištenje ghost varijante
                "h-7 w-7 p-0 opacity-70 hover:opacity-100 disabled:opacity-30"
              )}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        // ISPRAVAK: Ako 'date' parametar nije korišten unutar stringa klase,
        // prefiksirajte ga s '_' da zadovoljite ESLint pravilo no-unused-vars.
        // react-datepicker će i dalje ispravno proslijediti datum.
        dayClassName={(_date) => // 'date' je preimenovan u '_date'
          cn(
            "h-9 w-9 p-0 font-normal relative flex items-center justify-center rounded-md text-sm",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:opacity-100",
            // Dodatne klase za stilizaciju dana (npr. današnji dan, dani izvan mjeseca)
            // "[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            // "focus-within:relative focus-within:z-20"
          )
        }
        // Dodatne klase za bolju stilizaciju konzistentnu s shadcn/ui
        calendarClassName="rounded-md"
        weekDayClassName={(_date) => "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"}
        monthClassName={(_date) => "space-y-4 p-1 sm:p-2"} // Dodan padding za mjesec
        popperPlacement="bottom-start" // Primjer za pozicioniranje ako nije inline
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

