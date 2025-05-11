// src/components/ui/date-picker.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { type SelectSingleEventHandler } from "react-day-picker"; // Import specifičnog event handlera

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Vaša shadcn/ui Calendar komponenta
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Definicija propova specifično za single date picker
export interface DatePickerProps {
  selected: Date | undefined; // Očekuje Date ili undefined
  onSelect: SelectSingleEventHandler; // Funkcija koja prima Date | undefined
  className?: string;
  buttonClassName?: string; // Dodatni prop za stiliziranje gumba ako treba
  disabled?: (date: Date) => boolean; // Za onemogućavanje određenih datuma
  // Ovdje možete dodati druge propove specifične za DayPickerSingleProps ako su potrebni
  // npr. fromDate, toDate, numberOfMonths, etc.
}

export function DatePicker({
  selected,
  onSelect,
  className, // Ovaj className će se primijeniti na PopoverTrigger Button
  buttonClassName, // Ovaj se može koristiti za dodatno stiliziranje gumba
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal", // Osnovni stilovi
            !selected && "text-muted-foreground",
            buttonClassName // Primjena dodatnih klasa za gumb
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: hr }) : <span>Odaberite datum</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)} align="start"> 
        {/* className ovdje se odnosi na PopoverContent */}
        <Calendar
          mode="single" // Eksplicitno postavljeno na single
          selected={selected} // Prosljeđuje se Date | undefined
          onSelect={onSelect} // Prosljeđuje se (day: Date | undefined, ...) => void
          disabled={disabled}
          initialFocus
          locale={hr}
        />
      </PopoverContent>
    </Popover>
  );
}
