import type { ReactNode } from "react"
import { HomeShell } from "@/components/home-shell"

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <HomeShell>{children}</HomeShell>
}
