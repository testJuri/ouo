import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Trash2, Copy, Eye } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Scene {
  id: number
  name: string
  image: string
  status: "in-use" | "draft"
  modified: string
  code: string
  genMethod?: string
  model?: string
  description?: string
}

interface ScenesTabProps {
  onAddNew: () => void
  scenes?: Scene[]
  onScenesChange?: (scenes: Scene[]) => void
}

const initialScenes: Scene[] = [
  {
    id: 1,
    name: "赛博街区 7 号扇区",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "2 小时前",
    code: "BG_042"
  },
  {
    id: 2,
    name: "黄昏教室 2B",
    image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=450&fit=crop",
    status: "draft",
    modified: "1 天前",
    code: "INT_011"
  },
  {
    id: 3,
    name: "薄雾寺院庭院",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "3 小时前",
    code: "EXT_088"
  },
  {
    id: 4,
    name: "观测甲板欧米茄",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=450&fit=crop",
    status: "draft",
    modified: "5 天前",
    code: "SCI_003"
  },
  {
    id: 5,
    name: "低语森林",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "12 小时前",
    code: "FNT_072"
  }
]

export default function ScenesTab({ onAddNew, scenes: externalScenes, onScenesChange }: ScenesTabProps) {
  const [internalScenes, setInternalScenes] = useState<Scene[]>(initialScenes)
  
  const scenes = externalScenes ?? internalScenes
  const setScenes = onScenesChange ?? setInternalScenes

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个场景吗？")) {
      setScenes(scenes.filter(s => s.id !== id))
    }
  }

  const handleDuplicate = (scene: Scene) => {
    const newScene: Scene = {
      ...scene,
      id: Math.max(...scenes.map(s => s.id), 0) + 1,
      name: `${scene.name} (复制)`,
      code: `${scene.code}_COPY`,
      modified: "刚刚"
    }
    setScenes([newScene, ...scenes])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Add New Scene Card */}
      <div 
        onClick={onAddNew}
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
          className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-1"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
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
                    <DropdownMenuItem onClick={() => alert(`查看详情: ${scene.name}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      查看详情
                    </DropdownMenuItem>
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
