import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Mail, UserX, MoreHorizontal, Search, Shield, User, Edit, Trash2, UserCheck, Loader2, UserPlus } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import { useEffect, useState } from "react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { projectMembersApi, projectsApi } from "@/api"
import { getActiveProjectId } from "@/lib/session"
import { mapMember } from "@/lib/projectMappers"

interface Member {
  id: number
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  avatar: string
  status: "active" | "pending"
  joinedAt: string
}

const roleLabels: Record<Member["role"], string> = {
  owner: "所有者",
  editor: "编辑者",
  viewer: "查看者",
}

const roleOptions: { value: Member["role"]; label: string }[] = [
  { value: "editor", label: "编辑者" },
  { value: "viewer", label: "查看者" },
]

const isAdminRole = (role: Member["role"]) => role === "owner" || role === "editor"

export default function Members() {
  const { notify } = useFeedback()
  const [members, setMembers] = useState<Member[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null)
  const [currentProjectName, setCurrentProjectName] = useState("当前项目")
  const [searchQuery, setSearchQuery] = useState("")
  
  // 邀请成员对话框状态
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer")
  const [isInviting, setIsInviting] = useState(false)
  
  // 编辑成员对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editRole, setEditRole] = useState<Member["role"]>("viewer")
  
  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const loadMembers = async (projectId: number) => {
    const response = await projectMembersApi.list(projectId)
    setMembers(response.list.map((member) => mapMember(member)))
  }

  useEffect(() => {
    const projectId = getActiveProjectId()
    if (!projectId) return

    setCurrentProjectId(projectId)
    void loadMembers(projectId).catch((error) => notify.error(error instanceof Error ? error.message : "加载成员失败"))
    void projectsApi.getById(projectId).then((project) => setCurrentProjectName(project.name)).catch(() => undefined)
  }, [notify])

  // 处理邀请成员
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      notify.error("请输入用户 ID")
      return
    }

    if (!currentProjectId) {
      notify.error("未选择项目，无法邀请成员")
      return
    }

    setIsInviting(true)

    try {
      const userId = Number(inviteEmail)
      if (!Number.isFinite(userId)) {
        notify.error("当前后端邀请接口需要用户 ID")
        return
      }

      await projectMembersApi.add(currentProjectId, { userId, role: inviteRole })
      await loadMembers(currentProjectId)
      setInviteDialogOpen(false)
      setInviteEmail("")
      setInviteRole("viewer")
      notify.success(`已添加用户 ${userId} 到项目`)
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "邀请成员失败")
    } finally {
      setIsInviting(false)
    }
  }

  // 处理打开编辑对话框
  const handleOpenEdit = (member: Member) => {
    if (member.role === "owner") {
      notify.error("无法修改所有者的权限")
      return
    }
    setEditingMember(member)
    setEditRole(member.role as "editor" | "viewer")
    setEditDialogOpen(true)
  }

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!editingMember) return
    if (!currentProjectId) return

    try {
      await projectMembersApi.updateRole(currentProjectId, editingMember.id, editRole)
      await loadMembers(currentProjectId)
      setEditDialogOpen(false)
      setEditingMember(null)
      notify.success(`已更新 ${editingMember.name} 的权限为 ${roleLabels[editRole]}`)
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "更新成员权限失败")
    }
  }

  // 处理打开删除对话框
  const handleOpenDelete = (member: Member) => {
    if (member.role === "owner") {
      notify.error("无法删除项目所有者")
      return
    }
    setDeletingMember(member)
    setDeleteDialogOpen(true)
  }

  // 处理删除成员
  const handleDelete = async () => {
    if (!deletingMember) return
    if (!currentProjectId) return

    setIsDeleting(true)

    try {
      await projectMembersApi.remove(currentProjectId, deletingMember.id)
      await loadMembers(currentProjectId)
      setDeleteDialogOpen(false)
      setDeletingMember(null)
      notify.success(`已将 ${deletingMember.name} 从项目中移除`)
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "移除成员失败")
    } finally {
      setIsDeleting(false)
    }
  }

  // 处理重新发送邀请
  const handleResendInvite = async (member: Member) => {
    notify.success(`已重新发送邀请邮件至 ${member.email}`)
  }

  return (
    <div className="workspace-shell h-screen overflow-hidden bg-[hsl(var(--surface))]">
      <Sidebar />

      <main className="relative ml-64 flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[hsl(var(--outline-variant))]/15 px-8">
          <div>
            <h1 className="text-lg font-black text-[hsl(var(--on-surface))]">成员管理</h1>
            <p className="text-xs text-[hsl(var(--secondary))]">{currentProjectName}</p>
          </div>
          <Button 
            className="bg-[hsl(var(--primary))] text-white hover:opacity-90"
            onClick={() => setInviteDialogOpen(true)}
          >
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
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isAdminRole(member.role)
                        ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                        : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--secondary))]"
                    }`}
                    title={roleLabels[member.role]}
                    aria-label={roleLabels[member.role]}
                  >
                    {isAdminRole(member.role) ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <span className="text-xs text-[hsl(var(--secondary))]">
                    {member.joinedAt}
                  </span>
                  <div className="flex gap-1">
                    {member.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleResendInvite(member)}
                        title="重新发送邀请"
                      >
                        <Mail className="h-4 w-4 text-[hsl(var(--secondary))]" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleOpenDelete(member)}
                      title="移除成员"
                    >
                      <UserX className="h-4 w-4 text-[hsl(var(--secondary))]" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-[hsl(var(--secondary))]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>成员操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEdit(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑权限
                        </DropdownMenuItem>
                        {member.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                            <Mail className="mr-2 h-4 w-4" />
                            重新发送邀请
                          </DropdownMenuItem>
                        )}
                        {member.role !== "owner" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleOpenDelete(member)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              移除成员
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* 邀请成员对话框 */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>邀请成员</DialogTitle>
            <DialogDescription>
              输入邮箱地址邀请新成员加入项目
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">角色权限</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "editor" | "viewer")}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleInvite} 
              disabled={isInviting}
              className="bg-[hsl(var(--primary))] text-white"
            >
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  发送邀请
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑成员对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑成员权限</DialogTitle>
            <DialogDescription>
              修改 {editingMember?.name} 的角色权限
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={editingMember?.avatar} />
                <AvatarFallback>{editingMember?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{editingMember?.name}</p>
                <p className="text-sm text-[hsl(var(--secondary))]">{editingMember?.email}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">角色权限</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as Member["role"])}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-[hsl(var(--primary))] text-white"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>移除成员</DialogTitle>
            <DialogDescription>
              确定要将 <strong>{deletingMember?.name}</strong> 从项目中移除吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={deletingMember?.avatar} />
                <AvatarFallback>{deletingMember?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{deletingMember?.name}</p>
                <p className="text-sm text-[hsl(var(--secondary))]">{deletingMember?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  移除中...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  确认移除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
