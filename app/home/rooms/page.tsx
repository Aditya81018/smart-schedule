"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, X, Upload } from "lucide-react"

type Room = {
  id: string
  roomId: string
  isLab: boolean
}

const DEFAULT_ROOMS: Room[] = [
  { id: "r1", roomId: "R101", isLab: false },
  { id: "r2", roomId: "R102", isLab: true },
  { id: "r3", roomId: "R201", isLab: false },
  { id: "r4", roomId: "R202", isLab: true },
  { id: "r5", roomId: "LAB01", isLab: true },
]

export default function RoomsPage() {
  const [saved, setSaved] = useState<Room[]>(() => DEFAULT_ROOMS.map((r) => ({ ...r })))
  const [rows, setRows] = useState<Room[]>(() => DEFAULT_ROOMS.map((r) => ({ ...r })))
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(saved), [rows, saved])

  function updateRow(id: string, field: keyof Room, value: string | boolean) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  function addRow() {
    const newRow: Room = { id: `r_${Date.now()}_${Math.floor(Math.random() * 1000)}`, roomId: "", isLab: false }
    setRows((prev) => [newRow, ...prev])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
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

  function parseBool(val: string): boolean {
    if (!val) return false
    const v = val.trim().toLowerCase()
    return ["1", "true", "t", "yes", "y", "lab", "l"].includes(v)
  }

  function parseCSV(text: string): Room[] {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const idx = {
      roomId: headers.findIndex((h) => ["roomid", "room id", "room_id", "id"].includes(h)),
      isLab: headers.findIndex((h) => ["islab", "is_lab", "lab", "is_lab?", "is lab"].includes(h)),
    }
    const rowsOut: Room[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim())
      const roomId = cols[idx.roomId] ?? ""
      const isLab = idx.isLab >= 0 ? parseBool(cols[idx.isLab]) : false
      rowsOut.push({ id: `imp_room_${Date.now()}_${i}`, roomId, isLab })
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
        else if (Array.isArray(parsed?.rooms)) arr = parsed.rooms
        const mapped: Room[] = arr.map((item: any, i: number) => ({
          id: item.id ?? `imp_json_room_${Date.now()}_${i}`,
          roomId: item.roomId ?? item.room_id ?? item.id ?? "",
          isLab: typeof item.isLab === "boolean" ? item.isLab : parseBool(String(item.isLab ?? "")),
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
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <p className="text-sm text-muted-foreground">Manage rooms for your college.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
          <Button variant="ghost" onClick={triggerImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="ghost" onClick={addRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Room
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
              <th className="px-4 py-3">Room ID</th>
              <th className="px-4 py-3">Is Lab</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3">
                  <input
                    value={r.roomId}
                    onChange={(e) => updateRow(r.id, "roomId", e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="RXXX"
                  />
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.isLab}
                      onChange={(e) => updateRow(r.id, "isLab", e.target.checked)}
                      className="accent-[var(--primary)]"
                    />
                    <span className="text-sm text-muted-foreground">Lab</span>
                  </label>
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
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No rooms. Use "Add Room" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
