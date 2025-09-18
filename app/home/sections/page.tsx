"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload } from "lucide-react"
import { ViewSubjectsButton } from "@/components/view-subjects-button"

import type { Section } from "@/lib/sections-data"
import { DEFAULT_SECTIONS } from "@/lib/sections-data"

export default function SectionsPage() {
  const [saved, setSaved] = useState<Section[]>(() => DEFAULT_SECTIONS.map((s) => ({ ...s, subjects: [...s.subjects] })))
  const [rows, setRows] = useState<Section[]>(() => DEFAULT_SECTIONS.map((s) => ({ ...s, subjects: [...s.subjects] })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(id: string, field: keyof Section, value: any) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    const newRow: Section = { id: `sec_${Date.now()}_${Math.floor(Math.random() * 1000)}`, department: "", year: "", subjects: [] }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function saveChanges() {
    setSaved(rows.map((r) => ({ ...r, subjects: [...r.subjects] })))
  }

  function discardChanges() {
    setRows(saved.map((r) => ({ ...r, subjects: [...r.subjects] })))
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function parseCSV(text: string): Section[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      id: headers.findIndex((h) => ["id", "sectionid", "section id", "section_id"].includes(h)),
      department: headers.findIndex((h) => ["department", "dept"].includes(h)),
      year: headers.findIndex((h) => ["year"].includes(h)),
      subjects: headers.findIndex((h) => ["subjects", "subjectlist", "subject_list"].includes(h)),
    }
    const rowsOut: Section[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const id = cols[idx.id] ?? `imp_sec_${Date.now()}_${i}`
      const department = cols[idx.department] ?? ""
      const year = cols[idx.year] ?? ""
      const subjectsRaw = cols[idx.subjects] ?? ""
      const subjects = subjectsRaw ? subjectsRaw.split(";").map((s) => s.trim()).filter(Boolean) : []
      rowsOut.push({ id: String(id), department, year, subjects })
    }
    return rowsOut
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const name = file.name.toLowerCase()
    try {
      if (name.endsWith(".json")) {
        const parsed = JSON.parse(text)
        let arr: any[] = []
        if (Array.isArray(parsed)) arr = parsed
        else if (Array.isArray(parsed?.sections)) arr = parsed.sections
        const mapped: Section[] = arr.map((item: any, i: number) => ({
          id: item.id ?? `imp_json_sec_${Date.now()}_${i}`,
          department: item.department ?? item.dept ?? "",
          year: String(item.year ?? ""),
          subjects: Array.isArray(item.subjects) ? item.subjects.map(String) : (String(item.subjects ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
        }))
        setRows(mapped)
      } else if (name.endsWith(".csv")) {
        const parsed = parseCSV(text)
        setRows(parsed)
      }
    } catch (err) {
      console.error("Failed to import file", err)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Sections</h1>
          <p className="text-sm text-muted-foreground">Manage sections for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
          <Button variant="ghost" onClick={triggerImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Section
          </Button>
          <Button onClick={saveChanges} className="flex items-center gap-2" disabled={!isDirty}>
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button variant="outline" onClick={discardChanges} className="flex items-center gap-2" disabled={!isDirty}>
            <X className="h-4 w-4" /> Discard
          </Button>
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
              <th className="px-4 py-3">Subjects</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">
                  <input
                    value={r.id}
                    onChange={(e) => updateRow(r.id, "id", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="SECXXX"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.department}
                    onChange={(e) => updateRow(r.id, "department", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Department"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.year}
                    onChange={(e) => updateRow(r.id, "year", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Year"
                  />
                </td>
                <td className="px-4 py-3">
                  <ViewSubjectsButton subjects={r.subjects} sectionId={r.id} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => deleteRow(r.id)} className="p-2">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  No sections. Use "Add Section" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
