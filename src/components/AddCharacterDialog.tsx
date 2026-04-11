import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddCharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (data: { name: string; prompt: string }) => void
}

export function AddCharacterDialog({
  open,
  onOpenChange,
  onConfirm,
}: AddCharacterDialogProps) {
  const [name, setName] = useState("")
  const [prompt, setPrompt] = useState("")

  const handleConfirm = () => {
    if (!name.trim() || !prompt.trim()) return
    onConfirm?.({ name: name.trim(), prompt: prompt.trim() })
    setName("")
    setPrompt("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName("")
    setPrompt("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[90vw] p-0 gap-0 bg-[#1a1d24] border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              添加角色
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 pb-6 space-y-6">
          {/* 角色名称 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              角色名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入角色名称"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* 角色提示词 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white/90">
                角色提示词
              </label>
              <span className="text-xs text-white/40">必填</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入角色信息，如性别年龄、国籍、外貌、衣着、气质、背景等"
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
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
              disabled={!name.trim() || !prompt.trim()}
              className="px-6 py-2.5 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              确认添加（8 积分）
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
