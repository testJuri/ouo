import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Settings, User, LogOut } from "lucide-react"

import type { ProjectTab } from "@/types"

const topTabs: { id: ProjectTab; label: string }[] = [
  { id: "episodes", label: "片段管理" },
  { id: "characters", label: "角色管理" },
  { id: "scenes", label: "场景管理" },
  { id: "objects", label: "物品管理" },
]

interface ProjectHeaderProps {
  activeTab: ProjectTab
  onTabChange: (tab: ProjectTab) => void
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
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-high))] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-4 w-[1px] bg-[hsl(var(--outline-variant))]" />
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="用户" />
                <AvatarFallback>陈</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[hsl(var(--on-surface))]">陈晓明</p>
                <p className="text-[10px] text-[hsl(var(--secondary))]">专业创作者</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              个人资料
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              账号设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
