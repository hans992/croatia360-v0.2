// src/components/ui/calendar.tsx
"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CalendarProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  inline?: boolean
  className?: string
}

function Calendar({
  selected,
  onChange,
  inline = true,
  className,
}: CalendarProps) {
  return (
    <div className={cn("p-3 bg-card text-card-foreground rounded-md shadow", className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        inline={inline}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center mb-2 px-1">
            <button
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-7 w-7 p-0 opacity-70 hover:opacity-100 disabled:opacity-30"
              )}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {date.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-7 w-7 p-0 opacity-70 hover:opacity-100 disabled:opacity-30"
              )}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dayClassName={(_date) => 
          cn(
            "h-9 w-9 p-0 font-normal relative flex items-center justify-center rounded-md text-sm",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:opacity-100",
          )
        }
        calendarClassName="rounded-md"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        weekDayClassName={(_date) => "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        monthClassName={(_date) => "space-y-4 p-1 sm:p-2"}
        popperPlacement="bottom-start"
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
