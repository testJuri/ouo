import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

interface EpisodeCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: {
    folderName: string
    episodeCount: string
    description: string
  }) => void
}

export default function EpisodeCreator({ open, onOpenChange, onCreate }: EpisodeCreatorProps) {
  const { notify } = useFeedback()
  const [folderName, setFolderName] = useState("")
  const [episodeCount, setEpisodeCount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    // 表单校验
    if (!folderName.trim()) {
      notify.warning("请输入片段文件夹名称")
      return
    }
    
    onCreate?.({ folderName: folderName.trim(), episodeCount, description })
    onOpenChange(false)
    setFolderName("")
    setEpisodeCount("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[480px] p-0 overflow-hidden border-0 rounded-2xl bg-[hsl(var(--surface))]">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <DialogTitle className="text-xl font-bold text-[hsl(var(--on-surface))]">
            创建片段
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 py-4 space-y-5">
          {/* 片段文件夹名称 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>
              片段文件夹名称
            </label>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="请输入片段文件夹名称"
              className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>

          {/* 片段数量 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))] flex items-center gap-1">
              片段数量
              <HelpCircle className="w-4 h-4 text-[hsl(var(--secondary))]" />
            </label>
            <Input
              type="number"
              value={episodeCount}
              onChange={(e) => setEpisodeCount(e.target.value)}
              placeholder="请输入片段数量"
              className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>

          {/* 片段说明 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              片段说明
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入片段说明"
              rows={4}
              className="rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] resize-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!folderName.trim()}
            className="w-full h-11 signature-gradient text-white rounded-xl font-bold text-base border-0 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建片段
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
