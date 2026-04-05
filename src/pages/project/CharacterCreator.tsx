import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { X, ChevronDown, ImagePlus, Copy, Check } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

export interface CharacterCreateData {
  name: string
  gender: string
  ageGroup: string
  genMethod: string
  model: string
  description: string
  referenceImage?: string
  role: "main" | "support"
  style?: string
}

interface CharacterCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: CharacterCreateData) => void
}

const models = [
  { id: "xt45", name: "星图4.5", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop" },
  { id: "xt40", name: "星图4.0", image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&h=200&fit=crop" },
  { id: "xt30", name: "星图3.0", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
  { id: "xt25", name: "星图2.5", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" },
  { id: "xj21", name: "香蕉2.1", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&h=200&fit=crop" },
  { id: "xj20", name: "香蕉2.0", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop" },
  { id: "mjv7", name: "MJ-V7", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
]

const genderOptions = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "other", label: "其他" },
]

const ageOptions = [
  { value: "child", label: "儿童" },
  { value: "teen", label: "少年" },
  { value: "young", label: "青年" },
  { value: "middle", label: "中年" },
  { value: "old", label: "老年" },
]

const promptTemplate = `【基础信息】
姓名：
性别：
年龄：
身高：
体型：

【外貌特征】
发型发色：
脸型：
眼睛颜色：
肤色：
特殊标记：

【服装配饰】
上装：
下装：
鞋子：
饰品：
武器/道具：

【性格特点】
性格：
口头禅：
习惯性动作：`;

export default function CharacterCreator({ open, onOpenChange, onCreate }: CharacterCreatorProps) {
  const { notify } = useFeedback()
  const [genMethod, setGenMethod] = useState("model")
  const [selectedModel, setSelectedModel] = useState("xt45")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [characterName, setCharacterName] = useState("")
  const [description, setDescription] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [role, setRole] = useState<"main" | "support">("support")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generationMethods = [
    { id: "model", label: "通过模型生成角色" },
    { id: "upload", label: "自己上传图片" },
    { id: "jurilu", label: "巨日禄标准生成器" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setReferenceImage(url)
    }
  }

  const handleApplyTemplate = () => {
    setDescription(promptTemplate)
  }

  const handleCopySeed = () => {
    const seed = Math.floor(Math.random() * 1000000).toString()
    navigator.clipboard.writeText(seed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    if (!characterName.trim()) {
      notify.warning("请输入角色名称")
      return
    }
    if (!gender) {
      notify.warning("请选择性别")
      return
    }
    if (!age) {
      notify.warning("请选择年龄段")
      return
    }
    
    const newCharacter: CharacterCreateData = {
      name: characterName,
      gender,
      ageGroup: age,
      genMethod,
      model: selectedModel,
      description,
      referenceImage: referenceImage || undefined,
      role,
      style: models.find(m => m.id === selectedModel)?.name,
    }
    
    onCreate?.(newCharacter)
    
    // Reset form
    setCharacterName("")
    setGender("")
    setAge("")
    setDescription("")
    setReferenceImage(null)
    setRole("support")
    setGenMethod("model")
    setSelectedModel("xt45")
    
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
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">新建角色</h2>
          </div>
          <Badge className="signature-gradient text-white border-0 px-4 py-1.5">
            角色生成任务列表
          </Badge>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-70px)] overflow-y-auto p-6 pb-28 space-y-6">
          {/* Row 1: Name / Gender / Age */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>角色名称
              </label>
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="请输入"
                className="h-11 rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>性别
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-between rounded-xl bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container-high))] text-sm font-normal px-3"
                  >
                    <span className={gender ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--secondary))]"}>
                      {gender ? genderOptions.find(g => g.value === gender)?.label : "请选择"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[hsl(var(--secondary))]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {genderOptions.map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => setGender(option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                <span className="text-red-500 mr-1">*</span>年龄段
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-between rounded-xl bg-[hsl(var(--surface-container-low))] hover:bg-[hsl(var(--surface-container-high))] text-sm font-normal px-3"
                  >
                    <span className={age ? "text-[hsl(var(--on-surface))]" : "text-[hsl(var(--secondary))]"}>
                      {age ? ageOptions.find(a => a.value === age)?.label : "请选择"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[hsl(var(--secondary))]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {ageOptions.map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => setAge(option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>角色定位
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRole("main")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  role === "main"
                    ? "signature-gradient text-white"
                    : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-highest))]"
                }`}
              >
                主角
              </button>
              <button
                onClick={() => setRole("support")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  role === "support"
                    ? "signature-gradient text-white"
                    : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-highest))]"
                }`}
              >
                配角
              </button>
            </div>
          </div>

          {/* Generation Method */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>生成方式
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

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
              <span className="text-red-500 mr-1">*</span>选择模型
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative flex-shrink-0 cursor-pointer border-2 rounded-xl overflow-hidden aspect-square w-24 transition-all ${
                    selectedModel === model.id ? "border-[hsl(var(--primary))]" : "border-transparent hover:border-[hsl(var(--outline-variant))]"
                  }`}
                >
                  <img className="w-full h-full object-cover" src={model.image} alt={model.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                    <span className="text-[11px] font-bold text-white leading-tight">{model.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seed Control */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))]">随机种子</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-[hsl(var(--surface-container-low))] text-sm font-mono text-[hsl(var(--secondary))]">
                {Math.floor(Math.random() * 1000000)}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopySeed}
                className="w-11 h-11 rounded-xl border-[hsl(var(--outline-variant))]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && <p className="text-xs text-emerald-500">已复制到剪贴板</p>}
          </div>

          {/* Description + Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  <span className="text-red-500 mr-1">*</span>描述
                </label>
                <Badge 
                  onClick={handleApplyTemplate}
                  className="signature-gradient text-white border-0 text-[10px] px-2 py-0.5 rounded-full cursor-pointer hover:opacity-90"
                >
                  一键填入提示词框架
                </Badge>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="从多角度对角色进行详细描述，如身份、体型、身高、发型、发色、脸型、眼睛颜色、肤色、服装、饰品、鞋子等角度"
                rows={6}
                className="rounded-xl bg-[hsl(var(--surface-container-low))] border-none text-sm placeholder:text-[hsl(var(--secondary))] resize-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">上传参考图</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-full min-h-[160px] bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group overflow-hidden relative"
              >
                {referenceImage ? (
                  <img src={referenceImage} alt="参考图" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))] transition-colors" />
                    <span className="text-sm text-[hsl(var(--on-surface))]">上传参考图</span>
                    <span className="text-xs text-[hsl(var(--secondary))]">支持JPG / JPEG / PNG格式</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg border-0 hover:opacity-90 transition-opacity"
          >
            提交任务（消耗0积分）
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
