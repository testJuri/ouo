import { useState, useRef } from "react"
import { X, ImagePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddPropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (data: { name: string; prompt: string; image?: File }) => void
}

export function AddPropDialog({
  open,
  onOpenChange,
  onConfirm,
}: AddPropDialogProps) {
  const [name, setName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleConfirm = () => {
    if (!name.trim()) return
    onConfirm?.({ 
      name: name.trim(), 
      prompt: prompt.trim(), 
      image: image || undefined 
    })
    resetForm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setName("")
    setPrompt("")
    setImage(null)
    setImagePreview(null)
  }

  const canSubmit = name.trim() && (prompt.trim() || image)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[90vw] p-0 gap-0 bg-[#1a1d24] border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-white">
            添加道具
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 pb-6 space-y-6">
          {/* 道具名称 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              道具名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入道具名称"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* 道具提示词 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white/90">
                道具提示词
              </label>
              <span className="text-xs text-white/40">可选，和图片二选一即可</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入道具提示词"
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* 道具图片 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white/90">
                道具图片
              </label>
              <span className="text-xs text-white/40">可选</span>
              <span className="text-xs text-white/30">建议上传的图片与项目尺寸(9:16)保持一致</span>
            </div>
            
            {imagePreview ? (
              <div className="relative w-40 aspect-[9/16] rounded-xl overflow-hidden border border-white/10">
                <img
                  src={imagePreview}
                  alt="道具预览"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/80 hover:bg-black/80 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-40 aspect-[9/16] rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/40 hover:bg-white/[0.07] transition-all"
              >
                <ImagePlus className="w-8 h-8 text-white/40" />
                <span className="text-sm text-white/50">上传图片</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg text-white/80 font-medium hover:bg-white/5 transition-all"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              确认添加（4 积分）
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
