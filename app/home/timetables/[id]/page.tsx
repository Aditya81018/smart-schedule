"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TimetableGrid, TimetableSchedule } from "@/components/timetable-grid"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const periods = ["P1", "P2", "P3", "P4", "Break", "P5", "P6", "P7", "P8", "P9"]

export default function SectionTimetablePage({ params }: { params: { id: string } }) {
  const sectionId = decodeURIComponent(params.id)

  const [highlighted, setHighlighted] = useState<{ day: string; period: string } | null>(null)

  const schedule: TimetableSchedule = useMemo(() => {
    const base: TimetableSchedule = {}
    for (const d of days) {
      base[d] = {}
      for (const p of periods) base[d][p] = p === "Break" ? null : undefined
    }
    return base
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{sectionId} Timetable</h1>
          <p className="text-sm text-muted-foreground">Fixed timetable with 6 days and 9 periods. Click a cell to highlight.</p>
        </div>
        <Link href="/home/timetables">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <TimetableGrid
        title={`${sectionId} Schedule`}
        days={days}
        periods={periods}
        schedule={schedule}
        highlighted={highlighted}
        onCellClick={(day, period) => {
          if (period === "Break") return
          setHighlighted((prev) => (prev && prev.day === day && prev.period === period ? null : { day, period }))
        }}
      />
    </div>
  )
}
