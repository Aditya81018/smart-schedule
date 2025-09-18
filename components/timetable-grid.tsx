"use client"

import { motion } from "framer-motion"
import React from "react"

export type ClassInfo = { subject: string; professor: string; room: string }

export type TimetableSchedule = Record<string, Record<string, ClassInfo | null | undefined>>

export function TimetableGrid({
  title,
  days,
  periods,
  schedule,
  highlighted,
  onCellClick,
}: {
  title: string
  days: string[]
  periods: string[]
  schedule: TimetableSchedule
  highlighted?: { day: string; period: string } | null
  onCellClick?: (day: string, period: string) => void
}) {
  const cols = periods.length + 1
  const colsMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }
  const colClass = colsMap[cols] || "grid-cols-12"
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      </div>

      <div className="w-full">
        <div className={`grid ${colClass} gap-2 w-full`}>
          <div className="p-3 text-sm font-medium text-muted-foreground"></div>
          {periods.map((p) => (
            <div key={p} className="p-3 text-sm font-medium text-center text-muted-foreground bg-muted/30 rounded">
              {p}
            </div>
          ))}

          {days.map((day, dIdx) => (
            <div key={day} className="contents">
              <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/30 rounded flex items-center justify-center">
                {day}
              </div>

              {periods.map((period, pIdx) => {
                const info = schedule[day]?.[period]
                const isBreak = period.toLowerCase() === "break"
                const isHighlighted = !!highlighted && highlighted.day === day && highlighted.period === period
                return (
                  <motion.button
                    type="button"
                    key={`${day}-${period}`}
                    onClick={() => !isBreak && onCellClick?.(day, period)}
                    className={
                      `relative text-left p-3 rounded text-sm transition-all duration-300 min-h-[80px] flex flex-col justify-center ` +
                      (isBreak
                        ? "bg-muted/20 border border-muted cursor-default"
                        : isHighlighted
                          ? "bg-primary/20 border border-primary shadow-md scale-105"
                          : info
                            ? "bg-background border border-border hover:bg-muted/30"
                            : "bg-muted/20 border border-muted hover:bg-muted/30")
                    }
                    whileHover={{ scale: isBreak ? 1 : 1.02 }}
                  >
                    {isBreak ? (
                      <div className="text-center text-muted-foreground">Break</div>
                    ) : info ? (
                      <div className="space-y-1">
                        <div className="font-semibold text-card-foreground leading-tight truncate">{info.subject}</div>
                        <div className="text-muted-foreground text-xs truncate">{info.professor}</div>
                        <div className="text-muted-foreground text-xs truncate">{info.room}</div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">Free Period</div>
                    )}
                    {isHighlighted && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
