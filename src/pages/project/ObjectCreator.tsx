import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ImagePlus, Package } from "lucide-react"
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

export default function ObjectCreator({ open, onOpenChange, onCreate }: ObjectCreatorProps) {
  const { notify } = useFeedback()
  const [genMethod, setGenMethod] = useState<"model" | "upload">("upload")
  const [objectName, setObjectName] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
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
      
      {/* Drawer */}
      <div className="relative w-full max-w-[600px] h-full bg-[hsl(var(--surface))] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">新建物品</h2>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full px-4 py-2 text-sm font-medium border-[hsl(var(--outline-variant))] hover:bg-[hsl(var(--surface-container-high))]"
          >
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
  )
}
