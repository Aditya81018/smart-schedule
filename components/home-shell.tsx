"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"

export function HomeShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // useEffect(() => {
  //   try {
  //     const ok = typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true"
  //     if (!ok) router.replace("/auth/login")
  //   } catch {
  //     router.replace("/auth/login")
  //   }
  // }, [router])

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-background">{children}</main>
    </div>
  )
}
