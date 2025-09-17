"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function ViewSubjectsButton({ subjects, sectionId }: { subjects: any[]; sectionId: string }) {
  const router = useRouter()

  function handleClick() {
    try {
      const data = encodeURIComponent(JSON.stringify(subjects ?? []))
      router.push(`/home/sections/${encodeURIComponent(sectionId)}/subjects?data=${data}`)
    } catch (err) {
      console.error(err)
      router.push(`/home/sections/${encodeURIComponent(sectionId)}/subjects`)
    }
  }

  return (
    <Button variant="ghost" onClick={handleClick} className="text-sm">
      View subjects
    </Button>
  )
}
