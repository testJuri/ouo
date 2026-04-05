import { ReactNode } from "react"
import Sidebar from "@/components/layout/Sidebar"

interface WorkspaceLayoutProps {
  header: ReactNode
  children: ReactNode
}

export default function WorkspaceLayout({ header, children }: WorkspaceLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[hsl(var(--surface))]">
      <Sidebar />
      <div className="ml-64 flex h-full flex-col">
        {header}
        <main className="flex-1 overflow-y-auto px-8 pb-12 pt-6">{children}</main>
      </div>
    </div>
  )
}
