import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { X, ChevronDown, ImagePlus, Copy, Check, Dice5, Lock, Upload } from "lucide-react"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import type { CharacterCreateData, Character } from "@/types"

export interface CharacterEditData extends CharacterCreateData {
  id: number
}

interface CharacterCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: CharacterCreateData) => void
  onUpdate?: (data: CharacterEditData) => void
  initialData?: Character | null
  mode?: 'create' | 'edit'
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

const quantityOptions = [1, 2, 3, 4, 5]

const createSeed = () =>
  `${Math.floor(10000000 + Math.random() * 90000000)}${Math.floor(10000000 + Math.random() * 90000000)}`

export default function CharacterCreator({ 
  open, 
  onOpenChange, 
  onCreate, 
  onUpdate, 
  initialData, 
  mode = 'create' 
}: CharacterCreatorProps) {
  const { notify } = useFeedback()
  const isEditMode = mode === 'edit' && initialData != null
  const [genMethod, setGenMethod] = useState("model")
  const [selectedModel, setSelectedModel] = useState("xt45")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [characterName, setCharacterName] = useState("")
  const [description, setDescription] = useState("")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [batchArchiveName, setBatchArchiveName] = useState("")
  const [role, setRole] = useState<"main" | "support">("support")
  const [seedMode, setSeedMode] = useState<"random" | "fixed">("fixed")
  const [seed, setSeed] = useState(createSeed)
  const [quantity, setQuantity] = useState(1)
  const [isRealPerson, setIsRealPerson] = useState(true)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchFileInputRef = useRef<HTMLInputElement>(null)

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

  const handleGenMethodChange = (methodId: string) => {
    setGenMethod(methodId)
    if (methodId !== "upload") {
      setBatchArchiveName("")
    }
  }

  const handleGenerateSeed = () => {
    setSeed(createSeed())
  }

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBatchArchiveName(file.name)
    }
  }

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (open) {
      setCopied(false)
      setSeed((current) => current || createSeed())
      
      if (isEditMode && initialData) {
        // 回填编辑数据
        setCharacterName(initialData.name)
        setGender(initialData.gender || "")
        setAge(initialData.ageGroup || "")
        setRole(initialData.role === "主角" ? "main" : "support")
        setGenMethod(initialData.genMethod || "model")
        setSelectedModel(initialData.model || "xt45")
        setDescription(initialData.description || "")
        setSeed(initialData.seed || createSeed())
        setSeedMode((initialData.seedMode as "random" | "fixed") || "fixed")
        setReferenceImage(initialData.image || null)
      } else {
        // 新建模式重置表单
        resetForm()
      }
    }
  }, [open, isEditMode, initialData])

  const resetForm = () => {
    setCharacterName("")
    setGender("")
    setAge("")
    setDescription("")
    setReferenceImage(null)
    setBatchArchiveName("")
    setRole("support")
    setGenMethod("model")
    setSelectedModel("xt45")
    setSeedMode("fixed")
    setSeed(createSeed())
    setQuantity(1)
    setIsRealPerson(true)
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
    if (genMethod === "upload" && !referenceImage && !batchArchiveName) {
      notify.warning("请上传已有角色图或 zip 压缩包")
      return
    }
    
    if (isEditMode && initialData) {
      const updatedCharacter: CharacterEditData = {
        id: initialData.id,
        name: characterName,
        gender,
        ageGroup: age,
        genMethod,
        model: selectedModel,
        description,
        referenceImage: referenceImage || undefined,
        role,
        seed,
        seedMode,
        quantity,
        isRealPerson,
        batchReferenceArchive: batchArchiveName || undefined,
      }
      onUpdate?.(updatedCharacter)
      notify.success("角色已更新")
    } else {
      const newCharacter: CharacterCreateData = {
        name: characterName,
        gender,
        ageGroup: age,
        genMethod,
        model: selectedModel,
        description,
        referenceImage: referenceImage || undefined,
        role,
        seed,
        seedMode,
        quantity,
        isRealPerson,
        batchReferenceArchive: batchArchiveName || undefined,
      }
      onCreate?.(newCharacter)
      notify.success("角色创建成功")
    }
    
    resetForm()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[900px] sm:max-w-[900px] p-0 overflow-hidden bg-[hsl(var(--surface))]" style={{ maxWidth: '900px' }} hideCloseButton>
        <SheetTitle className="sr-only">创建角色</SheetTitle>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface))]">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">{isEditMode ? "编辑角色" : "新建角色"}</h2>
          </div>
          <Badge className="signature-gradient text-white border-0 px-4 py-1.5">
            角色生成任务列表
          </Badge>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-70px)] overflow-y-auto p-6 pb-28 space-y-6">
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
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[96px_minmax(0,1fr)] md:items-center">
            <label className="text-sm font-medium text-[hsl(var(--on-surface))] md:pt-1">
              <span className="text-red-500 mr-1">*</span>生成方式
            </label>
            <div className="flex max-w-full flex-wrap gap-2 rounded-2xl border border-[hsl(var(--outline-variant))]/30 bg-[hsl(var(--surface-container-low))] p-1.5">
              {generationMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleGenMethodChange(method.id)}
                  className={`rounded-xl px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all ${
                    genMethod === method.id
                      ? "signature-gradient text-white shadow-sm"
                      : "text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--surface-container-high))] hover:text-[hsl(var(--on-surface))]"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {genMethod === "upload" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  <span className="text-red-500 mr-1">*</span>是否真人
                </label>
                <div className="flex items-center gap-8">
                  {[
                    { label: "是", value: true },
                    { label: "否", value: false },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setIsRealPerson(option.value)}
                      className="flex items-center gap-3 text-sm text-[hsl(var(--on-surface))]"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                          isRealPerson === option.value
                            ? "border-transparent signature-gradient"
                            : "border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))]"
                        }`}
                      >
                        {isRealPerson === option.value && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--on-surface))]">上传已有角色图</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[220px] rounded-2xl border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))] transition-colors hover:bg-[hsl(var(--surface-container-high))] cursor-pointer group overflow-hidden relative"
                  >
                    {referenceImage ? (
                      <>
                        <img src={referenceImage} alt="上传已有角色图" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                          <span className="rounded-full bg-black/60 px-4 py-2 text-sm text-white">重新上传</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3">
                        <ImagePlus className="h-12 w-12 text-white/90" />
                        <div className="text-center space-y-1">
                          <p className="text-base font-medium text-[hsl(var(--on-surface))]">上传已有角色图</p>
                          <p className="text-sm text-[hsl(var(--secondary))]">支持 JPG / JPEG / PNG 格式</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--on-surface))]">批量上传已有角色图</label>
                  <div
                    onClick={() => batchFileInputRef.current?.click()}
                    className="min-h-[220px] rounded-2xl border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))] transition-colors hover:bg-[hsl(var(--surface-container-high))] cursor-pointer group p-6"
                  >
                    <div className="flex h-full min-h-[172px] flex-col items-center justify-center gap-3 text-center">
                      <Upload className="h-12 w-12 text-white/90" />
                      <div className="space-y-1">
                        <p className="text-base font-medium text-[hsl(var(--on-surface))]">批量上传已有角色图</p>
                        <p className="text-sm text-[hsl(var(--secondary))]">支持上传 zip 格式的压缩包</p>
                      </div>
                      {batchArchiveName && (
                        <p className="max-w-full truncate rounded-full bg-[hsl(var(--surface-container-high))] px-3 py-1 text-xs text-[hsl(var(--on-surface))]">
                          {batchArchiveName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reference Image + Seed Control */}
          <div className={`grid gap-6 ${genMethod === "upload" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {genMethod !== "upload" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">角色参考图</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[220px] rounded-2xl border border-dashed border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))] transition-colors hover:bg-[hsl(var(--surface-container-high))] cursor-pointer group overflow-hidden relative"
                >
                  {referenceImage ? (
                    <>
                      <img src={referenceImage} alt="角色参考图" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                        <span className="rounded-full bg-black/60 px-4 py-2 text-sm text-white">重新上传</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--surface-container-high))]">
                        <ImagePlus className="h-8 w-8 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))]" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-base font-medium text-[hsl(var(--on-surface))]">角色参考图</p>
                        <p className="text-sm text-[hsl(var(--secondary))]">支持 JPG / JPEG / PNG 格式</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">种子控制（确保视角一致性）</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSeedMode("random")
                      handleGenerateSeed()
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      seedMode === "random"
                        ? "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))]"
                        : "bg-[hsl(var(--surface-container-low))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))]"
                    }`}
                  >
                    <Dice5 className="h-4 w-4" />
                    随机种子
                  </button>
                  <button
                    onClick={() => setSeedMode("fixed")}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      seedMode === "fixed"
                        ? "signature-gradient text-white"
                        : "bg-[hsl(var(--surface-container-low))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))]"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    固定种子
                  </button>
                </div>
                <div className="flex items-center overflow-hidden rounded-xl border border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface-container-low))]">
                  <Input
                    value={seed}
                    onChange={(e) => setSeed(e.target.value.replace(/\D/g, "").slice(0, 18))}
                    className="h-14 border-0 bg-transparent font-mono text-base focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopySeed}
                    className="h-14 w-14 rounded-none border-l border-[hsl(var(--outline-variant))]/20"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-[hsl(var(--secondary))]">
                  {seedMode === "fixed" ? "固定种子可以复现相同的生成结果" : "切换随机种子会刷新当前的生成种子"}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                  <span className="text-red-500 mr-1">*</span>生成数量
                </label>
                <div className="flex flex-wrap gap-5">
                  {quantityOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuantity(item)}
                      className="flex items-center gap-3 text-sm text-[hsl(var(--on-surface))]"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                          quantity === item
                            ? "border-transparent signature-gradient text-white"
                            : "border-[hsl(var(--outline-variant))]/40 bg-[hsl(var(--surface-container-low))]"
                        }`}
                      >
                        {quantity === item ? <span className="text-[11px] font-bold">{item}</span> : ""}
                      </span>
                      <span className={quantity === item ? "font-medium" : "text-[hsl(var(--secondary))]"}>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
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

          {/* Description */}
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
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg border-0 hover:opacity-90 transition-opacity"
          >
            {isEditMode ? "保存修改" : "提交任务（消耗0积分）}"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
