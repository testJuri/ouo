import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell } from "lucide-react"

const topTabs = [
  { id: "episodes", label: "片段管理" },
  { id: "characters", label: "角色管理" },
  { id: "scenes", label: "场景管理" },
  { id: "objects", label: "物品管理" },
  { id: "fusion", label: "融合生图" },
  { id: "remix", label: "图片改创" },
]

interface ProjectHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function ProjectHeader({ activeTab, onTabChange }: ProjectHeaderProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[hsl(var(--surface-container-lowest))]/80 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-[hsl(var(--outline-variant))]/15">
      {/* Logo / Project Name */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-black text-[hsl(var(--on-surface))]">项目资源</span>
      </div>

      {/* Capsule Navigation */}
      <nav className="hidden lg:flex items-center bg-[hsl(var(--surface-container-low))] rounded-full p-1">
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "signature-gradient text-white shadow-md"
                : "text-[hsl(var(--on-secondary-fixed-variant))] hover:text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-high))]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] w-4 h-4" />
          <Input 
            placeholder="搜索资源..." 
            className="pl-10 pr-4 py-1.5 bg-[hsl(var(--surface-container-low))] rounded-full text-sm border-none focus:ring-0 focus:bg-[hsl(var(--surface-container-lowest))] transition-all w-48"
          />
        </div>
        <Button variant="ghost" size="icon" className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="h-4 w-[1px] bg-[hsl(var(--outline-variant))]" />
        <Button variant="ghost" className="text-[hsl(var(--on-surface))] font-medium text-xs hover:bg-[hsl(var(--surface-container-high))]">
          分享
        </Button>
        <Button className="signature-gradient text-white px-5 py-2 rounded-full text-xs font-bold hover:opacity-90 border-0">
          导出视频
        </Button>
      </div>
    </header>
  )
}
