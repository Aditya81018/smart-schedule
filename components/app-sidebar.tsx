"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Info, File, Users, BookOpen, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback } from "react"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticated")
      }
    } catch {}
    router.push("/auth/login")
  }, [router])

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/home/about", label: "About College", icon: Info },
    { href: "/home/professors", label: "Professors", icon: Users },
    { href: "/home/subjects", label: "Subjects", icon: BookOpen },
    { href: "/home/rooms", label: "Rooms", icon: MapPin },
    { href: "/home/blank", label: "Blank Page", icon: File },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-[var(--sidebar)] text-[var(--sidebar-foreground)] min-h-screen flex flex-col">
      <div className="px-4 py-4 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--sidebar-primary)] flex items-center justify-center">
            <span className="text-[var(--sidebar-primary-foreground)] font-bold">S</span>
          </div>
          <span className="font-semibold">Smart Schedule</span>
        </div>
      </div>

      <nav className="p-2 flex-1">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                      : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-center">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
