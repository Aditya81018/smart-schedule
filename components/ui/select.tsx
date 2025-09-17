"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

export function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: Option[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setMounted(true)
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ""

  // Render a native select initially (matches server-rendered markup) and switch to custom UI after mount
  if (!mounted) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full bg-transparent outline-none rounded-md border border-input px-3 py-1.5 text-sm", className)}
        aria-hidden
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div ref={ref} className={cn("relative block text-sm", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left rounded-md border border-input bg-transparent px-3 py-1.5 shadow-xs"
      >
        <span className="truncate">{selectedLabel}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-card p-1 shadow-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={cn(
                "cursor-pointer px-2 py-1 rounded-sm",
                opt.value === value ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-muted"
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
