import { ReactNode } from "react"
import Sidebar from "@/components/layout/Sidebar"

interface WorkspaceLayoutProps {
  header: ReactNode
  children: ReactNode
}

export default function WorkspaceLayout({ header, children }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <Sidebar />
      <main className="relative ml-64 min-h-screen">
        {header}
        <div className="px-8 pb-12 pt-24">{children}</div>
      </main>
    </div>
  )
}
