import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, ImagePlus, Package, LayoutList, Check, ChevronDown, CheckCircle2, Clock } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

export interface ObjectCreateData {
  name: string
  genMethod: "model" | "upload"
  model?: string
  prompt?: string
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3"
  referenceImage?: string
  referenceImages?: string[]
}

const models = [
  { id: "jimeng-3", name: "即梦 3.0", desc: "中文语义强，适合概念物品" },
  { id: "keling-3", name: "可灵 3.0", desc: "质感稳定，适合商品表达" },
  { id: "mj-v7", name: "Midjourney V7", desc: "风格化强，适合创意设计" },
  { id: "sdxl", name: "SDXL", desc: "通用型底模，便于快速出图" },
]

interface ObjectCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: ObjectCreateData) => void
}

const objectGenerationTasks = [
  { id: 1, name: "光子武士刀", status: "processing", detail: "正在生成多角度预览", time: "刚刚" },
  { id: 2, name: "古董怀表", status: "completed", detail: "主图和透明底图已完成", time: "12 分钟前" },
  { id: 3, name: "战术背包", status: "queued", detail: "等待队列中，还需约 3 分钟", time: "18 分钟前" },
]

export default function ObjectCreator({ open, onOpenChange, onCreate }: ObjectCreatorProps) {
  const { notify } = useFeedback()
  const [genMethod, setGenMethod] = useState<"model" | "upload">("model")
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3">("1:1")
  const [selectedModel, setSelectedModel] = useState("sdxl")
  const [objectName, setObjectName] = useState("")
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [isReferenceDragOver, setIsReferenceDragOver] = useState(false)
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchFileInputRef = useRef<HTMLInputElement>(null)

  const appendReferenceImages = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length === 0) return

    const nextUrls = imageFiles.map((file) => URL.createObjectURL(file))
    setReferenceImages((current) => [...current, ...nextUrls])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBatch = false) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (isBatch) {
      notify.success(`已选择批量上传文件：${files[0].name}`)
    } else {
      appendReferenceImages(files)
    }

    e.target.value = ""
  }

  const handleReferenceDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsReferenceDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      appendReferenceImages(e.dataTransfer.files)
    }
  }

  const removeReferenceImage = (index: number) => {
    setReferenceImages((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleSubmit = () => {
    if (!objectName.trim()) {
      notify.warning("请输入物品名称")
      return
    }

    if (genMethod === "model" && !prompt.trim()) {
      notify.warning("请输入物品描述")
      return
    }
    
    const newObject: ObjectCreateData = {
      name: objectName,
      genMethod,
      model: genMethod === "model" ? selectedModel : undefined,
      prompt: genMethod === "model" ? prompt.trim() : undefined,
      aspectRatio: genMethod === "model" ? aspectRatio : undefined,
      referenceImage: referenceImages[0] || undefined,
      referenceImages: referenceImages.length ? referenceImages : undefined,
    }
    
    onCreate?.(newObject)
    
    // Reset form
    setObjectName("")
    setPrompt("")
    setAspectRatio("1:1")
    setReferenceImages([])
    setGenMethod("model")
    
    onOpenChange(false)
    notify.success(`物品 "${newObject.name}" 创建成功`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative h-full w-[600px] shrink-0">
        {taskDrawerOpen && (
          <div className="absolute inset-y-0 right-full h-full w-[360px] border-r border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface-container-lowest))] shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[hsl(var(--outline-variant))]/15 px-5 py-4">
                <div>
                  <h3 className="text-lg font-black text-[hsl(var(--on-surface))]">物品生成任务</h3>
                  <p className="mt-1 text-xs text-[hsl(var(--secondary))]">查看当前创建与上传任务进度</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTaskDrawerOpen(false)}
                  className="h-9 w-9 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {objectGenerationTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-2xl border p-4 ${
                        task.status === "completed"
                          ? "border-transparent bg-[hsl(var(--surface-container-low))]"
                          : task.status === "processing"
                          ? "border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/5"
                          : "border-transparent bg-[hsl(var(--surface-container-low))]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Clock className={`h-4 w-4 ${task.status === "processing" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--secondary))]"}`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-bold text-[hsl(var(--on-surface))]">{task.name}</p>
                            <span className="shrink-0 text-[10px] text-[hsl(var(--secondary))]">{task.time}</span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[hsl(var(--on-surface-variant))]">{task.detail}</p>
                          <div className="mt-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                task.status === "completed"
                                  ? "bg-emerald-500/12 text-emerald-600"
                                  : task.status === "processing"
                                  ? "bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]"
                                  : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--secondary))]"
                              }`}
                            >
                              {task.status === "completed" ? "已完成" : task.status === "processing" ? "进行中" : "排队中"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drawer */}
        <div className="relative h-full w-[600px] shrink-0 bg-[hsl(var(--surface))] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">新建物品</h2>
          </div>
          <Button 
            variant="ghost"
            onClick={() => setTaskDrawerOpen((current) => !current)}
            className="h-10 rounded-xl border border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container-low))] px-4 text-sm font-semibold text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container-high))]"
          >
            <LayoutList className="h-4 w-4" />
            物品生成任务列表
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Object Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>物品名称
            </label>
            <Input
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              placeholder="请输入"
              className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>

          {/* Generation Method */}
          <div>
            <label className="text-sm font-medium text-[hsl(var(--on-surface))] block mb-3">
              <span className="text-red-500 mr-1">*</span>生成方式
            </label>
            <div className="inline-flex bg-[hsl(var(--surface-container-high))] rounded-full p-0.5">
              <button
                onClick={() => setGenMethod("model")}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  genMethod === "model"
                    ? "signature-gradient text-white"
                    : "text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-lowest))]"
                }`}
              >
                通过模型生成物品
              </button>
              <button
                onClick={() => setGenMethod("upload")}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  genMethod === "upload"
                    ? "signature-gradient text-white"
                    : "text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-lowest))]"
                }`}
              >
                自己上传图片
              </button>
            </div>
          </div>

          {/* Upload Section - Only show when genMethod is "upload" */}
          {genMethod === "upload" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Single Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                    上传已有物品图
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e)}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/3] bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--surface-container-high))] transition-all cursor-pointer group overflow-hidden"
                  >
                    {referenceImages[0] ? (
                      <img src={referenceImages[0]} alt="参考图" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))] transition-colors" />
                        <span className="text-sm text-[hsl(var(--on-surface))]">上传已有物品图</span>
                        <span className="text-xs text-[hsl(var(--secondary))]">支持JPG / JPEG / PNG格式</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Batch Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                    批量上传已有物品图
                  </label>
                  <input
                    type="file"
                    ref={batchFileInputRef}
                    onChange={(e) => handleFileUpload(e, true)}
                    accept=".zip"
                    className="hidden"
                  />
                  <div 
                    onClick={() => batchFileInputRef.current?.click()}
                    className="aspect-[4/3] bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--surface-container-high))] transition-all cursor-pointer group"
                  >
                    <Package className="w-8 h-8 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))] transition-colors" />
                    <span className="text-sm text-[hsl(var(--on-surface))]">批量上传已有物品图</span>
                    <span className="text-xs text-[hsl(var(--secondary))]">支持上传zip格式的压缩包</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Generation - Only show when genMethod is "model" */}
          {genMethod === "model" && (
            <div className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  <span className="text-red-500 mr-1">*</span>选择模型
                </label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-between rounded-xl bg-[hsl(var(--surface-container-low))] px-4 text-left text-sm font-normal text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-high))]"
                    >
                      <span>{models.find((model) => model.id === selectedModel)?.name ?? "选择生成模型"}</span>
                      <ChevronDown className="h-4 w-4 text-[hsl(var(--secondary))]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={10}
                    className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container-lowest))] p-2 shadow-xl"
                  >
                    {models.map((model) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`min-h-[44px] rounded-lg px-3 text-base ${
                          selectedModel === model.id
                            ? "bg-[hsl(var(--primary))] text-white focus:bg-[hsl(var(--primary))] focus:text-white"
                            : "text-[hsl(var(--on-surface))]"
                        }`}
                      >
                        <Check
                          className={`mr-3 h-4 w-4 ${
                            selectedModel === model.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span>{model.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-xs text-[hsl(var(--secondary))]">
                  {models.find((model) => model.id === selectedModel)?.desc}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  <span className="text-red-500 mr-1">*</span>提示词
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e)}
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  className="hidden"
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsReferenceDragOver(true)
                  }}
                  onDragLeave={() => setIsReferenceDragOver(false)}
                  onDrop={handleReferenceDrop}
                  className={`rounded-2xl border bg-[hsl(var(--surface-container-low))] p-4 transition-all ${
                    isReferenceDragOver
                      ? "border-[hsl(var(--primary))]/60 bg-[hsl(var(--primary))]/5"
                      : "border-[hsl(var(--outline-variant))]/35"
                  }`}
                >
                  <div className="flex gap-4">
                    {referenceImages.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-28 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--outline-variant))]/45 bg-[hsl(var(--surface-container-lowest))] text-[hsl(var(--secondary))] transition-all hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]"
                      >
                        <ImagePlus className="h-7 w-7" />
                      </button>
                    ) : null}

                    <div className="min-w-0 flex-1">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="上传参考图、输入文字，描述你想生成的图片。"
                        className="min-h-[110px] w-full resize-none bg-transparent text-base text-[hsl(var(--on-surface))] placeholder:text-[hsl(var(--secondary))] focus:outline-none"
                      />
                    </div>
                  </div>

                  {referenceImages.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {referenceImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative h-20 w-20 overflow-hidden rounded-2xl border border-[hsl(var(--outline-variant))]/25 bg-[hsl(var(--surface-container-lowest))]"
                        >
                          <img src={image} alt={`参考图 ${index + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeReferenceImage(index)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--outline-variant))]/40 text-[hsl(var(--secondary))] transition-all hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]"
                      >
                        <ImagePlus className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-[hsl(var(--secondary))]">
                  支持拖入多张参考图，图片会作为多参考输入一起参与生成。
                </p>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  生成比例
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "1:1", label: "1:1", desc: "正方形" },
                    { value: "16:9", label: "16:9", desc: "横屏" },
                    { value: "9:16", label: "9:16", desc: "竖屏" },
                    { value: "4:3", label: "4:3", desc: "经典" },
                  ].map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value as typeof aspectRatio)}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all ${
                        aspectRatio === ratio.value
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                          : "border-[hsl(var(--outline-variant))]/30 bg-transparent hover:border-[hsl(var(--outline-variant))]/60"
                      }`}
                    >
                      <span className={`block text-sm font-bold ${
                        aspectRatio === ratio.value ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--on-surface))]"
                      }`}>
                        {ratio.label}
                      </span>
                      <span className="block text-[10px] text-[hsl(var(--secondary))] mt-0.5">
                        {ratio.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(var(--outline-variant))]/20">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg border-0 hover:opacity-90 transition-opacity"
          >
            创建物品
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
