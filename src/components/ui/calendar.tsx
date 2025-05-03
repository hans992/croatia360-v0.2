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
    <div className={cn("p-3", className)}>
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
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {date.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        dayClassName={(date) =>
          "h-8 w-8 flex items-center justify-center rounded-md text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary aria-selected:bg-primary aria-selected:text-primary-foreground"
        }
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }