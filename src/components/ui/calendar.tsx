"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white font-body", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-[12px] font-bold uppercase tracking-[0.2em] text-accent",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-none border-accent/10"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-accent/40 rounded-none w-9 font-bold text-[10px] uppercase tracking-widest",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-[11px] p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/5 [&:has([aria-selected])]:bg-accent/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium rounded-none hover:bg-accent hover:text-white transition-all aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white font-bold",
        day_today: "bg-accent/10 text-accent border border-accent/20",
        day_outside:
          "day-outside text-muted-foreground/30 aria-selected:bg-accent/5 aria-selected:text-accent/30",
        day_disabled: "text-muted-foreground opacity-20",
        day_range_middle:
          "aria-selected:bg-accent/5 aria-selected:text-accent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
