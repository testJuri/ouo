import { useEffect, useState, useRef, Suspense, lazy } from "react"
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"

import { 
  Home as HomeIcon,
  FolderOpen,
  Triangle,
  Sparkles,
  Plus,
  Palette,
  Monitor,
  Smartphone,
  Wand2,
  Loader2
} from "lucide-react"
import { StyleSelectorDialog, type StyleOption } from "@/components/StyleSelectorDialog"
import { AddCharacterDialog } from "@/components/AddCharacterDialog"
import { AddSceneDialog } from "@/components/AddSceneDialog"
import {
  IDENTITY_CHANGE_EVENT,
  canAccessProjectRoutes,
  getStoredIdentity,
  type IdentityOption,
} from "@/lib/mock-identities"

// 懒加载页面
const Login = lazy(() => import("./pages/auth/Login"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Gallery = lazy(() => import("./pages/Gallery"))
const Terms = lazy(() => import("./pages/Terms"))
const Privacy = lazy(() => import("./pages/Privacy"))
const Contact = lazy(() => import("./pages/Contact"))
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
    { id: 'projects', icon: FolderOpen, label: '项目', action: () => navigate('/project/1') },
    { id: 'create', icon: Triangle, label: '创作', action: () => {} },
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

// 顶部导航
function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white/20 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  )
}

// 中央创作区域
function CreatorPanel() {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
  const [styleDialogOpen, setStyleDialogOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null)
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false)
  const [sceneDialogOpen, setSceneDialogOpen] = useState(false)
  
  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style)
  }
  
  const handleAddCharacter = (data: { name: string; prompt: string }) => {
    console.log("添加角色:", data)
    // TODO: 调用 API 添加角色
  }
  
  const handleAddScene = (data: { name: string; prompt: string; image?: File }) => {
    console.log("添加场景:", data)
    // TODO: 调用 API 添加场景
  }
  
  return (
    <>
    <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
      {/* 主标题 */}
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12 tracking-wide">
        让故事，不再囿于文字
      </h1>

      {/* 输入面板 */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
        {/* 提示文字 */}
        <div className="flex items-center gap-3 mb-6 text-white/60">
          <Sparkles className="w-5 h-5" />
          <span className="text-base">上传素材，选择风格与尺寸，即可开始 AI 创作</span>
        </div>

        {/* 功能按钮行 */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setSceneDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">场景</span>
          </button>

          <button 
            onClick={() => setCharacterDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">角色</span>
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

          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-all shadow-lg shadow-white/10">
            <Wand2 className="w-4 h-4" />
            <span className="text-sm">生成</span>
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <p className="text-center text-white/40 text-sm mt-8">
        支持小说、剧本、分镜等多种创作模式
      </p>
    </div>

    {/* 风格选择弹框 */}
    <StyleSelectorDialog
      open={styleDialogOpen}
      onOpenChange={setStyleDialogOpen}
      onSelect={handleStyleSelect}
      selectedStyleId={selectedStyle?.id}
    />
    
    {/* 添加角色弹框 */}
    <AddCharacterDialog
      open={characterDialogOpen}
      onOpenChange={setCharacterDialogOpen}
      onConfirm={handleAddCharacter}
    />
    
    {/* 添加场景弹框 */}
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




