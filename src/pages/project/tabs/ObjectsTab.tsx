import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Eye, Link } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ObjectItem {
  id: number
  name: string
  image: string
  type: "武器" | "道具" | "服装" | "场景装饰"
  status: "in-use" | "draft"
  scene: string
  modified: string
  description?: string
}

interface ObjectsTabProps {
  onAddNew: () => void
  objects?: ObjectItem[]
  onObjectsChange?: (objects: ObjectItem[]) => void
}

const initialObjects: ObjectItem[] = [
  {
    id: 1,
    name: "光子武士刀",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop",
    type: "武器",
    status: "in-use",
    scene: "赛博街区 7 号扇区",
    modified: "2 小时前"
  },
  {
    id: 2,
    name: "古董怀表",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=300&h=300&fit=crop",
    type: "道具",
    status: "draft",
    scene: "黄昏教室 2B",
    modified: "1 天前"
  },
  {
    id: 3,
    name: "魔法卷轴",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop",
    type: "道具",
    status: "in-use",
    scene: "薄雾寺院庭院",
    modified: "3 小时前"
  },
  {
    id: 4,
    name: "战术背包",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    type: "服装",
    status: "draft",
    scene: "观测甲板欧米茄",
    modified: "5 天前"
  },
  {
    id: 5,
    name: "霓虹灯笼",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=300&fit=crop",
    type: "场景装饰",
    status: "in-use",
    scene: "赛博街区 7 号扇区",
    modified: "1 小时前"
  },
  {
    id: 6,
    name: "能量手枪",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop",
    type: "武器",
    status: "draft",
    scene: "未关联场景",
    modified: "2 天前"
  },
  {
    id: 7,
    name: "和服",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=300&h=300&fit=crop",
    type: "服装",
    status: "in-use",
    scene: "薄雾寺院庭院",
    modified: "4 小时前"
  },
  {
    id: 8,
    name: "古籍",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=300&fit=crop",
    type: "道具",
    status: "draft",
    scene: "黄昏教室 2B",
    modified: "1 周前"
  }
]

const typeColors: Record<string, string> = {
  "武器": "bg-red-500",
  "道具": "bg-blue-500",
  "服装": "bg-purple-500",
  "场景装饰": "bg-emerald-500",
}

export default function ObjectsTab({ onAddNew, objects: externalObjects, onObjectsChange }: ObjectsTabProps) {
  const [internalObjects, setInternalObjects] = useState<ObjectItem[]>(initialObjects)
  
  const objects = externalObjects ?? internalObjects
  const setObjects = onObjectsChange ?? setInternalObjects

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个物品吗？")) {
      setObjects(objects.filter(o => o.id !== id))
    }
  }

  const handleDuplicate = (object: ObjectItem) => {
    const newObject: ObjectItem = {
      ...object,
      id: Math.max(...objects.map(o => o.id), 0) + 1,
      name: `${object.name} (复制)`,
      modified: "刚刚"
    }
    setObjects([newObject, ...objects])
  }

  const handleLinkScene = (object: ObjectItem) => {
    alert(`关联场景: ${object.name}\n（场景选择功能开发中）`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Add New Object Card */}
      <div
        onClick={onAddNew}
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
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border-0 ${typeColors[object.type] || "bg-gray-500"} text-white`}
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
                    <DropdownMenuItem onClick={() => alert(`查看详情: ${object.name}`)}>
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
