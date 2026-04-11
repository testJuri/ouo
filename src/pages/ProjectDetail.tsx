import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  FileText, 
  Edit3,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"


// 模拟剧集数据
interface Episode {
  id: number
  title: string
  status: "completed" | "processing" | "pending"
  thumbnail?: string
  progress: { current: number; total: number }
  duration?: string
}

// 模拟项目数据
const mockProject = {
  id: 1,
  name: "《赛博朋克风格》",
  scriptFile: "覆写协议.txt",
  aspectRatio: "9:16" as const,
  episodes: [
    {
      id: 1,
      title: "第一集",
      status: "completed" as const,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=700&fit=crop",
      progress: { current: 6, total: 6 },
      duration: "2:34",
    },
    {
      id: 2,
      title: "第二集",
      status: "processing" as const,
      progress: { current: 3, total: 6 },
    },
    {
      id: 3,
      title: "第三集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
    {
      id: 4,
      title: "第四集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
    {
      id: 5,
      title: "第五集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
    {
      id: 6,
      title: "第六集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
    {
      id: 7,
      title: "第七集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
    {
      id: 8,
      title: "第八集",
      status: "pending" as const,
      progress: { current: 0, total: 6 },
    },
  ] as Episode[],
}

// 顶部导航栏
function TopNav({ projectName, scriptFile }: { projectName: string; scriptFile: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel border-b border-white/5">
      {/* Left: Logo & Back */}
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <span className="text-xl font-bold text-white tracking-tight">
            轩晔<span className="font-light text-white/60">OUO</span>
          </span>
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/5"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Link>
        </Button>
      </div>

      {/* Center: Project Info */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <FileText className="w-4 h-4 text-white/50" />
          <span className="text-white/70">{scriptFile}</span>
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
        <span className="text-white font-medium">{projectName}</span>
        <span className="text-white/40 text-xs">9:16</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/80 font-medium">52</span>
          <span className="text-xs text-white/30">|</span>
          <span className="text-xs text-white/50">充值</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border border-white/20 overflow-hidden">
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

// 剧集卡片
function EpisodeCard({ episode, projectId }: { episode: Episode; projectId: string }) {
  const navigate = useNavigate()
  const isCompleted = episode.status === "completed"
  const isProcessing = episode.status === "processing"
  
  return (
    <div className="group relative">
      {/* Card Container */}
      <div 
        onClick={() => navigate(`/project/${projectId}/episode/${episode.id}`)}
        className={`
          relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer
          ${isCompleted ? "ring-2 ring-white/20" : "bg-[#2a2a2a]"}
          transition-all duration-300 hover:scale-[1.02] hover:ring-2 hover:ring-white/30
        `
      }>
        {isCompleted && episode.thumbnail ? (
          <>
            {/* Completed Episode with Thumbnail */}
            <img 
              src={episode.thumbnail} 
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Completed Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-emerald-500 text-white text-xs font-medium">
              完成
            </div>
            
            {/* Duration */}
            {episode.duration && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white/80 text-xs">
                {episode.duration}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Pending/Processing Episode with Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/10 select-none">OUO</span>
            </div>
            
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
              </div>
            )}
          </>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            size="sm" 
            className="bg-white text-black hover:bg-white/90 font-medium"
          >
            {isCompleted ? "查看" : "制作"}
          </Button>
        </div>
      </div>
      
      {/* Episode Info */}
      <div className="mt-3 px-1">
        <h3 className="text-white font-medium text-center">{episode.title}</h3>
        {isCompleted && (
          <div className="flex items-center justify-between mt-1 text-xs text-white/40">
            <span>进度:</span>
            <span>{episode.progress.current}/{episode.progress.total}</span>
          </div>
        )}
        {isProcessing && (
          <div className="mt-1 text-xs text-center text-amber-400">
            生成中 {episode.progress.current}/{episode.progress.total}
          </div>
        )}
      </div>
    </div>
  )
}

// 添加新集卡片
function AddEpisodeCard({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6 text-white/40 group-hover:text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <span className="text-sm text-white/40 group-hover:text-white/60">添加新集</span>
      </div>
    </button>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState(mockProject)
  
  const handleAddEpisode = () => {
    const newEpisode: Episode = {
      id: project.episodes.length + 1,
      title: `第${["一","二","三","四","五","六","七","八","九","十"][project.episodes.length] || (project.episodes.length + 1) + "集"}集`,
      status: "pending",
      progress: { current: 0, total: 6 },
    }
    setProject(prev => ({
      ...prev,
      episodes: [...prev.episodes, newEpisode]
    }))
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <TopNav projectName={project.name} scriptFile={project.scriptFile} />
      
      {/* Main Content */}
      <main className="pt-20 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Episodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {project.episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} projectId={id ?? "1"} />
            ))}
            <AddEpisodeCard onClick={handleAddEpisode} />
          </div>
        </div>
      </main>
    </div>
  )
}
