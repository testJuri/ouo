import { useState } from "react"
import { 
  Home as HomeIcon,
  FolderOpen,
  Triangle,
  Sparkles,
  Plus,
  Settings,
  LogOut,
  User,
  MoreVertical,
  Clock,
  Film
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAccountInfo } from "@/hooks/useAccountInfo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { OuoTask } from "@/api/ouoTypes"

// Mock 项目数据
const mockProjects: OuoTask[] = [
  {
    taskId: 1,
    title: "魔兽世界同人系列",
    cover: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=400&h=300&fit=crop",
    styleName: "史诗奇幻",
    createdAt: Date.now() - 86400000 * 2,
    aspectRatio: "16:9",
  },
  {
    taskId: 2,
    title: "赛博朋克城市夜景",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=300&fit=crop",
    styleName: "赛博朋克",
    createdAt: Date.now() - 86400000,
    aspectRatio: "9:16",
  },
  {
    taskId: 3,
    title: "古风武侠短片",
    cover: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
    styleName: "水墨风格",
    createdAt: Date.now() - 3600000 * 4,
    aspectRatio: "16:9",
  },
  {
    taskId: 4,
    title: "蒸汽朋克机械龙",
    cover: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400&h=300&fit=crop",
    styleName: "蒸汽朋克",
    createdAt: Date.now() - 86400000 * 3,
    aspectRatio: "1:1",
  },
  {
    taskId: 5,
    title: "梦幻森林冒险",
    cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    styleName: "童话风格",
    createdAt: Date.now() - 86400000 * 4,
    aspectRatio: "4:3",
  },
]

// 顶部导航
function TopNav() {
  const { accountInfo } = useAccountInfo()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-xl">
      <Link to="/" className="text-2xl font-bold text-white">
        轩晔<span className="font-light">OUO</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
          <Sparkles className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/80 font-medium">{accountInfo?.balance ?? '--'} 积分</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white/20 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-xl border-white/10">
            <DropdownMenuLabel className="text-white/60">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>我的账户</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>当前积分</span>
                <span className="font-medium">{accountInfo?.balance ?? '--'}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>设置</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

// 左侧工具栏
function SidebarNav() {
  const navigate = useNavigate()
  
  const tools = [
    { id: 'home', icon: HomeIcon, label: '首页', action: () => navigate('/') },
    { id: 'projects', icon: FolderOpen, label: '项目', action: () => navigate('/projects'), active: true },
    { id: 'create', icon: Triangle, label: '创作', action: () => navigate('/gallery') },
  ]

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={tool.action}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                tool.active
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 项目卡片
function ProjectCard({ project }: { project: OuoTask }) {
  const navigate = useNavigate()
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div 
      onClick={() => navigate(`/project/${project.taskId}`)}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
    >
      {/* 封面图 */}
      <div className="relative aspect-video bg-black/20">
        <img 
          src={project.cover} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-black/40 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-black/80 backdrop-blur-xl border-white/10">
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
                重命名
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
                复制
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer">
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* 信息 */}
      <div className="p-4">
        <h3 className="text-white font-medium mb-2 line-clamp-1">{project.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
          <span className="px-2 py-0.5 rounded bg-white/5">{project.aspectRatio}</span>
          <span>{project.styleName}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects] = useState<OuoTask[]>(mockProjects)

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <SidebarNav />
      
      <main className="pt-24 pb-12 px-8 pl-24">
        <div className="max-w-6xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">我的项目</h1>
              <p className="text-white/50">共 {projects.length} 个项目</p>
            </div>
            <Link
              to="/gallery"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </Link>
          </div>
          
          {/* 项目网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.taskId} project={project} />
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/50 mb-4">还没有项目</p>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                创建第一个项目
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
