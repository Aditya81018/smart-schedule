"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DEFAULT_SECTIONS } from "@/lib/sections-data"

export default function TimetablesIndexPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Timetables</h1>
          <p className="text-sm text-muted-foreground">Select a section to view its timetable.</p>
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
              <th className="px-4 py-3 w-40">Action</th>
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
                  <Link href={`/home/timetables/${encodeURIComponent(s.id)}`}>
                    <Button size="sm">Open Timetable</Button>
                  </Link>
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
