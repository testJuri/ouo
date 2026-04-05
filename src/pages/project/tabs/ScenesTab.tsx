import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { useProjectStore } from "@/stores/projectStore"
import type { Scene } from "@/types"

interface ScenesTabProps {
  scenes?: Scene[]
  onAddNew?: () => void
  batchMode?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
}

export default function ScenesTab({ scenes: scenesProp, onAddNew, batchMode = false, selectedIds = [], onToggleSelect }: ScenesTabProps) {
  const scenes = useProjectStore((state) => scenesProp ?? state.assets.scenes)
  const { deleteScene, duplicateScene, openDrawer } = useProjectStore()
  const { confirm, notify } = useFeedback()

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "删除场景",
      description: "删除后将无法恢复这个场景及其当前信息。",
      confirmText: "删除",
      tone: "danger",
    })

    if (confirmed) {
      deleteScene(id)
      notify.success("场景已删除")
    }
  }

  const handleDuplicate = (scene: Scene) => {
    duplicateScene(scene.id)
  }

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer('scene')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {/* Add New Scene Card */}
      <div 
        onClick={handleAddNew}
        className="aspect-[4/3] bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-xl hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-[hsl(var(--primary))]" />
        </div>
        <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">添加新场景</span>
        <span className="text-[10px] text-[hsl(var(--secondary))] mt-1 uppercase tracking-tighter">初始化资源画布</span>
      </div>

      {/* Scene Cards */}
      {scenes.map((scene) => (
        <div 
          key={scene.id}
          onClick={batchMode ? () => onToggleSelect?.(scene.id) : undefined}
          className={`group relative rounded-xl overflow-hidden bg-[hsl(var(--surface-container-lowest))] transition-all hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 hover:-translate-y-1 ${batchMode ? "cursor-pointer ring-2 ring-transparent" : ""} ${selectedIds.includes(scene.id) ? "ring-[hsl(var(--primary))]" : ""}`}
        >
          <div className="aspect-[4/3] w-full relative overflow-hidden">
            <img 
              src={scene.image} 
              alt={scene.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge 
                className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border-0 ${
                  scene.status === "in-use" 
                    ? "bg-[hsl(var(--primary))] text-white" 
                    : "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-secondary-fixed-variant))]"
                }`}
              >
                {scene.status === "in-use" ? "使用中" : "草稿"}
              </Badge>
            </div>
            {batchMode && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleSelect?.(scene.id)
                }}
                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border ${selectedIds.includes(scene.id) ? "border-transparent bg-[hsl(var(--primary))] text-white" : "border-white/60 bg-black/30 text-transparent"}`}
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/60 to-transparent transition-opacity flex items-end p-4 ${batchMode ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"}`}>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                >
                  {scene.status === "in-use" ? "编辑详情" : "继续工作"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary"
                      size="icon"
                      className="w-10 bg-white/20 backdrop-blur-md text-white py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleDuplicate(scene)}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(scene.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-extrabold text-[hsl(var(--on-surface))] mb-1">{scene.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[hsl(var(--secondary))] font-medium">修改于 {scene.modified}</span>
              <Badge variant="secondary" className="text-[10px] bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))] px-2 py-0.5 rounded-full font-bold border-0">
                {scene.code}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
