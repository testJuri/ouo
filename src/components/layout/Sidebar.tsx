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
  Image as ImageIcon,
  BarChart3,
  Settings,
  ArrowLeft,
  ChevronDown,
  Plus,
  Check
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

const navItems = [
  { icon: LayoutGrid, label: "仪表盘", href: "#", active: true },
  { icon: FolderOpen, label: "项目", href: "#" },
  { icon: ImageIcon, label: "媒体库", href: "#" },
  { icon: BarChart3, label: "分析", href: "#" },
]

const projects = [
  { id: 1, name: "Cyberpunk Ronin", active: true },
  { id: 2, name: "Spirit of Zen", active: false },
  { id: 3, name: "Mech Core Series", active: false },
  { id: 4, name: "Kinetic Backgrounds", active: false },
]

export default function Sidebar() {
  const [currentProject, setCurrentProject] = useState(projects[0])

  return (
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
                onClick={() => setCurrentProject(project)}
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

      {/* New Asset Button */}
      <Button className="signature-gradient text-white font-semibold py-3 px-6 rounded-xl mb-6 flex items-center justify-center gap-2 transition-transform active:scale-95 duration-150 border-0">
        新建资源
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              item.active 
                ? "text-[hsl(var(--primary))] font-semibold bg-[hsl(var(--surface-container-high))]" 
                : "text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))]"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="pt-6 mt-6 border-t border-[hsl(var(--outline-variant))]/30">
        <Link to="/dashboard">
          <Button variant="ghost" className="w-full justify-start gap-2 text-[hsl(var(--on-secondary-fixed-variant))] mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>返回控制台</span>
          </Button>
        </Link>
        <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))] transition-colors">
          <Settings className="w-5 h-5" />
          <span>设置</span>
        </a>
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
  )
}
