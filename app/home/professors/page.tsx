"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload } from "lucide-react"

type Professor = {
  id: string
  facultyId: string
  name: string
  expertise: string
}

const DEFAULT_PROFESSORS: Professor[] = [
  { id: "p1", facultyId: "F001", name: "Dr. A. Kumar", expertise: "Computer Science" },
  { id: "p2", facultyId: "F002", name: "Dr. S. Mehta", expertise: "Electrical Engineering" },
  { id: "p3", facultyId: "F003", name: "Dr. R. Banerjee", expertise: "Mechanical Engineering" },
  { id: "p4", facultyId: "F004", name: "Dr. L. Sharma", expertise: "Mathematics" },
  { id: "p5", facultyId: "F005", name: "Dr. P. Iyer", expertise: "Management Studies" },
]

export default function ProfessorsPage() {
  const [saved, setSaved] = useState<Professor[]>(() => DEFAULT_PROFESSORS.map((p) => ({ ...p })))
  const [rows, setRows] = useState<Professor[]>(() => DEFAULT_PROFESSORS.map((p) => ({ ...p })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(id: string, field: keyof Professor, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    const newRow: Professor = {
      id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      facultyId: "",
      name: "",
      expertise: "",
    }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function saveChanges() {
    // Persisting is intentionally left out (no localStorage). This will keep changes in-memory only.
    setSaved(rows.map((r) => ({ ...r })))
  }

  function discardChanges() {
    setRows(saved.map((r) => ({ ...r })))
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function parseCSV(text: string): Professor[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      facultyId: headers.findIndex((h) => ["facultyid", "faculty id", "faculty_id", "id"].includes(h)),
      name: headers.findIndex((h) => ["name", "full name"].includes(h)),
      expertise: headers.findIndex((h) => ["expertise", "discipline", "department"].includes(h)),
    }
    const rowsOut: Professor[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const facultyId = cols[idx.facultyId] ?? ""
      const name = cols[idx.name] ?? ""
      const expertise = cols[idx.expertise] ?? ""
      rowsOut.push({ id: `imp_${Date.now()}_${i}`, facultyId, name, expertise })
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
        else if (Array.isArray(parsed?.professors)) arr = parsed.professors
        const mapped: Professor[] = arr.map((item, i) => ({
          id: item.id ?? `imp_json_${Date.now()}_${i}`,
          facultyId: item.facultyId ?? item.faculty_id ?? item.id ?? "",
          name: item.name ?? item.fullName ?? "",
          expertise: item.expertise ?? item.department ?? "",
        }))
        setRows(mapped)
      } else if (name.endsWith(".csv")) {
        const parsed = parseCSV(text)
        setRows(parsed)
      }
    } catch (err) {
      console.error("Failed to import file", err)
    } finally {
      // reset input so same file can be chosen again
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Professors</h1>
          <p className="text-sm text-muted-foreground">Manage faculty members for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
          <Button variant="ghost" onClick={triggerImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Professor
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
              <th className="px-4 py-3">Faculty ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Expertise</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">
                  <input
                    value={r.facultyId}
                    onChange={(e) => updateRow(r.id, "facultyId", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="FXXX"
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
                    value={r.expertise}
                    onChange={(e) => updateRow(r.id, "expertise", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Discipline"
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
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No professors. Use "Add Professor" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
