"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X } from "lucide-react"

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

const STORAGE_KEY = "professorsList"

export default function ProfessorsPage() {
  const [saved, setSaved] = useState<Professor[] | null>(null)
  const [rows, setRows] = useState<Professor[]>([])

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSaved(JSON.parse(raw))
        setRows(JSON.parse(raw))
      } else {
        setSaved(DEFAULT_PROFESSORS)
        setRows(DEFAULT_PROFESSORS)
      }
    } catch (e) {
      setSaved(DEFAULT_PROFESSORS)
      setRows(DEFAULT_PROFESSORS)
    }
  }, [])

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
      setSaved(rows)
    } catch {}
  }

  function discardChanges() {
    if (saved) setRows(saved)
    else setRows(DEFAULT_PROFESSORS)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Professors</h1>
          <p className="text-sm text-muted-foreground">Manage faculty members for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Professor
          </Button>
          <Button onClick={saveChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button variant="outline" onClick={discardChanges} className="flex items-center gap-2">
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
