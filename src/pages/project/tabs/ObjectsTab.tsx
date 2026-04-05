import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Eye, Link } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { useProjectStore } from "@/stores/projectStore"
import type { ObjectItem, ObjectType } from "@/types"

interface ObjectsTabProps {
  onAddNew?: () => void
}

const typeColors: Record<ObjectType, string> = {
  "武器": "bg-red-500",
  "道具": "bg-blue-500",
  "服装": "bg-purple-500",
  "场景装饰": "bg-emerald-500",
}

export default function ObjectsTab({ onAddNew }: ObjectsTabProps) {
  const objects = useProjectStore((state) => state.assets.objects)
  const { deleteObject, duplicateObject, openDrawer } = useProjectStore()
  const { confirm, notify } = useFeedback()

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "删除物品",
      description: "删除后将无法恢复这个物品资料。",
      confirmText: "删除",
      tone: "danger",
    })

    if (confirmed) {
      deleteObject(id)
      notify.success("物品已删除")
    }
  }

  const handleDuplicate = (object: ObjectItem) => {
    duplicateObject(object.id)
  }

  const handleLinkScene = (object: ObjectItem) => {
    notify.info(`关联场景：${object.name}（场景选择功能开发中）`)
  }

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      openDrawer('object')
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-1"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="flex gap-2 w-full">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleLinkScene(object)}
                  className="flex-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                >
                  <Link className="w-3 h-3 mr-1" />
                  关联场景
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary"
                      size="icon"
                      className="w-9 bg-white/20 backdrop-blur-md text-white py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => notify.info(`查看详情：${object.name}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(object)}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(object.id)}
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
