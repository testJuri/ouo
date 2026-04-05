import { ReactNode } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { Bell, ChevronDown, CreditCard, LogOut, Search, Settings, User } from "lucide-react"

interface WorkspaceHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  actions?: ReactNode
}

export default function WorkspaceHeader({
  title,
  subtitle,
  searchPlaceholder = "搜索内容...",
  actions,
}: WorkspaceHeaderProps) {
  const { notify } = useFeedback()

  return (
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
            onClick={() => notify.info("通知中心开发中")}
            className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
          >
            <Bell className="h-5 w-5" />
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
                  <p className="text-[10px] text-[hsl(var(--secondary))]">专业创作者</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-[hsl(var(--secondary))] md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>个人中心</DropdownMenuLabel>
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
              <DropdownMenuItem onClick={() => notify.info("退出登录功能开发中")}>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
