"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload } from "lucide-react"

type Student = {
  id: string
  name: string
  section: string
  electives: string[]
}

const DEFAULT_STUDENTS: Student[] = [
  { id: "st1", name: "Ananya Sharma", section: "A", electives: ["SUB004", "SUB005"] },
  { id: "st2", name: "Rohan Verma", section: "B", electives: ["SUB002"] },
  { id: "st3", name: "Priya Singh", section: "A", electives: [] },
  { id: "st4", name: "Karan Patel", section: "C", electives: ["SUB003", "SUB005"] },
  { id: "st5", name: "Sara Ali", section: "B", electives: ["SUB001"] },
]

export default function StudentsPage() {
  const [saved, setSaved] = useState<Student[]>(() => DEFAULT_STUDENTS.map((s) => ({ ...s, electives: [...s.electives] })))
  const [rows, setRows] = useState<Student[]>(() => DEFAULT_STUDENTS.map((s) => ({ ...s, electives: [...s.electives] })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(id: string, field: keyof Student, value: any) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    const newRow: Student = { id: `st_${Date.now()}_${Math.floor(Math.random() * 1000)}`, name: "", section: "", electives: [] }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function saveChanges() {
    setSaved(rows.map((r) => ({ ...r, electives: [...r.electives] })))
  }

  function discardChanges() {
    setRows(saved.map((r) => ({ ...r, electives: [...r.electives] })))
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function parseCSV(text: string): Student[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      id: headers.findIndex((h) => ["id", "studentid", "student id", "student_id"].includes(h)),
      name: headers.findIndex((h) => ["name", "full name"].includes(h)),
      section: headers.findIndex((h) => ["section"].includes(h)),
      electives: headers.findIndex((h) => ["electives", "elective", "choices"].includes(h)),
    }
    const rowsOut: Student[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const id = cols[idx.id] ?? `imp_st_${Date.now()}_${i}`
      const name = cols[idx.name] ?? ""
      const section = cols[idx.section] ?? ""
      const electivesRaw = cols[idx.electives] ?? ""
      const electives = electivesRaw ? electivesRaw.split(";").map((s) => s.trim()).filter(Boolean) : []
      rowsOut.push({ id: String(id), name, section, electives })
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
        else if (Array.isArray(parsed?.students)) arr = parsed.students
        const mapped: Student[] = arr.map((item: any, i: number) => ({
          id: item.id ?? `imp_json_st_${Date.now()}_${i}`,
          name: item.name ?? "",
          section: item.section ?? "",
          electives: Array.isArray(item.electives) ? item.electives.map(String) : (String(item.electives ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
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
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">Manage students for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
          <Button variant="ghost" onClick={triggerImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Student
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
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Electives</th>
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
                    placeholder="STXXX"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.name}
                    onChange={(e) => updateRow(r.id, "name", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Full name"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.section}
                    onChange={(e) => updateRow(r.id, "section", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Section"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.electives.join(", ")}
                    onChange={(e) => updateRow(r.id, "electives", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                    className="w-full bg-transparent outline-none"
                    placeholder="SUB002, SUB005"
                  />
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
                  No students. Use "Add Student" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
