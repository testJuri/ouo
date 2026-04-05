import { Badge } from "@/components/ui/badge"
import { Plus, Check } from "lucide-react"

import { useProjectStore } from "@/stores/projectStore"
import type { ObjectItem, ObjectType } from "@/types"

interface ObjectsTabProps {
  objects?: ObjectItem[]
  onAddNew?: () => void
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

export default function ObjectsTab({ objects: objectsProp, onAddNew, batchMode = false, selectedIds = [], onToggleSelect }: ObjectsTabProps) {
  const objects = useProjectStore((state) => objectsProp ?? state.assets.objects)
  const { openDrawer } = useProjectStore()

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer('object')
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 gap-4">
      {/* Add New Object Card */}
      <div
        onClick={handleAddNew}
        className="aspect-square bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-xl hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-[hsl(var(--primary))]" />
        </div>
        <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">添加物品</span>
        <span className="text-[10px] text-[hsl(var(--secondary))] mt-1">武器 / 道具 / 装饰</span>
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
