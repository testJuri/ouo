import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NotificationDrawer, { demoNotifications } from "@/components/layout/NotificationDrawer"
import UserProfileMenu from "@/components/layout/UserProfileMenu"
import { Plus, ChevronLeft, Bell } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import ProjectCreator from "./ProjectCreator"
import ProjectEditor, { type EditableProject } from "./ProjectEditor"
import Sidebar from "@/components/layout/Sidebar"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import {
  IDENTITY_CHANGE_EVENT,
  getIdentityMeta,
  getStoredIdentity,
  type IdentityOption,
} from "@/lib/mock-identities"

interface Project {
  id: number
  name: string
  description?: string
  image: string
  status: "in-progress" | "completed" | "draft"
  modified: string
  code: string
  assetCount: number
}

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Cyberpunk Ronin",
    description: "赛博朋克风格的武士故事",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=400&fit=crop",
    status: "in-progress",
    modified: "2 小时前",
    code: "PJ_001",
    assetCount: 24,
  },
  {
    id: 2,
    name: "Spirit of Zen",
    description: "东方禅意美学探索",
    image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=400&fit=crop",
    status: "completed",
    modified: "3 天前",
    code: "PJ_002",
    assetCount: 56,
  },
  {
    id: 3,
    name: "Mech Core Series",
    description: "机甲核心系列动画",
    image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=600&h=400&fit=crop",
    status: "in-progress",
    modified: "5 小时前",
    code: "PJ_003",
    assetCount: 38,
  },
  {
    id: 4,
    name: "Kinetic Backgrounds",
    description: "动态背景素材库",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=400&fit=crop",
    status: "draft",
    modified: "1 周前",
    code: "PJ_004",
    assetCount: 12,
  },
]

export default function ProjectsList() {
  const navigate = useNavigate()
  const { notify } = useFeedback()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<EditableProject | null>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(demoNotifications)
  const [currentIdentity, setCurrentIdentity] = useState<IdentityOption>(getStoredIdentity)
  const unreadCount = notificationList.filter((item) => !item.read).length
  const currentIdentityMeta = getIdentityMeta(currentIdentity)
  const visibleProjects = currentIdentityMeta.hasProjects ? projects : []

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`)
  }

  const handleCreateProject = (data: {
    name: string
    password?: string
    mode: string
    description: string
    scriptFile?: File | null
  }) => {
    const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1
    const newProject: Project = {
      id: newId,
      name: data.name,
      description: data.description,
      image: `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=400&fit=crop`,
      status: "draft",
      modified: "刚刚",
      code: `PJ_${String(newId).padStart(3, "0")}`,
      assetCount: 0,
    }
    setProjects((prev) => [newProject, ...prev])
  }

  const handleSaveProject = (updatedProject: EditableProject) => {
    setProjects((prev) => prev.map((item) => (item.id === updatedProject.id ? updatedProject : item)))
    setEditingProject(updatedProject)
    notify.success(`已更新项目：${updatedProject.name}`)
  }

  const markAllAsRead = () => {
    setNotificationList((current) => current.map((item) => ({ ...item, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotificationList((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  useEffect(() => {
    const syncIdentity = () => setCurrentIdentity(getStoredIdentity())
    const handleIdentityChange = (event: Event) => {
      const nextIdentity = (event as CustomEvent<IdentityOption>).detail
      if (nextIdentity) {
        setCurrentIdentity(nextIdentity)
        return
      }
      syncIdentity()
    }

    window.addEventListener(IDENTITY_CHANGE_EVENT, handleIdentityChange as EventListener)
    window.addEventListener("storage", syncIdentity)

    return () => {
      window.removeEventListener(IDENTITY_CHANGE_EVENT, handleIdentityChange as EventListener)
      window.removeEventListener("storage", syncIdentity)
    }
  }, [])

  return (
    <>
    <div className="workspace-shell h-screen overflow-hidden bg-[hsl(var(--surface))]">
      <ProjectCreator
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onCreate={handleCreateProject}
      />
      <ProjectEditor
        open={isProjectEditorOpen}
        onOpenChange={setIsProjectEditorOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <Sidebar />

      <main className="relative ml-64 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="workspace-fixed-header fixed top-0 z-40 flex h-16 items-center justify-between border-b border-[hsl(var(--outline-variant))]/15 bg-[hsl(var(--surface-container-lowest))]/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-black text-[hsl(var(--on-surface))]">项目列表</span>
          </div>

          <div className="flex items-center gap-4">
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

            <UserProfileMenu />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add New Project Card */}
            <div
              onClick={() => setIsProjectDialogOpen(true)}
              className="aspect-[4/3] bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-xl hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">新建项目</span>
              <span className="text-[10px] text-[hsl(var(--secondary))] mt-1 uppercase tracking-tighter">
                开始新的创作
              </span>
            </div>

            {/* Project Cards */}
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border-0 ${
                        project.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : project.status === "in-progress"
                          ? "bg-[hsl(var(--primary))] text-white"
                          : "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-secondary-fixed-variant))]"
                      }`}
                    >
                      {project.status === "completed"
                        ? "已完成"
                        : project.status === "in-progress"
                        ? "进行中"
                        : "草稿"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-extrabold text-[hsl(var(--on-surface))] mb-1">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-[10px] text-[hsl(var(--secondary))] mb-2 line-clamp-1">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[hsl(var(--secondary))] font-medium">
                      {project.assetCount} 个资源 · 修改于 {project.modified}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))] px-2 py-0.5 rounded-full font-bold border-0"
                    >
                      {project.code}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {!currentIdentityMeta.hasProjects ? (
              <div className="col-span-full flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-lowest))] px-8 text-center">
                <div className="rounded-full bg-[hsl(var(--surface-container-high))] px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-[hsl(var(--secondary))]">
                  {currentIdentityMeta.label}
                </div>
                <h3 className="mt-5 text-2xl font-black text-[hsl(var(--on-surface))]">当前身份下还没有项目</h3>
                <p className="mt-3 max-w-md text-sm text-[hsl(var(--secondary))]">
                  这个身份用于模拟刚加入系统的新成员视角。你可以切换回“创作者”、“管理员”或“项目统筹”查看已有项目。
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 border-t border-[hsl(var(--outline-variant))]/15 bg-[hsl(var(--surface))] shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-sm font-bold text-[hsl(var(--on-surface))]">MangaCanvas</span>
              <p className="text-xs text-[hsl(var(--on-secondary-fixed-variant))] mt-1">© 2024 Kinetic Gallery. 保留所有权利。</p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors">
                隐私政策
              </Link>
              <Link to="/terms" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors">
                服务条款
              </Link>
              <Link to="/contact" className="text-xs text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors">
                联系我们
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
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
