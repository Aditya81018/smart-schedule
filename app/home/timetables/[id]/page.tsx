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
    const node = exportRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const width = Math.ceil(rect.width)
    const height = Math.ceil(rect.height)

    const cloned = node.cloneNode(true) as HTMLElement
    cloned.querySelectorAll("button").forEach((b) => b.remove())

    const serializer = new XMLSerializer()
    const markup = serializer.serializeToString(cloned)

    const svg = `<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><foreignObject width='100%' height='100%'>${markup}</foreignObject></svg>`
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

    const img = new Image()
    img.width = width
    img.height = height
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.scale(devicePixelRatio, devicePixelRatio)
      ctx.fillStyle = getComputedStyle(document.body).background || "#fff"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0)

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
    img.onerror = (e) => {
      console.error("Failed to load svg image", e)
    }
    img.src = url
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
