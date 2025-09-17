"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"

export default function HomeLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    try {
      const ok = typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true"
      if (!ok) router.replace("/auth/login")
    } catch {}
  }, [router])

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-background">
        {children}
      </main>
    </div>
  )
}
