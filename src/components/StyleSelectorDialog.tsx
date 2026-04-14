import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// 风格数据类型
interface StyleOption {
  id: number
  name: string
  image: string
  category: "realistic" | "anime"
}

// 写实风格选项
const realisticStyles: StyleOption[] = [
  { id: 1, name: "真人", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", category: "realistic" },
  { id: 2, name: "古风", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop", category: "realistic" },
  { id: 3, name: "赛博朋克", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop", category: "realistic" },
  { id: 4, name: "悬疑暗黑", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop", category: "realistic" },
  { id: 5, name: "电影", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop", category: "realistic" },
  { id: 6, name: "复古", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop", category: "realistic" },
  { id: 7, name: "现代末日", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", category: "realistic" },
]

// 动漫风格选项
const animeStyles: StyleOption[] = [
  { id: 101, name: "日漫", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop", category: "anime" },
  { id: 102, name: "国漫", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400&h=600&fit=crop", category: "anime" },
  { id: 103, name: "Q版", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop", category: "anime" },
  { id: 104, name: "赛博朋克", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop", category: "anime" },
  { id: 105, name: "唯美", image: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?w=400&h=600&fit=crop", category: "anime" },
  { id: 106, name: "科幻", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=600&fit=crop", category: "anime" },
]

interface StyleSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect?: (style: StyleOption) => void
  selectedStyleId?: number
}

export function StyleSelectorDialog({
  open,
  onOpenChange,
  onSelect,
  selectedStyleId,
}: StyleSelectorDialogProps) {
  const [activeTab, setActiveTab] = useState<"realistic" | "anime">("realistic")
  const [localSelectedId, setLocalSelectedId] = useState<number | undefined>(selectedStyleId)

  const currentStyles = activeTab === "realistic" ? realisticStyles : animeStyles

  const handleSelect = (style: StyleOption) => {
    setLocalSelectedId(style.id)
    onSelect?.(style)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-hidden p-0 gap-0 bg-[#1a1a1a] border-white/10">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              风格选择
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="px-6 pb-4">
          <div className="inline-flex gap-2 p-1 rounded-xl bg-white/5">
            <button
              onClick={() => setActiveTab("realistic")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "realistic"
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              写实
            </button>
            <button
              onClick={() => setActiveTab("anime")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "anime"
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              动漫
            </button>
          </div>
        </div>

        {/* Style Grid */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {currentStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSelect(style)}
                className={cn(
                  "group relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-xl",
                  localSelectedId === style.id
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]"
                    : "ring-0"
                )}
              >
                {/* Image */}
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-white text-sm font-medium">
                    {style.name}
                  </span>
                </div>

                {/* Selected Indicator */}
                {localSelectedId === style.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { StyleOption }
