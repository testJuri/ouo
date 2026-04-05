import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { X, ChevronDown, ImagePlus, CheckCircle2, Clock, LayoutList } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

export interface ObjectCreateData {
  name: string
  type: "weapon" | "prop" | "clothing" | "decoration"
  genMethod: string
  scene?: string
  description: string
  referenceImage?: string
}

interface ObjectCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: ObjectCreateData) => void
}

const objectTypes = [
  { value: "weapon", label: "武器" },
  { value: "prop", label: "道具" },
  { value: "clothing", label: "服装" },
  { value: "decoration", label: "场景装饰" },
]

const scenes = [
  { value: "", label: "不关联场景" },
  { value: "scene1", label: "赛博街区 7 号扇区" },
  { value: "scene2", label: "黄昏教室 2B" },
  { value: "scene3", label: "薄雾寺院庭院" },
  { value: "scene4", label: "观测甲板欧米茄" },
  { value: "scene5", label: "低语森林" },
]

const generationTasks = [
  { id: 1, name: "光子武士刀", status: "processing", progress: 65, message: "渲染材质..." },
  { id: 2, name: "古董怀表", status: "completed", thumbnail: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=100&h=100&fit=crop" },
  { id: 3, name: "魔法卷轴", status: "queued", waitTime: "1 分钟" },
]

export default function ObjectCreator({ open, onOpenChange, onCreate }: ObjectCreatorProps) {
  const { notify } = useFeedback()
  const [genMethod, setGenMethod] = useState("model")
  const [objectType, setObjectType] = useState("")
  const [scene, setScene] = useState("")
  const [objectName, setObjectName] = useState("")
  const [description, setDescription] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generationMethods = [
    { id: "model", label: "通过模型生成" },
    { id: "upload", label: "自己上传图片" },
    { id: "text", label: "文字描述生成" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setReferenceImage(url)
    }
  }

  const handleSubmit = () => {
    if (!objectName.trim()) {
      notify.warning("请输入物品名称")
      return
    }
    if (!objectType) {
      notify.warning("请选择物品类型")
      return
    }
    
    const newObject: ObjectCreateData = {
      name: objectName,
      type: objectType as "weapon" | "prop" | "clothing" | "decoration",
      genMethod,
      scene: scenes.find(s => s.value === scene)?.label,
      description,
      referenceImage: referenceImage || undefined,
    }
    
    onCreate?.(newObject)
    
    // Reset form
    setObjectName("")
    setObjectType("")
    setScene("")
    setDescription("")
    setReferenceImage(null)
    setGenMethod("model")
    
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[900px] sm:max-w-[900px] p-0 overflow-hidden bg-[hsl(var(--surface))]" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface))]">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">创建物品</h2>
          </div>
          <Badge className="signature-gradient text-white border-0 px-4 py-1.5">
            物品生成任务列表
          </Badge>
        </div>

        <div className="flex h-[calc(100vh-70px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 flex flex-col h-full overflow-y-auto p-6 space-y-6 pb-24">
            {/* Object Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>物品名称
              </label>
              <Input
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                placeholder="例如：光子武士刀"
                className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
              />
            </div>

            {/* Object Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>物品类型
              </label>
              <div className="flex flex-wrap gap-2">
                {objectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setObjectType(type.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      objectType === type.value
                        ? "signature-gradient text-white"
                        : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-highest))]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scene Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                关联场景
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-between rounded-xl bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container-high))] text-sm font-normal px-3"
                  >
                    <span className={scene ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--secondary))]"}>
                      {scene ? scenes.find(s => s.value === scene)?.label : "选择关联场景（可选）"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[hsl(var(--secondary))]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  {scenes.map((s) => (
                    <DropdownMenuItem key={s.value} onClick={() => setScene(s.value)}>
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Generation Method */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>生成方式
              </label>
              <div className="flex flex-wrap gap-2">
                {generationMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setGenMethod(method.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      genMethod === method.id
                        ? "signature-gradient text-white"
                        : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-highest))]"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">参考图</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group overflow-hidden relative"
              >
                {referenceImage ? (
                  <img src={referenceImage} alt="参考图" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))] transition-colors" />
                    <span className="text-sm text-[hsl(var(--on-surface))]">上传参考图</span>
                    <span className="text-xs text-[hsl(var(--secondary))]">支持 JPG / PNG 格式</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                描述
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述物品的材质、颜色、用途等细节..."
                rows={4}
                className="rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] resize-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
              />
            </div>
          </div>

          {/* Right Panel - Preview & Tasks */}
          <div className="w-1/2 bg-[hsl(var(--surface-container-low))] flex flex-col h-full">
            {/* 3D Preview Placeholder */}
            <div className="flex-1 relative bg-[hsl(var(--surface-container-high))] p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 200 200">
                    <defs>
                      <pattern id="objectGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--outline-variant))" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#objectGrid)" />
                    {/* 3D Cube wireframe */}
                    <path d="M60,60 L140,60 L140,140 L60,140 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.6"/>
                    <path d="M80,40 L160,40 L160,120 L80,120 Z" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" strokeOpacity="0.4"/>
                    <line x1="60" y1="60" x2="80" y2="40" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.4"/>
                    <line x1="140" y1="60" x2="160" y2="40" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.4"/>
                    <line x1="140" y1="140" x2="160" y2="120" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.4"/>
                    <line x1="60" y1="140" x2="80" y2="120" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.4"/>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-[hsl(var(--primary))] rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-[hsl(var(--surface))]/80 text-[10px]">
                  3D 预览（占位）
                </Badge>
              </div>
            </div>

            {/* Generation Settings */}
            <div className="p-4 border-t border-[hsl(var(--outline-variant))]/20 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[hsl(var(--surface-container-high))] space-y-1">
                  <span className="text-xs text-[hsl(var(--secondary))]">材质细节</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">高</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[hsl(var(--surface-container-high))] space-y-1">
                  <span className="text-xs text-[hsl(var(--secondary))]">光照质量</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">PBR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="h-40 overflow-y-auto p-4 border-t border-[hsl(var(--outline-variant))]/20">
              <div className="flex items-center gap-2 mb-3">
                <LayoutList className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-bold">生成任务</span>
              </div>
              {generationTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--surface-container-high))]/50 mb-2">
                  {task.status === "processing" && <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />}
                  {task.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {task.status === "queued" && <div className="w-4 h-4 rounded-full border-2 border-[hsl(var(--secondary))]" />}
                  <span className="text-sm flex-1 truncate">{task.name}</span>
                  {task.status === "processing" && (
                    <span className="text-xs text-[hsl(var(--primary))]">{task.progress}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg border-0 hover:opacity-90 transition-opacity"
          >
            提交任务（消耗1积分）
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
