"use client"

import React, { useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload, ArrowLeft } from "lucide-react"

type SectionSubject = {
  subject: string
  professor: string
  numberOfClasses: number
}

export default function SectionSubjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams?.get("data") ?? ""
  let initial: SectionSubject[] = []
  try {
    if (raw) initial = JSON.parse(decodeURIComponent(raw))
  } catch (e) {
    console.error("Failed to parse section subjects data", e)
  }

  const [saved, setSaved] = useState<SectionSubject[]>(() => initial.map((s) => ({ ...s })))
  const [rows, setRows] = useState<SectionSubject[]>(() => initial.map((s) => ({ ...s })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(idx: number, field: keyof SectionSubject, value: any) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    const newRow: SectionSubject = { subject: "", professor: "", numberOfClasses: 1 }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  function saveChanges() {
    setSaved(rows.map((r) => ({ ...r })))
  }

  function discardChanges() {
    setRows(saved.map((r) => ({ ...r })))
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  function parseCSV(text: string): SectionSubject[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      subject: headers.findIndex((h) => ["subject", "name"].includes(h)),
      professor: headers.findIndex((h) => ["professor", "faculty", "teacher"].includes(h)),
      numberOfClasses: headers.findIndex((h) => ["classes", "numberofclasses", "number_of_classes", "count"].includes(h)),
    }
    const rowsOut: SectionSubject[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const subject = cols[idx.subject] ?? ""
      const professor = cols[idx.professor] ?? ""
      const numberOfClasses = Number(cols[idx.numberOfClasses] ?? 0) || 0
      rowsOut.push({ subject, professor, numberOfClasses })
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
        const mapped: SectionSubject[] = arr.map((item: any) => ({
          subject: item.subject ?? item.name ?? "",
          professor: item.professor ?? item.faculty ?? "",
          numberOfClasses: Number(item.numberOfClasses ?? item.classes ?? 0) || 0,
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
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" onClick={() => router.push("/home/sections")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Section Subjects</h1>
          <p className="text-sm text-muted-foreground">Subjects for the selected section.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div />
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
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Professor</th>
              <th className="px-4 py-3">Classes</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.subject}_${idx}`} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">
                  <input
                    value={r.subject}
                    onChange={(e) => updateRow(idx, "subject", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Subject name"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.professor}
                    onChange={(e) => updateRow(idx, "professor", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="Professor name"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={String(r.numberOfClasses)}
                    onChange={(e) => updateRow(idx, "numberOfClasses", Number(e.target.value))}
                    className="w-full bg-transparent outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => deleteRow(idx)} className="p-2">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No section subjects. Use "Add Subject" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
