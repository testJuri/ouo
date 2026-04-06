import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationDrawer, { demoNotifications } from "@/components/layout/NotificationDrawer"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { Search, Bell, Shield, User, LogOut, ChevronDown } from "lucide-react"

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
  projectTitle?: string
}

const identityOptions = [
  { id: "creator", label: "专业创作者" },
  { id: "admin", label: "管理员" },
] as const

type IdentityOption = (typeof identityOptions)[number]["id"]

export default function ProjectHeader({
  activeTab,
  onTabChange,
  projectTitle = "项目",
}: ProjectHeaderProps) {
  const navigate = useNavigate()
  const { notify } = useFeedback()
  const [currentIdentity, setCurrentIdentity] = useState<IdentityOption>("creator")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(demoNotifications)
  
  const unreadCount = notificationList.filter((n) => !n.read).length
  
  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  
  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleIdentityChange = (identity: string) => {
    const nextIdentity = identity as IdentityOption
    setCurrentIdentity(nextIdentity)
    notify.success(`已切换为${identityOptions.find((option) => option.id === nextIdentity)?.label}`)
  }

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[hsl(var(--surface-container-lowest))]/80 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-[hsl(var(--outline-variant))]/15">
      {/* Logo / Project Name */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-black text-[hsl(var(--on-surface))]">{projectTitle}</span>
      </div>

      {/* Capsule Navigation */}
      <nav className="hidden lg:flex items-center bg-[hsl(var(--surface-container-low))] rounded-full p-1">
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
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
        <button 
          className="relative w-9 h-9 flex items-center justify-center rounded-full text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-high))] transition-colors"
          onClick={() => setNotificationOpen(true)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="h-4 w-[1px] bg-[hsl(var(--outline-variant))]" />
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[hsl(var(--surface-container-high))]">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="用户" />
                <AvatarFallback>陈</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-bold text-[hsl(var(--on-surface))]">陈晓明</p>
                <p className="text-[10px] text-[hsl(var(--secondary))]">
                  {identityOptions.find((option) => option.id === currentIdentity)?.label}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[hsl(var(--secondary))] md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>个人中心</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => notify.info("个人中心开发中")}>
              <User className="w-4 h-4 mr-2" />
              我的主页
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Shield className="w-4 h-4 mr-2" />
                切换身份
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                <DropdownMenuRadioGroup value={currentIdentity} onValueChange={handleIdentityChange}>
                  <DropdownMenuRadioItem value="creator" className="rounded-lg data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:text-white data-[state=checked]:[&_*]:text-white">
                    <User className="mr-2 h-4 w-4" />
                    专业创作者
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin" className="rounded-lg data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:text-white data-[state=checked]:[&_*]:text-white">
                    <Shield className="mr-2 h-4 w-4" />
                    管理员
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("manga-user")
                navigate("/login")
                notify.success("已退出登录")
              }}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NotificationDrawer
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
        notifications={notificationList}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onClearAll={() => setNotificationList([])}
      />
    </header>
  )
}
