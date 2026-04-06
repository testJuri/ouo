import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Mail, Crown, UserX, MoreHorizontal, Search } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import { useState } from "react"

interface Member {
  id: number
  name: string
  email: string
  role: "owner" | "admin" | "editor" | "viewer"
  avatar: string
  status: "active" | "pending"
  joinedAt: string
}

const mockMembers: Member[] = [
  {
    id: 1,
    name: "陈晓明",
    email: "xiaoming@example.com",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "林小雨",
    email: "xiaoyu@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "active",
    joinedAt: "2024-02-20",
  },
  {
    id: 3,
    name: "王大伟",
    email: "dawei@example.com",
    role: "editor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "active",
    joinedAt: "2024-03-10",
  },
  {
    id: 4,
    name: "张美琪",
    email: "meiqi@example.com",
    role: "viewer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "pending",
    joinedAt: "2024-04-05",
  },
]

const roleLabels: Record<string, string> = {
  owner: "所有者",
  admin: "管理员",
  editor: "编辑",
  viewer: "访客",
}

const roleColors: Record<string, string> = {
  owner: "bg-amber-500",
  admin: "bg-blue-500",
  editor: "bg-emerald-500",
  viewer: "bg-gray-500",
}

export default function Members() {
  const [members] = useState<Member[]>(mockMembers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen overflow-hidden bg-[hsl(var(--surface))]">
      <Sidebar />

      <main className="relative ml-64 flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--outline-variant))]/15 px-8">
          <h1 className="text-lg font-black text-[hsl(var(--on-surface))]">成员管理</h1>
          <Button className="bg-[hsl(var(--primary))] text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            邀请成员
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-black text-[hsl(var(--on-surface))]">{members.length}</div>
              <div className="text-xs text-[hsl(var(--secondary))]">总成员</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-black text-[hsl(var(--primary))]">
                {members.filter((m) => m.status === "active").length}
              </div>
              <div className="text-xs text-[hsl(var(--secondary))]">活跃成员</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-black text-amber-500">
                {members.filter((m) => m.status === "pending").length}
              </div>
              <div className="text-xs text-[hsl(var(--secondary))]">待确认</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-black text-emerald-500">
                {members.filter((m) => m.role === "editor").length}
              </div>
              <div className="text-xs text-[hsl(var(--secondary))]">编辑者</div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--secondary))]" />
              <input
                type="text"
                placeholder="搜索成员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container))] py-2 pl-10 pr-4 text-sm focus:border-[hsl(var(--primary))] focus:outline-none"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="flex items-center justify-between p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[hsl(var(--on-surface))]">
                        {member.name}
                      </span>
                      {member.role === "owner" && (
                        <Crown className="h-4 w-4 text-amber-500" />
                      )}
                      {member.status === "pending" && (
                        <Badge variant="secondary" className="text-[10px]">
                          待确认
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--secondary))]">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    className={`${roleColors[member.role]} text-white border-0 text-[10px]`}
                  >
                    {roleLabels[member.role]}
                  </Badge>
                  <span className="text-xs text-[hsl(var(--secondary))]">
                    {member.joinedAt}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <UserX className="h-4 w-4 text-[hsl(var(--secondary))]" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4 text-[hsl(var(--secondary))]" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-[hsl(var(--secondary))]">
              <div className="mb-4 text-4xl">🔍</div>
              <p>未找到匹配的成员</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
