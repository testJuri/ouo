import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { 
  Plus,
  X,
  CheckCircle2,
  HelpCircle,
  Clock,
  LayoutList,
  RefreshCw
} from "lucide-react"
import { useState, useRef } from "react"

export interface SceneCreateData {
  name: string
  genMethod: string
  model: string
  description: string
  distance: number
  zoom: number
  status: "draft" | "in-use"
}

interface SceneCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: SceneCreateData) => void
}

const styleModels = [
  { id: "classic", name: "经典少年", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=300&h=200&fit=crop" },
  { id: "cyber", name: "赛博霓虹", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop" },
  { id: "ink", name: "水墨意境", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop" },
]

const generationTasks = [
  { id: 1, name: "午夜东京小巷 #4", status: "processing", progress: 45, message: "渲染光照层..." },
  { id: 2, name: "赛博朋克屋顶景观", status: "completed", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=60&fit=crop" },
  { id: 3, name: "古寺庭院", status: "queued", waitTime: "2 分钟" },
  { id: 4, name: "学校走廊黄昏", status: "queued", waitTime: "等待资源..." }
]

const shotTypes = [
  { id: "close", label: "特写", zoom: "1.8x" },
  { id: "medium", label: "中景", zoom: "1.0x" },
  { id: "wide", label: "远景", zoom: "0.6x" },
]

export default function SceneCreator({ open, onOpenChange, onCreate }: SceneCreatorProps) {
  const [selectedModel, setSelectedModel] = useState("classic")
  const [genMethod, setGenMethod] = useState("custom")
  const [seedType, setSeedType] = useState("fixed")
  const [distance, setDistance] = useState([8.0])
  const [horizontal] = useState(0)
  const [vertical] = useState(31)
  const [zoom, setZoom] = useState(0.6)
  const [sceneName, setSceneName] = useState("")
  const [description, setDescription] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generationMethods = [
    { id: "model", label: "通过模型生成场景" },
    { id: "upload", label: "自己上传图片" },
    { id: "angle", label: "机位转换器" },
    { id: "custom", label: "自定义机位" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setReferenceImage(url)
    }
  }

  const handleSubmit = () => {
    if (!sceneName.trim()) {
      alert("请输入场景名称")
      return
    }
    
    const newScene: SceneCreateData = {
      name: sceneName,
      genMethod,
      model: selectedModel,
      description,
      distance: distance[0],
      zoom,
      status: "draft"
    }
    
    onCreate?.(newScene)
    
    // Reset form
    setSceneName("")
    setDescription("")
    setReferenceImage(null)
    setSelectedModel("classic")
    setGenMethod("custom")
    setDistance([8.0])
    setZoom(0.6)
    
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
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">创建场景</h2>
          </div>
          <Badge className="signature-gradient text-white border-0 px-4 py-1.5">
            场景生成任务列表
          </Badge>
        </div>

        <div className="flex h-[calc(100vh-70px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 flex flex-col h-full overflow-y-auto p-6 space-y-6 pb-24">
            {/* Scene Name */}
            <div className="space-y-2">
              <Input 
                placeholder="请输入场景名称"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12 text-lg"
              />
            </div>

            {/* Generation Method */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-1">
                <span className="text-red-500">*</span> 生成方式
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

            {/* Reference Image & Camera Control */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <span className="text-red-500">*</span> 场景参考图
                  <HelpCircle className="w-4 h-4 text-[hsl(var(--secondary))]" />
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group overflow-hidden relative"
                >
                  {referenceImage ? (
                    <img src={referenceImage} alt="参考图" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))]" />
                      <span className="text-sm text-[hsl(var(--secondary))]">新增</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">镜头控制</label>
                <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-4 space-y-3">
                  <div className={`p-3 rounded-lg border-l-4 ${horizontal < 0 ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10' : 'border-transparent bg-[hsl(var(--surface-container-high))]'}`}>
                    <div className="text-xs text-[hsl(var(--secondary))] uppercase">Horizontal</div>
                    <div className="font-bold">左前</div>
                    <div className="text-xs text-[hsl(var(--secondary))]">(front-left)</div>
                  </div>
                  <div className="p-3 rounded-lg border-l-4 border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))]/10">
                    <div className="text-xs text-[hsl(var(--secondary))] uppercase">Vertical {vertical}°</div>
                    <div className="font-bold">微俯</div>
                  </div>
                  <div className="p-3 rounded-lg border-l-4 border-[hsl(var(--outline))] bg-[hsl(var(--outline))]/10">
                    <div className="text-xs text-[hsl(var(--secondary))] uppercase">Zoom {zoom}</div>
                    <div className="font-bold">远景</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Style Model */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--secondary))]">风格模型</label>
              <div className="grid grid-cols-3 gap-3">
                {styleModels.map((model) => (
                  <div 
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`relative cursor-pointer border-2 rounded-xl overflow-hidden aspect-[4/3] transition-all ${
                      selectedModel === model.id ? "border-[hsl(var(--primary))]" : "border-transparent hover:border-[hsl(var(--outline-variant))]"
                    }`}
                  >
                    <img className="w-full h-full object-cover" src={model.image} alt={model.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white">{model.name}</span>
                    </div>
                    {selectedModel === model.id && (
                      <div className="absolute top-1 right-1 bg-[hsl(var(--primary))] rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">补充描述（可选）</label>
              <Textarea 
                placeholder="描述镜头背后的世界..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl resize-none"
              />
            </div>

            {/* Seed Control */}
            <div className="space-y-3">
              <label className="text-sm font-medium">种子控制</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSeedType("random")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    seedType === "random" ? "bg-[hsl(var(--surface-container-high))]" : "bg-transparent text-[hsl(var(--secondary))]"
                  }`}
                >
                  随机种子
                </button>
                <button
                  onClick={() => setSeedType("fixed")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    seedType === "fixed" ? "signature-gradient text-white" : "bg-transparent text-[hsl(var(--secondary))]"
                  }`}
                >
                  固定种子
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 bg-[hsl(var(--surface-container-low))] flex flex-col h-full">
            {/* 3D Preview */}
            <div className="flex-1 relative bg-[hsl(var(--surface-container-high))] p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 200 200">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--outline-variant))" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#grid)" />
                    <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.6" transform="rotate(-15 100 100)"/>
                    <ellipse cx="100" cy="100" rx="60" ry="60" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" strokeOpacity="0.6"/>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-[hsl(var(--primary))] rounded-full" />
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 w-10 h-10 bg-[hsl(var(--surface))]/80 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Shot Types */}
            <div className="p-4 border-t border-[hsl(var(--outline-variant))]/20 space-y-4">
              <div className="flex gap-2">
                {shotTypes.map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => setZoom(parseFloat(shot.zoom))}
                    className={`flex-1 py-3 px-2 rounded-xl text-center transition-all ${
                      Math.abs(zoom - parseFloat(shot.zoom)) < 0.1 ? "signature-gradient text-white" : "bg-[hsl(var(--surface-container-high))]"
                    }`}
                  >
                    <div className="text-sm">{shot.label}</div>
                    <div className="text-xs opacity-60">{shot.zoom}</div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">Distance</span>
                <Slider value={distance} onValueChange={setDistance} max={20} min={1} step={0.1} className="flex-1" />
                <span className="text-sm font-mono text-[hsl(var(--primary))]">{distance[0].toFixed(1)}</span>
              </div>
            </div>

            {/* Task List */}
            <div className="h-40 overflow-y-auto p-4 border-t border-[hsl(var(--outline-variant))]/20">
              <div className="flex items-center gap-2 mb-3">
                <LayoutList className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-bold">生成任务</span>
              </div>
              {generationTasks.slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--surface-container-high))]/50 mb-2">
                  {task.status === "processing" && <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />}
                  {task.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  <span className="text-sm flex-1 truncate">{task.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent">
          <Button 
            onClick={handleSubmit}
            className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg border-0"
          >
            提交任务（消耗2积分）
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
