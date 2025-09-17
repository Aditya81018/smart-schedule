"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload } from "lucide-react"
import { Select } from "@/components/ui/select"

type SubjectType = "core" | "elective" | "practical" | "apprenticeship"

type Subject = {
  id: string
  subjectId: string
  name: string
  type: SubjectType
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "s1", subjectId: "SUB001", name: "Data Structures", type: "core" },
  { id: "s2", subjectId: "SUB002", name: "Algorithms", type: "core" },
  { id: "s3", subjectId: "SUB003", name: "Operating Systems", type: "core" },
  { id: "s4", subjectId: "SUB004", name: "Database Systems", type: "elective" },
  { id: "s5", subjectId: "SUB005", name: "Computer Networks", type: "practical" },
]

const SUBJECT_TYPES: SubjectType[] = ["core", "elective", "practical", "apprenticeship"]

export default function SubjectsPage() {
  const [saved, setSaved] = useState<Subject[]>(() => DEFAULT_SUBJECTS.map((s) => ({ ...s })))
  const [rows, setRows] = useState<Subject[]>(() => DEFAULT_SUBJECTS.map((s) => ({ ...s })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(id: string, field: keyof Subject, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    const newRow: Subject = { id: `s_${Date.now()}_${Math.floor(Math.random() * 1000)}`, subjectId: "", name: "", type: "core" }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function saveChanges() {
    // in-memory only
    setSaved(rows.map((r) => ({ ...r })))
  }

  function discardChanges() {
    setRows(saved.map((r) => ({ ...r })))
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function normalizeType(val: any): SubjectType {
    const s = String(val ?? "").trim().toLowerCase()
    if (s === "core" || s === "elective" || s === "practical" || s === "apprenticeship") return s as SubjectType
    return "core"
  }

  function parseCSV(text: string): Subject[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      subjectId: headers.findIndex((h) => ["subjectid", "subject id", "subject_id", "id"].includes(h)),
      name: headers.findIndex((h) => ["name", "title"].includes(h)),
      type: headers.findIndex((h) => ["type", "subject type"].includes(h)),
    }
    const rowsOut: Subject[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const subjectId = cols[idx.subjectId] ?? ""
      const name = cols[idx.name] ?? ""
      const type = idx.type >= 0 ? normalizeType(cols[idx.type]) : "core"
      rowsOut.push({ id: `imp_sub_${Date.now()}_${i}`, subjectId, name, type })
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
        else if (Array.isArray(parsed?.subjects)) arr = parsed.subjects
        const mapped: Subject[] = arr.map((item, i) => ({
          id: item.id ?? `imp_json_sub_${Date.now()}_${i}`,
          subjectId: item.subjectId ?? item.subject_id ?? item.id ?? "",
          name: item.name ?? item.title ?? "",
          type: normalizeType(item.type ?? item.subjectType ?? item.subject_type),
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
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <p className="text-sm text-muted-foreground">Manage subjects for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
          <Button variant="ghost" onClick={triggerImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Subject
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
              <th className="px-4 py-3">Subject ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">
                  <input
                    value={r.subjectId}
                    onChange={(e) => updateRow(r.id, "subjectId", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="SUBXXX"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.name}
                    onChange={(e) => updateRow(r.id, "name", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Subject name"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="w-16">
                    <Select
                      value={r.type}
                      onChange={(v) => updateRow(r.id, "type", v)}
                      options={SUBJECT_TYPES.map((t) => ({ value: t, label: t }))}
                    />
                  </div>
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
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No subjects. Use "Add Subject" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
