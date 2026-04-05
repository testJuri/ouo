import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Hand, FileText, Clapperboard, Info, Upload, X, Download } from "lucide-react"

interface ProjectCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (project: {
    name: string
    password?: string
    mode: string
    description: string
  scriptFile?: File | null
  }) => void
}

const inputModes = [
  { id: "manual", label: "手动创建模式", icon: Hand, hint: "不上传剧本，手动创建片段，创建任务。" },
  { id: "script", label: "剧本模式", icon: FileText, hint: "上传剧本文件，系统将自动解析并生成片段结构。" },
  { id: "storyboard", label: "分镜描述模式", icon: Clapperboard, hint: "通过分镜描述快速初始化项目内容。" },
]

export default function ProjectCreator({ open, onOpenChange, onCreate }: ProjectCreatorProps) {
  const { notify } = useFeedback()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mode, setMode] = useState("manual")
  const [description, setDescription] = useState("")
  const [scriptFile, setScriptFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  // 过滤中文字符
  const filterChinese = (value: string) => {
    return value.replace(/[\u4e00-\u9fa5]/g, "")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const filtered = filterChinese(e.target.value)
    setter(filtered)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 验证文件类型和大小
    const lowerName = file.name.toLowerCase()
    const validExtensions = mode === "storyboard" ? [".txt", ".xlsx", ".xls"] : [".txt"]
    if (!validExtensions.some((ext) => lowerName.endsWith(ext))) {
      notify.warning(mode === "storyboard" ? "请上传 TXT / XLSX / XLS 格式文件" : "请上传 TXT 格式的剧本文件")
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      notify.warning("文件大小不能超过 4MB")
      return
    }
    setScriptFile(file)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      notify.warning("请上传图片格式的封面文件")
      return
    }
    setCoverImage(file)
  }

  const handleTemplateDownload = (type: "txt" | "excel") => {
    notify.info(`${type === "txt" ? "TXT" : "Excel"} 模板下载功能开发中`)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onCreate?.({
      name: name.trim(),
      password: password || undefined,
      mode,
      description,
      scriptFile: mode === "manual" ? null : scriptFile,
    })
    // reset
    setName("")
    setPassword("")
    setConfirmPassword("")
    setMode("manual")
    setDescription("")
    setScriptFile(null)
    setCoverImage(null)
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
                onChange={(e) => handlePasswordChange(e, setPassword)}
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
                onChange={(e) => handlePasswordChange(e, setConfirmPassword)}
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
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>输入模式
              </label>
              {mode === "storyboard" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleTemplateDownload("txt")}
                    className="h-10 rounded-xl border border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container-low))] px-3 text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    TXT 模板
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleTemplateDownload("excel")}
                    className="h-10 rounded-xl border border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container-low))] px-3 text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Excel 模板
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface-container-low))] p-1.5">
              {inputModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center justify-center gap-2 py-5 px-3 rounded-xl text-sm font-medium transition-all ${
                    mode === m.id
                      ? "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))] shadow-sm"
                      : "text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  <span className="text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
            {mode === "script" && (
              <div className="flex items-start gap-2 text-xs text-[hsl(var(--secondary))] bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>上传完整剧本，AI自动分集，自动创建片段，创建任务。AI自动拆分镜头，生成提示词。</span>
              </div>
            )}
            {mode === "manual" && (
              <div className="flex items-start gap-2 text-xs text-[hsl(var(--secondary))] bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>不上传剧本，手动创建片段，创建任务。</span>
              </div>
            )}
            {mode === "storyboard" && (
              <div className="flex items-start gap-2 rounded-xl border border-[hsl(var(--primary))]/25 bg-[hsl(var(--primary))]/8 px-4 py-3 text-sm leading-7 text-[hsl(var(--secondary))]">
                <Info className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--primary))]" />
                <span>
                  上传完整分镜描述剧本，AI 自动分集、自动创建片段、创建任务。自己规划分镜内容，AI 只负责生成融图提示词和生视频提示词。
                  <span className="ml-1 font-semibold text-[hsl(var(--primary))]">请将每集最大分镜数量控制在 80 以内。</span>
                  适合对镜头有明确规划的导演用户。
                </span>
              </div>
            )}
          </div>

          {/* 剧本文件上传 */}
          {(mode === "script" || mode === "storyboard") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>上传剧本文件
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept={mode === "storyboard" ? ".txt,.xlsx,.xls" : ".txt"}
                  onChange={handleFileChange}
                  className="hidden"
                  id="script-upload"
                />
                <label
                  htmlFor="script-upload"
                  className="block h-44 bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group"
                >
                  {scriptFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-10 h-10 text-[hsl(var(--primary))]" />
                      <span className="text-sm text-[hsl(var(--on-surface))] font-medium">{scriptFile.name}</span>
                      <span className="text-xs text-[hsl(var(--secondary))]">
                        {(scriptFile.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setScriptFile(null)
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        移除文件
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-[hsl(var(--primary))] group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-[hsl(var(--on-surface))]">单击或拖动文件到此区域进行上传</span>
                      <span className="text-xs text-[hsl(var(--secondary))]">
                        {mode === "storyboard" ? "支持 TXT / XLSX / XLS 格式，大小不超过 4MB" : "支持 TXT 格式，大小不超过 4MB"}
                      </span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-[hsl(var(--secondary))]">
                {mode === "storyboard" ? "自动根据分镜描述创建项目内容" : "自动根据剧本每集创建一个片段"}
              </p>
            </div>
          )}

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
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="h-36 bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group overflow-hidden"
              >
                {coverImage ? (
                  <>
                    <FileText className="w-10 h-10 text-[hsl(var(--primary))]" />
                    <span className="text-sm text-[hsl(var(--on-surface))] font-medium">{coverImage.name}</span>
                    <span className="text-xs text-[hsl(var(--secondary))]">点击重新上传封面图</span>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </label>
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
