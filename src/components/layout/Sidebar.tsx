import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutGrid, 
  FolderOpen,
  Settings,
  ArrowLeft,
  ChevronDown,
  Plus,
  Check,
  Loader2
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import ApiKeySettings from "./ApiKeySettings"

const navItems = [
  { icon: LayoutGrid, label: "仪表盘", href: "/dashboard" },
  { icon: FolderOpen, label: "项目", href: "/projects" },
]

const projects = [
  { id: 1, name: "Cyberpunk Ronin", active: true },
  { id: 2, name: "Spirit of Zen", active: false },
  { id: 3, name: "Mech Core Series", active: false },
  { id: 4, name: "Kinetic Backgrounds", active: false },
]

export default function Sidebar() {
  const [currentProject, setCurrentProject] = useState(projects[0])
  const [isSwitching, setIsSwitching] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      {/* Loading Overlay */}
      {isSwitching && (
        <div className="fixed inset-0 z-[100] bg-[hsl(var(--surface))]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[hsl(var(--primary))] animate-spin" />
            <p className="text-sm text-[hsl(var(--on-surface))] font-medium">正在切换项目...</p>
          </div>
        </div>
      )}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[hsl(var(--surface-container-low))] flex flex-col p-6 gap-y-4 z-50">
      {/* Project Selector */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full text-left p-3 rounded-xl hover:bg-[hsl(var(--surface-container-high))] transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[hsl(var(--on-surface))] truncate max-w-[160px]">
                    {currentProject.name}
                  </h1>
                  <p className="text-xs text-[hsl(var(--secondary))]">
                    编辑阶段
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--on-surface))]" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs font-medium text-[hsl(var(--secondary))]">
              切换项目
            </div>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => {
                  if (project.id === currentProject.id) return
                  setIsSwitching(true)
                  setCurrentProject(project)
                  // 2秒 loading 后跳转到项目工作台（默认显示片段管理）
                  setTimeout(() => {
                    setIsSwitching(false)
                    navigate(`/project/${project.id}`, { replace: true })
                  }, 2000)
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className={project.id === currentProject.id ? "font-medium" : ""}>
                  {project.name}
                </span>
                {project.id === currentProject.id && (
                  <Check className="w-4 h-4 text-[hsl(var(--primary))]" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/dashboard" && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "text-[hsl(var(--primary))] font-semibold bg-[hsl(var(--surface-container-high))]" 
                  : "text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="pt-6 mt-6 border-t border-[hsl(var(--outline-variant))]/30">
        <Link to="/dashboard">
          <Button variant="ghost" className="w-full justify-start gap-2 text-[hsl(var(--on-secondary-fixed-variant))] mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>返回控制台</span>
          </Button>
        </Link>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))] transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>设置</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-4 py-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="用户" />
            <AvatarFallback>陈</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-[hsl(var(--on-surface))]">陈晓明</p>
            <p className="text-[10px] text-[hsl(var(--secondary))]">专业创作者</p>
          </div>
        </div>
      </div>
    </aside>

    {/* API Key Settings Dialog */}
    <ApiKeySettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}
