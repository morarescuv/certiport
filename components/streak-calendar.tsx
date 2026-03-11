"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCalendarProps {
  currentStreak: number
  longestStreak: number
  activeDays: Date[]
}

export function StreakCalendar({
  currentStreak,
  longestStreak,
  activeDays,
}: StreakCalendarProps) {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const isActiveDay = (day: number) => {
    return activeDays.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
  }

  const isToday = (day: number) => {
    return day === today.getDate()
  }

  const weekdays = ["D", "L", "Ma", "Mi", "J", "V", "S"]

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            Calendar activitate
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-medium text-warning">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">Curent</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-medium text-card-foreground">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Maxim</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyCells.map((i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const active = isActiveDay(day)
            const todayDate = isToday(day)

            return (
              <div
                key={day}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm transition-all",
                  active && "bg-warning/20 text-warning font-medium",
                  !active && day <= today.getDate() && "bg-muted/50 text-muted-foreground",
                  !active && day > today.getDate() && "text-muted-foreground/50",
                  todayDate && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {active ? (
                  <Flame className="h-4 w-4" />
                ) : (
                  day
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-warning/20" />
            <span>Activ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-muted/50" />
            <span>Inactiv</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded ring-2 ring-primary" />
            <span>Azi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
