import { useEffect, useState } from "react"
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
  Film,
  Search,
  Loader2,
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
import { projectsApi } from "@/api/projectsApi"
import type { ProjectDTO } from "@/api/types"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

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
        <span className="font-light">OUO</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* 工具图标 */}
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <div className="w-4 h-4 border border-current rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-current rounded-sm" />
          </div>
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-current rounded-sm" />
            ))}
          </div>
        </button>

        {/* 积分 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white/80 font-medium">{accountInfo?.balance ?? '--'}</span>
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
            <DropdownMenuItem
              onClick={() => navigate('/change-password')}
              className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>修改密码</span>
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
function ProjectCard({ project }: { project: ProjectDTO }) {
  const navigate = useNavigate()

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const statusLabel = project.status === 'draft' ? '草稿' : project.status === 'in-progress' ? '进行中' : '已完成'
  const statusColor = project.status === 'draft' ? 'bg-gray-500/80' : project.status === 'in-progress' ? 'bg-blue-500/80' : 'bg-green-500/80'

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
    >
      {/* 封面图 */}
      <div className="relative aspect-[4/3] bg-black/20 m-3 rounded-xl overflow-hidden">
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1614726365723-49cfae927846?w=400&h=300&fit=crop'}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        {/* 标签 */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-white text-xs ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 信息 */}
      <div className="px-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium mb-1 truncate">{project.name}</h3>
            <p className="text-sm text-white/40">{formatDate(project.createdAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-2"
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
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectDTO[]>([])
  const [loading, setLoading] = useState(false)
  const { notify } = useFeedback()

  useEffect(() => {
    setLoading(true)
    projectsApi
      .list({ page: 1, pageSize: 20 })
      .then((res) => {
        setProjects(res.list)
      })
      .catch((err) => {
        notify.error(err instanceof Error ? err.message : '获取项目列表失败')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [notify])

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <SidebarNav />

      <main className="pt-24 pb-12 px-8 pl-24">
        <div className="max-w-6xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-medium text-white">我的项目</h1>

            {/* 搜索框 */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="请输入项目名称"
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
          ) : (
            <>
              {/* 项目网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
