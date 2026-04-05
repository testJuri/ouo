import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ImagePlus, Package, LayoutList, CheckCircle2, Clock, ChevronLeft } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

export interface ObjectCreateData {
  name: string
  genMethod: "model" | "upload"
  referenceImage?: string
}

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
  const [genMethod, setGenMethod] = useState<"model" | "upload">("upload")
  const [objectName, setObjectName] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBatch = false) => {
    const file = e.target.files?.[0]
    if (file) {
      if (isBatch) {
        notify.success(`已选择批量上传文件：${file.name}`)
      } else {
        const url = URL.createObjectURL(file)
        setReferenceImage(url)
      }
    }
  }

  const handleSubmit = () => {
    if (!objectName.trim()) {
      notify.warning("请输入物品名称")
      return
    }
    
    const newObject: ObjectCreateData = {
      name: objectName,
      genMethod,
      referenceImage: referenceImage || undefined,
    }
    
    onCreate?.(newObject)
    
    // Reset form
    setObjectName("")
    setReferenceImage(null)
    setGenMethod("upload")
    
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
                  <ChevronLeft className="h-5 w-5" />
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
                    {referenceImage ? (
                      <img src={referenceImage} alt="参考图" className="w-full h-full object-cover" />
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

          {/* Model Generation Info - Only show when genMethod is "model" */}
          {genMethod === "model" && (
            <div className="p-6 rounded-xl bg-[hsl(var(--surface-container-low))] text-center">
              <p className="text-sm text-[hsl(var(--secondary))]">
                通过模型生成物品功能将使用 AI 根据物品名称自动生成 3D 物品图
              </p>
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
