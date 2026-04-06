import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  Plus,
  X,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  Upload
} from "lucide-react"
import { useState, useRef } from "react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

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

export default function SceneCreator({ open, onOpenChange, onCreate }: SceneCreatorProps) {
  const { notify } = useFeedback()
  const [selectedModel, setSelectedModel] = useState("classic")
  const [genMethod, setGenMethod] = useState("model")
  const [seedType, setSeedType] = useState("fixed")
  const [distance, setDistance] = useState([8.0])
  const [zoom, setZoom] = useState(0.6)
  const [sceneName, setSceneName] = useState("")
  const [description, setDescription] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [batchArchiveName, setBatchArchiveName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchFileInputRef = useRef<HTMLInputElement>(null)

  const generationMethods = [
    { id: "model", label: "通过模型生成场景" },
    { id: "upload", label: "自己上传图片" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setReferenceImage(url)
      setBatchArchiveName("")
    }
  }

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBatchArchiveName(file.name)
      setReferenceImage(null)
    }
  }

  const handleSubmit = () => {
    if (!sceneName.trim()) {
      notify.warning("请输入场景名称")
      return
    }

    if (genMethod === "upload" && !referenceImage && !batchArchiveName) {
      notify.warning("请先上传场景图或批量压缩包")
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
    setBatchArchiveName("")
    setSelectedModel("classic")
    setGenMethod("model")
    setDistance([8.0])
    setZoom(0.6)
    
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[900px] sm:max-w-[900px] p-0 overflow-hidden bg-[hsl(var(--surface))]" style={{ maxWidth: '900px' }} hideCloseButton>
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
          <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto p-6 pb-24">
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
              <div className="flex flex-wrap gap-2 rounded-2xl bg-[hsl(var(--surface-container-low))] p-1.5">
                {generationMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setGenMethod(method.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      genMethod === method.id
                        ? "signature-gradient text-white shadow-sm"
                        : "text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-high))]"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {genMethod === "upload" ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={batchFileInputRef}
                  onChange={handleBatchUpload}
                  accept=".zip,application/zip"
                  className="hidden"
                />
                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[hsl(var(--on-surface))]">上传已有场景图</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))] transition-colors hover:bg-[hsl(var(--surface-container-high))] group relative"
                    >
                      {referenceImage ? (
                        <>
                          <img src={referenceImage} alt="上传已有场景图" className="absolute inset-0 h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="rounded-full bg-black/60 px-4 py-2 text-sm text-white">重新上传</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-4 text-center">
                          <ImagePlus className="h-14 w-14 text-[hsl(var(--on-surface))]" />
                          <div className="space-y-1">
                            <p className="text-xl font-medium text-[hsl(var(--on-surface))]">上传已有场景图</p>
                            <p className="text-sm text-[hsl(var(--secondary))]">支持 JPG / JPEG / PNG 格式</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[hsl(var(--on-surface))]">批量上传已有场景图</label>
                    <div
                      onClick={() => batchFileInputRef.current?.click()}
                      className="min-h-[260px] cursor-pointer rounded-2xl border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))] p-6 transition-colors hover:bg-[hsl(var(--surface-container-high))]"
                    >
                      <div className="flex h-full min-h-[212px] flex-col items-center justify-center gap-4 text-center">
                        <Upload className="h-14 w-14 text-[hsl(var(--on-surface))]" />
                        <div className="space-y-1">
                          <p className="text-xl font-medium text-[hsl(var(--on-surface))]">批量上传已有场景图</p>
                          <p className="text-sm text-[hsl(var(--secondary))]">支持上传 zip 格式的压缩包</p>
                        </div>
                        {batchArchiveName ? (
                          <p className="max-w-full truncate rounded-full bg-[hsl(var(--surface-container-high))] px-3 py-1 text-xs text-[hsl(var(--on-surface))]">
                            {batchArchiveName}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
            <>
            {/* Reference Image */}
            <div className="space-y-2">
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
                  className="relative flex h-60 w-full max-w-[320px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 bg-[hsl(var(--surface-container-low))] transition-colors hover:bg-[hsl(var(--surface-container-high))] group"
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
            </>
            )}

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
