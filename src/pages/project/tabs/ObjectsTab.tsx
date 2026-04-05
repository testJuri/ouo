import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Wand2, Workflow } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

import { useProjectStore } from "@/stores/projectStore"
import type { ObjectItem, ObjectType } from "@/types"

interface ObjectsTabProps {
  objects?: ObjectItem[]
  onAddNew?: () => void
  onOpenCanvas?: () => void
  batchMode?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
}

const typeColors: Record<ObjectType, string> = {
  "武器": "bg-red-500",
  "道具": "bg-blue-500",
  "服装": "bg-purple-500",
  "场景装饰": "bg-emerald-500",
  "AI生成": "bg-orange-500",
  "上传": "bg-cyan-500",
}

export default function ObjectsTab({
  objects: objectsProp,
  onAddNew,
  onOpenCanvas,
  batchMode = false,
  selectedIds = [],
  onToggleSelect,
}: ObjectsTabProps) {
  const objects = useProjectStore((state) => objectsProp ?? state.assets.objects)
  const { openDrawer } = useProjectStore()
  const { notify } = useFeedback()

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer('object')
    }
  }

  const handleOpenCanvas = () => {
    if (onOpenCanvas) {
      onOpenCanvas()
      return
    }

    notify.info("无限画布创作模式正在接入物品工作流")
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 gap-4">
      {/* Add New Object Card */}
      <div
        className="aspect-square rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))] bg-[linear-gradient(180deg,hsl(var(--surface-container))_0%,hsl(var(--surface-container-low))_100%)] p-3 transition-all hover:border-[hsl(var(--primary))]/35 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/5"
      >
        <div className="mb-3">
          <h3 className="text-sm font-bold text-[hsl(var(--on-surface))]">添加物品</h3>
          <p className="mt-1 text-[10px] text-[hsl(var(--secondary))]">
            选择创作方式
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAddNew}
            className="flex w-full items-center justify-between rounded-xl bg-[hsl(var(--surface-container-high))] px-3 py-2.5 text-left transition-all hover:bg-[hsl(var(--surface-container-highest))]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]">
                <Wand2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[hsl(var(--on-surface))]">快捷创作</div>
                <div className="text-[10px] text-[hsl(var(--secondary))]">快速建物品</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[hsl(var(--secondary))]" />
          </button>

          <button
            type="button"
            onClick={handleOpenCanvas}
            className="flex w-full items-center justify-between rounded-xl border border-[hsl(var(--outline-variant))]/60 bg-[hsl(var(--surface))]/75 px-3 py-2.5 text-left transition-all hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface-container-lowest))]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))]">
                <Workflow className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[hsl(var(--on-surface))]">无限画布</div>
                <div className="text-[10px] text-[hsl(var(--secondary))]">自由编排</div>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[hsl(var(--secondary))]" />
          </button>
        </div>
      </div>

      {/* Object Cards */}
      {objects.map((object) => (
        <div 
          key={object.id}
          onClick={batchMode ? () => onToggleSelect?.(object.id) : undefined}
          className={`group relative rounded-xl overflow-hidden bg-[hsl(var(--surface-container-lowest))] transition-all hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 hover:-translate-y-1 ${batchMode ? "cursor-pointer ring-2 ring-transparent" : ""} ${selectedIds.includes(object.id) ? "ring-[hsl(var(--primary))]" : ""}`}
        >
          <div className="aspect-square w-full relative overflow-hidden">
            <img 
              src={object.image} 
              alt={object.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-1">
              <Badge 
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border-0 ${typeColors[object.type]} text-white`}
              >
                {object.type}
              </Badge>
              {object.status === "in-use" && (
                <Badge className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border-0 bg-[hsl(var(--primary))] text-white">
                  使用中
                </Badge>
              )}
            </div>
            {batchMode && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleSelect?.(object.id)
                }}
                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border ${selectedIds.includes(object.id) ? "border-transparent bg-[hsl(var(--primary))] text-white" : "border-white/60 bg-black/30 text-transparent"}`}
              >
                <Check className="h-4 w-4" />
              </button>
            )}

          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] mb-1 truncate">{object.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[hsl(var(--secondary))] truncate max-w-[60%]">{object.scene}</span>
              <span className="text-[9px] text-[hsl(var(--secondary))]">{object.modified}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
