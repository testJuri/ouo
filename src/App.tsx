import { useEffect, useState, useRef, Suspense, lazy } from "react"
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import { message } from "antd"

import { 
  Home as HomeIcon,
  FolderOpen,
  Triangle,
  Sparkles,
  Palette,
  Monitor,
  Smartphone,
  Wand2,
  Loader2,
  Upload,
  Settings,
  LogOut,
  User
} from "lucide-react"
import { StyleSelectorDialog, type StyleOption } from "@/components/StyleSelectorDialog"
import { AddCharacterDialog } from "@/components/AddCharacterDialog"
import { AddSceneDialog } from "@/components/AddSceneDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  IDENTITY_CHANGE_EVENT,
  canAccessProjectRoutes,
  getStoredIdentity,
  type IdentityOption,
} from "@/lib/mock-identities"
import { ouoApi } from "@/api/ouoApi"
import { useAccountInfo } from "@/hooks/useAccountInfo"

// 懒加载页面
const Login = lazy(() => import("./pages/auth/Login"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Gallery = lazy(() => import("./pages/Gallery"))
const Terms = lazy(() => import("./pages/Terms"))
const Privacy = lazy(() => import("./pages/Privacy"))
const Contact = lazy(() => import("./pages/Contact"))
const Projects = lazy(() => import("./pages/Projects"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const EpisodeWorkflow = lazy(() => import("./pages/EpisodeWorkflow"))

function IdentityRouteGuard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentIdentity, setCurrentIdentity] = useState<IdentityOption>(getStoredIdentity)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevIdentityRef = useRef<IdentityOption>(getStoredIdentity())

  useEffect(() => {
    const syncIdentity = () => setCurrentIdentity(getStoredIdentity())
    const handleIdentityChange = (event: Event) => {
      const nextIdentity = (event as CustomEvent<IdentityOption>).detail
      if (nextIdentity && nextIdentity !== prevIdentityRef.current) {
        setCurrentIdentity(nextIdentity)
      }
    }

    window.addEventListener(IDENTITY_CHANGE_EVENT, handleIdentityChange as EventListener)
    window.addEventListener("storage", syncIdentity)

    return () => {
      window.removeEventListener(IDENTITY_CHANGE_EVENT, handleIdentityChange as EventListener)
      window.removeEventListener("storage", syncIdentity)
    }
  }, [])

  useEffect(() => {
    const isProjectScopedRoute = location.pathname.startsWith("/project/")

    if (prevIdentityRef.current === currentIdentity) {
      return
    }

    if (isProjectScopedRoute) {
      setIsTransitioning(true)
      
      const timer = setTimeout(() => {
        if (canAccessProjectRoutes(currentIdentity)) {
          navigate("/", { replace: true })
        } else {
          navigate("/", { replace: true })
        }
        setIsTransitioning(false)
        prevIdentityRef.current = currentIdentity
      }, 1500)
      
      return () => clearTimeout(timer)
    } else {
      prevIdentityRef.current = currentIdentity
    }
  }, [currentIdentity, location.pathname, navigate])

  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
          <p className="text-sm font-medium text-white/70">
            正在切换身份...
          </p>
        </div>
      </div>
    )
  }

  return null
}

// 左侧工具栏
function SidebarNav() {
  const [activeTool, setActiveTool] = useState('home')
  const navigate = useNavigate()
  
  const tools = [
    { id: 'home', icon: HomeIcon, label: '首页', action: () => navigate('/') },
    { id: 'projects', icon: FolderOpen, label: '项目', action: () => navigate('/projects') },
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
              onClick={() => {
                setActiveTool(tool.id)
                tool.action()
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeTool === tool.id
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

function TopNav() {
  const { accountInfo } = useAccountInfo()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
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

function CreatorPanel() {
  const navigate = useNavigate()
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
  const [styleDialogOpen, setStyleDialogOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null)
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false)
  const [sceneDialogOpen, setSceneDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style)
  }
  
  const handleAddCharacter = (data: { name: string; prompt: string }) => {
    console.log("添加角色:", data)
  }
  
  const handleAddScene = (data: { name: string; prompt: string; image?: File }) => {
    console.log("添加场景:", data)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const result = await ouoApi.uploadFile(file)
      setUploadedFile({ url: result.url, name: file.name })
      message.success('文件上传成功')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '上传失败')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCreate = async () => {
    if (!uploadedFile) {
      message.warning('请先上传剧本文件')
      return
    }
    if (!selectedStyle) {
      message.warning('请先选择风格')
      return
    }
    setIsCreating(true)
    try {
      const taskId = await ouoApi.createTask({
        styleId: Number(selectedStyle.id),
        aspectRatio,
        scriptFileUrl: uploadedFile.url,
        scriptFileName: uploadedFile.name,
        productionMode: 'INTELLIGENT',
      })
      message.success('任务创建成功')
      navigate(`/project/${taskId}`)
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建失败')
    } finally {
      setIsCreating(false)
    }
  }
  
  return (
    <>
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.txt,.doc,.docx"
      className="hidden"
      onChange={handleFileUpload}
    />
    <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12 tracking-wide">
        让故事，不再囿于文字
      </h1>

      <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-white/60">
          <Sparkles className="w-5 h-5" />
          <span className="text-base">上传素材，选择风格与尺寸，即可开始 AI 创作</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {uploadedFile ? uploadedFile.name : "上传剧本"}
            </span>
          </button>

          <button 
            onClick={() => setStyleDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">
              {selectedStyle ? selectedStyle.name : "风格"}
            </span>
          </button>

          <button 
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
              aspectRatio === '16:9'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">16:9</span>
          </button>

          <button 
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
              aspectRatio === '9:16'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">9:16</span>
          </button>

          <div className="flex-1" />

          <button 
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-all shadow-lg shadow-white/10 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span className="text-sm">生成</span>
          </button>
        </div>
      </div>

      <p className="text-center text-white/40 text-sm mt-8">
        支持小说、剧本、分镜等多种创作模式
      </p>
    </div>

    <StyleSelectorDialog
      open={styleDialogOpen}
      onOpenChange={setStyleDialogOpen}
      onSelect={handleStyleSelect}
      selectedStyleId={selectedStyle?.id}
    />
    
    <AddCharacterDialog
      open={characterDialogOpen}
      onOpenChange={setCharacterDialogOpen}
      onConfirm={handleAddCharacter}
    />
    
    <AddSceneDialog
      open={sceneDialogOpen}
      onOpenChange={setSceneDialogOpen}
      onConfirm={handleAddScene}
    />
    </>
  )
}

// 新的首页
function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* 背景图 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80')`,
        }}
      >
        {/* 暗色遮罩 */}
        <div className="absolute inset-0 bg-black/40" />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>

      {/* 导航 */}
      <TopNav />
      <SidebarNav />

      {/* 主内容区 */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <CreatorPanel />
      </main>

      {/* 底部装饰 */}
      <div className="fixed bottom-8 left-0 right-0 z-10 flex justify-center">
        <div className="flex items-center gap-8 text-white/30 text-xs">
          <Link to="/privacy" className="hover:text-white/60 transition-colors">隐私政策</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-white/60 transition-colors">服务条款</Link>
          <span>|</span>
          <Link to="/contact" className="hover:text-white/60 transition-colors">联系我们</Link>
        </div>
      </div>
    </div>
  )
}

// 路由加载占位组件
function RouteLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <IdentityRouteGuard />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/project/:projectId/episode/:episodeId" element={<EpisodeWorkflow />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App




