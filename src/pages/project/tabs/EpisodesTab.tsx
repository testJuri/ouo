import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Play, Check } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useProjectStore } from "@/stores/projectStore"
import type { Episode } from "@/types"

interface EpisodesTabProps {
  episodes?: Episode[]
  onAddNew?: () => void
  batchMode?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
}

export default function EpisodesTab({
  episodes: episodesProp,
  onAddNew,
  batchMode = false,
  selectedIds = [],
  onToggleSelect,
}: EpisodesTabProps) {
  const navigate = useNavigate()
  const { id: projectId } = useParams()
  const episodes = useProjectStore((state) => episodesProp ?? state.assets.episodes)
  const { openDrawer } = useProjectStore()

  const handleEpisodeClick = (episodeId: number) => {
    if (batchMode) {
      onToggleSelect?.(episodeId)
      return
    }
    navigate(`/project/${projectId}/episode/${episodeId}`)
  }

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer("episode")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      <div
        onClick={handleAddNew}
        className="aspect-[4/3] bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-xl hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-[hsl(var(--primary))]" />
        </div>
        <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">添加新片段</span>
        <span className="text-[10px] text-[hsl(var(--secondary))] mt-1 uppercase tracking-tighter">组织故事章节</span>
      </div>

      {episodes.map((episode) => (
        <div
          key={episode.id}
          onClick={() => handleEpisodeClick(episode.id)}
          className={`group relative rounded-xl overflow-hidden bg-[hsl(var(--surface-container-lowest))] transition-all hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 hover:-translate-y-1 ${batchMode ? "cursor-pointer ring-2 ring-transparent" : ""} ${selectedIds.includes(episode.id) ? "ring-[hsl(var(--primary))]" : ""}`}
        >
          <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-br from-[hsl(var(--surface-container-high))] to-[hsl(var(--surface-container))] flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-[hsl(var(--primary))]" />
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge
                className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border-0 ${
                  episode.status === "completed"
                    ? "bg-emerald-500 text-white"
                    : episode.status === "in-progress"
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-secondary-fixed-variant))]"
                }`}
              >
                {episode.status === "completed" ? "已完成" : episode.status === "in-progress" ? "进行中" : "草稿"}
              </Badge>
            </div>
            {batchMode && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleSelect?.(episode.id)
                }}
                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border ${selectedIds.includes(episode.id) ? "border-transparent bg-[hsl(var(--primary))] text-white" : "border-white/60 bg-black/30 text-transparent"}`}
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/60 to-transparent transition-opacity flex items-end p-4 ${batchMode ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"}`}>
              <div className="flex gap-2 w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEpisodeClick(episode.id)}
                  className="flex-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                >
                  {episode.status === "draft" ? "继续编辑" : "查看详情"}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-10 bg-white/20 backdrop-blur-md text-white py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-extrabold text-[hsl(var(--on-surface))] mb-1">{episode.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[hsl(var(--secondary))] font-medium">{episode.count} 个场景 · 修改于 {episode.modified}</span>
              <Badge variant="secondary" className="text-[10px] bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))] px-2 py-0.5 rounded-full font-bold border-0">
                {episode.code}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
