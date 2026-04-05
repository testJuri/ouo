import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Bell, Check, Trash2, X } from "lucide-react"

export interface NotificationItem {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type?: "success" | "info" | "warning"
}

interface NotificationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: NotificationItem[]
  onMarkAllAsRead: () => void
  onMarkAsRead: (id: number) => void
  onClearAll: () => void
}

export const demoNotifications: NotificationItem[] = [
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

export default function NotificationDrawer({
  open,
  onOpenChange,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearAll,
}: NotificationDrawerProps) {
  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="w-[420px] max-w-[92vw] border-l border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface))] p-0"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-[hsl(var(--outline-variant))]/15 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[hsl(var(--on-surface))]">消息通知</h2>
                <p className="mt-1 text-sm text-[hsl(var(--secondary))]">
                  {unreadCount > 0 ? `${unreadCount} 条未读消息` : "没有新消息"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="h-9 rounded-lg px-3 text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  全部已读
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-9 w-9 rounded-lg text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {notifications.length === 0 ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-[hsl(var(--secondary))]">
                <Bell className="mb-4 h-12 w-12 opacity-30" />
                <p className="text-sm">暂无通知</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => onMarkAsRead(notification.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      notification.read
                        ? "border-transparent bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container-high))]"
                        : "border-[hsl(var(--primary))]/18 bg-[hsl(var(--primary))]/5 hover:bg-[hsl(var(--primary))]/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className={`text-sm font-bold ${
                            notification.read
                              ? "text-[hsl(var(--on-surface))]"
                              : "text-[hsl(var(--primary))]"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-xs leading-6 text-[hsl(var(--on-surface-variant))]">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read ? (
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" />
                      ) : null}
                    </div>
                    <p className="mt-3 text-[10px] font-medium text-[hsl(var(--secondary))]">{notification.time}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[hsl(var(--outline-variant))]/15 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                className="h-11 flex-1 rounded-xl text-sm font-semibold text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                onClick={() => onOpenChange(false)}
              >
                查看全部消息
              </Button>
              <Button
                className="h-11 rounded-2xl border-0 px-5 signature-gradient text-sm font-bold text-white"
                onClick={onClearAll}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
