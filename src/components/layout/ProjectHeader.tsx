import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Settings, User, LogOut, X, Check } from "lucide-react"

import type { ProjectTab } from "@/types"

// 示例通知数据
const notifications = [
  {
    id: 1,
    title: "片段渲染完成",
    message: "序章：觉醒 的片段已完成渲染",
    time: "2 分钟前",
    read: false,
    type: "success",
  },
  {
    id: 2,
    title: "角色创建成功",
    message: "新角色 龙崎真治 已创建",
    time: "1 小时前",
    read: false,
    type: "info",
  },
  {
    id: 3,
    title: "AI 生成任务完成",
    message: "3 个物品图片已生成",
    time: "3 小时前",
    read: true,
    type: "success",
  },
  {
    id: 4,
    title: "团队成员邀请",
    message: "李明邀请你加入项目 赛博武士",
    time: "昨天",
    read: true,
    type: "warning",
  },
]

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
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  
  const unreadCount = notificationList.filter((n) => !n.read).length
  
  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  
  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

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

      {/* Notification Sidebar */}
      {notificationOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setNotificationOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-96 bg-[hsl(var(--surface))] shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20">
              <div>
                <h2 className="text-lg font-bold text-[hsl(var(--on-surface))]">消息通知</h2>
                <p className="text-xs text-[hsl(var(--secondary))]">
                  {unreadCount > 0 ? `${unreadCount} 条未读消息` : "没有新消息"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                    onClick={markAllAsRead}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    全部已读
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNotificationOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {notificationList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--secondary))]">
                    <Bell className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">暂无通知</p>
                  </div>
                ) : (
                  notificationList.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        notification.read 
                          ? "bg-[hsl(var(--surface-container-low))]" 
                          : "bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`text-sm font-semibold ${notification.read ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--primary))]"}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-[hsl(var(--on-surface-variant))] mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-[hsl(var(--secondary))]">{notification.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[hsl(var(--outline-variant))]/20">
              <Button 
                variant="ghost" 
                className="w-full text-xs text-[hsl(var(--secondary))]"
                onClick={() => setNotificationOpen(false)}
              >
                查看全部消息
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
