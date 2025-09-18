"use client"

"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DEFAULT_SECTIONS } from "@/lib/sections-data"

export default function TimetablesIndexPage() {
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function copyLink(sectionId: string) {
    try {
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/timetable/${encodeURIComponent(sectionId)}`
      await navigator.clipboard.writeText(url)
      setCopied(sectionId)
      setTimeout(() => setCopied(null), 2000)
    } catch (e) {
      alert("Copy failed: " + String(e))
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Timetables</h1>
          <p className="text-sm text-muted-foreground">Select a section to view its timetable.</p>
        </div>

        <div className="relative">
          <Button onClick={() => setShareOpen((v) => !v)} variant="outline">Share</Button>
          {shareOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded shadow p-2 z-40">
              <div className="text-sm font-medium mb-2">Share a section link</div>
              <div className="max-h-56 overflow-auto">
                {DEFAULT_SECTIONS.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 px-1 py-1">
                    <div className="text-sm">{s.id} — <span className="text-muted-foreground">{s.department}</span></div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => copyLink(s.id)}>
                        {copied === s.id ? "Copied" : "Copy Link"}
                      </Button>
                      <Link href={`/timetable/${encodeURIComponent(s.id)}`}>
                        <Button size="sm">Open</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-3 w-16">S.No</th>
              <th className="px-4 py-3">Section ID</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3 w-44">Action</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_SECTIONS.map((s, idx) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3">{s.year}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/home/timetables/${encodeURIComponent(s.id)}`}>
                      <Button size="sm">Open Timetable</Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => copyLink(s.id)}>
                      {copied === s.id ? "Link Copied" : "Share"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {DEFAULT_SECTIONS.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No sections available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
