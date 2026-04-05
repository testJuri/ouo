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
import { Eye, EyeOff, Hand, FileText, Clapperboard, Info } from "lucide-react"

interface ProjectCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (project: {
    name: string
    password?: string
    mode: string
    description: string
  }) => void
}

const inputModes = [
  { id: "manual", label: "手动创建模式", icon: Hand, hint: "不上传剧本，手动创建片段，创建任务。" },
  { id: "script", label: "剧本模式", icon: FileText, hint: "上传剧本文件，系统将自动解析并生成片段结构。" },
  { id: "storyboard", label: "分镜描述模式", icon: Clapperboard, hint: "通过分镜描述快速初始化项目内容。" },
]

export default function ProjectCreator({ open, onOpenChange, onCreate }: ProjectCreatorProps) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mode, setMode] = useState("manual")
  const [description, setDescription] = useState("")

  const activeMode = inputModes.find((m) => m.id === mode)

  const handleSubmit = () => {
    if (!name.trim()) return
    onCreate?.({
      name: name.trim(),
      password: password || undefined,
      mode,
      description,
    })
    // reset
    setName("")
    setPassword("")
    setConfirmPassword("")
    setMode("manual")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[520px] p-0 overflow-hidden border-0 rounded-2xl bg-[hsl(var(--surface))]">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <DialogTitle className="text-xl font-bold text-[hsl(var(--on-surface))]">
            新建项目
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* 项目名称 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>项目名称
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入项目名称"
              className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>

          {/* 项目访问密码 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">项目访问密码</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入项目访问密码（可选）"
                className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 确认项目访问密码 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">确认项目访问密码</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入项目访问密码"
                className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 输入模式 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>输入模式
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[hsl(var(--surface-container-low))]">
              {inputModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-lg text-xs font-medium transition-all ${
                    mode === m.id
                      ? "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-surface))] shadow-sm"
                      : "text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                  }`}
                >
                  <m.icon className="w-4 h-4 mb-0.5" />
                  <span className="text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
            {activeMode?.hint && (
              <div className="flex items-start gap-2 text-xs text-[hsl(var(--secondary))] bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{activeMode.hint}</span>
              </div>
            )}
          </div>

          {/* 项目说明 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">项目说明</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请填写项目说明"
              rows={4}
              className="rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] resize-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
            <div className="text-right text-xs text-[hsl(var(--secondary))]">{description.length}</div>
          </div>

          {/* 上传项目封面图 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">上传项目封面图，最佳尺寸3:4</label>
            <div className="h-36 bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group">
              <svg
                className="w-10 h-10 text-[hsl(var(--primary))] group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                <path d="M8 12l2.5 2.5L14 11l4 4" />
                <circle cx="9" cy="10" r="1.5" />
              </svg>
              <span className="text-xs text-[hsl(var(--secondary))]">点击上传封面图</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full h-11 signature-gradient text-white rounded-xl font-bold text-base border-0 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建项目
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
