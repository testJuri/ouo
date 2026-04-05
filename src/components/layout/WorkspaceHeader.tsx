import { ReactNode, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationDrawer, { demoNotifications } from "@/components/layout/NotificationDrawer"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { Bell, ChevronDown, CreditCard, LogOut, Search, Settings, Shield, User } from "lucide-react"

interface WorkspaceHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  actions?: ReactNode
}

const identityOptions = [
  { id: "creator", label: "专业创作者" },
  { id: "admin", label: "管理员" },
] as const

type IdentityOption = (typeof identityOptions)[number]["id"]

export default function WorkspaceHeader({
  title,
  subtitle,
  searchPlaceholder = "搜索内容...",
  actions,
}: WorkspaceHeaderProps) {
  const navigate = useNavigate()
  const { notify } = useFeedback()
  const [currentIdentity, setCurrentIdentity] = useState<IdentityOption>("creator")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(demoNotifications)
  const unreadCount = notificationList.filter((item) => !item.read).length

  const markAllAsRead = () => {
    setNotificationList((current) => current.map((item) => ({ ...item, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotificationList((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const handleIdentityChange = (identity: string) => {
    const nextIdentity = identity as IdentityOption
    setCurrentIdentity(nextIdentity)
    notify.success(`已切换为${identityOptions.find((option) => option.id === nextIdentity)?.label}`)
  }

  return (
    <>
      <header className="fixed right-0 top-0 z-40 h-16 w-[calc(100%-16rem)] border-b border-[hsl(var(--outline-variant))]/15 bg-[hsl(var(--surface-container-lowest))]/85 px-8 backdrop-blur-md">
        <div className="flex h-full items-center justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-lg font-black text-[hsl(var(--on-surface))]">{title}</h1>
            {subtitle ? <p className="text-xs text-[hsl(var(--secondary))]">{subtitle}</p> : null}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--secondary))]" />
              <Input
                placeholder={searchPlaceholder}
                className="h-10 w-80 rounded-full border-none bg-[hsl(var(--surface-container-low))] pl-10 pr-4 text-sm focus-visible:ring-0"
              />
            </div>

            {actions}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationOpen(true)}
              className="relative text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Button>

            <div className="h-4 w-px bg-[hsl(var(--outline-variant))]" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[hsl(var(--surface-container-high))]">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                      alt="陈晓明"
                    />
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>个人中心</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 pb-1 pt-0 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--secondary))]">
                    身份切换
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={currentIdentity} onValueChange={handleIdentityChange}>
                    <DropdownMenuRadioItem value="creator" className="rounded-lg px-8 py-2 text-sm focus:bg-[hsl(var(--surface-container-high))] focus:text-[hsl(var(--on-surface))]">
                      <User className="mr-2 h-4 w-4" />
                      专业创作者
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="admin" className="rounded-lg px-8 py-2 text-sm focus:bg-[hsl(var(--surface-container-high))] focus:text-[hsl(var(--on-surface))]">
                      <Shield className="mr-2 h-4 w-4" />
                      管理员
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => notify.info("个人中心开发中")}>
                  <User className="mr-2 h-4 w-4" />
                  我的主页
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => notify.info("账号设置开发中")}>
                  <Settings className="mr-2 h-4 w-4" />
                  账号设置
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => notify.info("订阅与积分开发中")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  订阅与积分
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("manga-user")
                    navigate("/login")
                    notify.success("已退出登录")
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <NotificationDrawer
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
        notifications={notificationList}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onClearAll={() => setNotificationList([])}
      />
    </>
  )
}
