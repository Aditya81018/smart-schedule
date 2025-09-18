"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TimetableGrid, TimetableSchedule } from "@/components/timetable-grid"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// 9 periods total including a break in the middle
const periods = ["P1", "P2", "P3", "P4", "Break", "P5", "P6", "P7", "P8"]

export default function SectionTimetablePage({ params }: { params: { id: string } }) {
  const sectionId = decodeURIComponent(params.id)

  const [highlighted, setHighlighted] = useState<{ day: string; period: string } | null>(null)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportRef = React.useRef<HTMLDivElement | null>(null)

  const schedules = useMemo(() => {
    // lazy require to avoid SSR/server issues
    // @ts-ignore
    const gen = require("@/lib/schedule-generator").generateConflictFreeSchedules
    const { DEFAULT_SECTIONS } = require("@/lib/sections-data")
    return gen(DEFAULT_SECTIONS, days, periods)
  }, [])

  const schedule: TimetableSchedule = useMemo(() => schedules[sectionId] ?? ((): TimetableSchedule => {
    const base: TimetableSchedule = {}
    for (const d of days) {
      base[d] = {}
      for (const p of periods) base[d][p] = p === "Break" ? null : undefined
    }
    return base
  })(), [schedules, sectionId])

  async function exportDomAsImage(format: "png" | "jpeg" | "pdf") {
    // Render the timetable into a canvas directly to avoid CSS/foreignObject issues
    const cellPadding = 12
    const firstColW = 140
    const headerH = 56
    const rowH = 110
    const cols = periods.length
    const width = Math.max(900, firstColW + cols * 140) // flexible width
    const height = headerH + days.length * rowH

    const canvas = document.createElement("canvas")
    canvas.width = Math.ceil(width * devicePixelRatio)
    canvas.height = Math.ceil(height * devicePixelRatio)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(devicePixelRatio, devicePixelRatio)

    // background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    const colW = Math.floor((width - firstColW) / cols)

    // header background
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, width, headerH)

    // draw period headers
    ctx.fillStyle = "#94a3b8" // muted
    ctx.font = "600 14px system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    for (let i = 0; i < cols; i++) {
      const x = firstColW + i * colW
      ctx.fillStyle = "#f1f5f9"
      ctx.fillRect(x, 6, colW - 8, headerH - 12)
      ctx.fillStyle = "#667085"
      const label = periods[i]
      const textX = x + (colW - 8) / 2
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, textX, headerH / 2)
    }

    // draw rows
    ctx.textAlign = "left"
    for (let r = 0; r < days.length; r++) {
      const y = headerH + r * rowH
      // day cell
      ctx.fillStyle = "#f1f5f9"
      ctx.fillRect(0, y, firstColW - 8, rowH - 8)

      ctx.fillStyle = "#0f172a"
      ctx.font = "600 16px system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      ctx.fillText(days[r], 12, y + 28)

      // draw each period cell
      for (let c = 0; c < cols; c++) {
        const x = firstColW + c * colW
        const period = periods[c]
        const day = days[r]
        const info = schedule[day]?.[period]
        const isBreak = period.toLowerCase() === "break"
        const isHighlighted = highlighted && highlighted.day === day && highlighted.period === period

        // background
        if (isBreak) ctx.fillStyle = "#e2e8f0"
        else if (!info) ctx.fillStyle = "#f8fafc"
        else ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 6, y + 6, colW - 12, rowH - 12)

        // border
        ctx.strokeStyle = isHighlighted ? "#06b6d4" : "#e6edf3"
        ctx.lineWidth = isHighlighted ? 3 : 1
        ctx.strokeRect(x + 6 + (ctx.lineWidth/2), y + 6 + (ctx.lineWidth/2), colW - 12 - ctx.lineWidth, rowH - 12 - ctx.lineWidth)

        // text
        const paddingLeft = x + 16
        const textY = y + 26
        if (isBreak) {
          ctx.fillStyle = "#475569"
          ctx.font = "600 14px system-ui, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Break", x + 6 + (colW - 12) / 2, y + rowH / 2)
          ctx.textAlign = "left"
        } else if (!info) {
          ctx.fillStyle = "#475569"
          ctx.font = "500 13px system-ui, sans-serif"
          ctx.fillText("Free Period", paddingLeft, textY)
        } else {
          ctx.fillStyle = "#0f172a"
          ctx.font = "600 14px system-ui, sans-serif"
          // subject
          const subject = String(info.subject)
          ctx.fillText(subject, paddingLeft, textY)
          // professor
          ctx.fillStyle = "#64748b"
          ctx.font = "400 12px system-ui, sans-serif"
          ctx.fillText(String(info.professor), paddingLeft, textY + 20)
          // room
          ctx.fillText(String(info.room), paddingLeft, textY + 38)
        }
      }
    }

    // export
    if (format === "pdf") {
      const dataUrl = canvas.toDataURL("image/png")
      const w = window.open("")
      if (!w) return
      w.document.write(`<img src="${dataUrl}" style="max-width:100%"/>`)
      w.document.close()
      w.focus()
      setTimeout(() => w.print(), 500)
      return
    }

    const mime = format === "jpeg" ? "image/jpeg" : "image/png"
    const dataUrl = canvas.toDataURL(mime, 0.95)
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `${sectionId}-timetable.${format === "jpeg" ? "jpg" : "png"}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/home/timetables" className="flex items-center">
            <Button variant="ghost">←</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{sectionId} Timetable</h1>
            <p className="text-sm text-muted-foreground">Fixed timetable with 6 days and 9 periods. Click a cell to highlight.</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <Button onClick={() => setExportMenuOpen((v) => !v)}>Export</Button>
          </div>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded shadow p-2 z-40">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted/30" onClick={() => exportDomAsImage("png")}>
                Download PNG
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted/30" onClick={() => exportDomAsImage("jpeg")}>
                Download JPEG
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted/30" onClick={() => exportDomAsImage("pdf")}>
                Export as PDF (Print)
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={exportRef}>
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
    </div>
  )
}
