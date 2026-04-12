import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  FileText, 
  Edit3,
  Sparkles,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ouoApi } from "@/api/ouoApi"
import { useAccountInfo } from "@/hooks/useAccountInfo"
import type { OuoTaskDetail, OuoEpisode, OuoGenerationStatus } from "@/api/ouoTypes"

function TopNav({ projectName, aspectRatio }: { projectName: string; aspectRatio: string }) {
  const { accountInfo } = useAccountInfo()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel border-b border-white/5">
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

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <FileText className="w-4 h-4 text-white/50" />
          <span className="text-white/70">{projectName}</span>
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
        <span className="text-white/40 text-xs">{aspectRatio}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/80 font-medium">{accountInfo?.balance ?? '--'}</span>
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

function getEpisodeDisplayStatus(episode: OuoEpisode): 'completed' | 'processing' | 'pending' {
  const s = episode.episodeTaskStatus
  if (s.videoMergeStatus === 'SUCCESS') return 'completed'
  const statuses: OuoGenerationStatus[] = [
    s.characterStatus, s.characterPicStatus, s.sceneStatus,
    s.scenePicStatus, s.shotSplitStatus, s.videoMergeStatus
  ]
  if (statuses.some(st => st === 'RUNNING')) return 'processing'
  return 'pending'
}

function EpisodeCard({ episode, projectId }: { episode: OuoEpisode; projectId: string }) {
  const navigate = useNavigate()
  const status = getEpisodeDisplayStatus(episode)
  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing'
  
  return (
    <div className="group relative">
      <div 
        onClick={() => navigate(`/project/${projectId}/episode/${episode.episodeId}`)}
        className={`
          relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer
          ${isCompleted ? "ring-2 ring-white/20" : "bg-[#2a2a2a]"}
          transition-all duration-300 hover:scale-[1.02] hover:ring-2 hover:ring-white/30
        `}
      >
        {isCompleted && episode.cover ? (
          <>
            <img 
              src={episode.cover} 
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-emerald-500 text-white text-xs font-medium">
              完成
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              {episode.cover ? (
                <img src={episode.cover} alt={episode.title} className="w-full h-full object-cover opacity-40" />
              ) : (
                <span className="text-4xl font-bold text-white/10 select-none">OUO</span>
              )}
            </div>
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
              </div>
            )}
          </>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            size="sm" 
            className="bg-white text-black hover:bg-white/90 font-medium"
          >
            {isCompleted ? "查看" : "制作"}
          </Button>
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <h3 className="text-white font-medium text-center">{episode.title}</h3>
        {isProcessing && (
          <div className="mt-1 text-xs text-center text-amber-400">生成中...</div>
        )}
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const taskId = Number(id)
  const [taskDetail, setTaskDetail] = useState<OuoTaskDetail | null>(null)
  const [episodes, setEpisodes] = useState<OuoEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    if (!taskId) return
    try {
      const [detail, eps] = await Promise.all([
        ouoApi.getTaskDetail(taskId),
        ouoApi.getTaskEpisodes(taskId),
      ])
      setTaskDetail(detail)
      setEpisodes(eps)
    } catch {
      // errors handled by ouoClient
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!taskId) return
    const pollStatus = async () => {
      try {
        const status = await ouoApi.getTaskStatus(taskId)
        if (status.splitStatus === 'SUCCESS' || status.splitStatus === 'FAILED') {
          if (pollRef.current) clearInterval(pollRef.current)
          fetchData()
        }
      } catch {
        // ignore polling errors
      }
    }
    pollRef.current = setInterval(pollStatus, 5000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [taskId, fetchData])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <TopNav
        projectName={taskDetail?.title || '项目详情'}
        aspectRatio={taskDetail?.aspectRatio || ''}
      />
      
      <main className="pt-20 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.episodeId} episode={episode} projectId={String(taskId)} />
            ))}
          </div>
          {episodes.length === 0 && !loading && (
            <div className="text-center text-white/40 mt-20">
              <p className="text-lg">剧集正在生成中，请稍候...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
