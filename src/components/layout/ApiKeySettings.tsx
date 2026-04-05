import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { Eye, EyeOff, Key, Save } from "lucide-react"

interface ApiKeySettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ApiKeys {
  openai: string
  claude: string
  stability: string
  midjourney: string
  azure: string
}

const STORAGE_KEY = "mangacanvas-api-keys"

const defaultKeys: ApiKeys = {
  openai: "",
  claude: "",
  stability: "",
  midjourney: "",
  azure: "",
}

const providers = [
  { key: "openai", name: "OpenAI", placeholder: "sk-..." },
  { key: "claude", name: "Claude (Anthropic)", placeholder: "sk-ant-..." },
  { key: "stability", name: "Stable Diffusion", placeholder: "sk-..." },
  { key: "midjourney", name: "Midjourney", placeholder: "..." },
  { key: "azure", name: "Azure OpenAI", placeholder: "..." },
] as const

export default function ApiKeySettings({ open, onOpenChange }: ApiKeySettingsProps) {
  const { notify } = useFeedback()
  const [keys, setKeys] = useState<ApiKeys>(defaultKeys)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  // 加载已保存的 API Keys
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setKeys({ ...defaultKeys, ...JSON.parse(saved) })
        } catch {
          setKeys(defaultKeys)
        }
      }
    }
  }, [open])

  const handleSave = async () => {
    setIsSaving(true)
    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    setIsSaving(false)
    notify.success("API Key 已保存")
    onOpenChange(false)
  }

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const updateKey = (provider: keyof ApiKeys, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Key className="w-5 h-5 text-[hsl(var(--primary))]" />
            API Key 配置
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-[hsl(var(--secondary))]">
            配置各家 AI 模型的 API Key，用于生成图像和内容。您的密钥仅存储在本地浏览器中。
          </p>

          {providers.map((provider) => (
            <div key={provider.key} className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--on-surface))]">
                {provider.name}
              </label>
              <div className="relative">
                <Input
                  type={showKeys[provider.key] ? "text" : "password"}
                  value={keys[provider.key as keyof ApiKeys]}
                  onChange={(e) => updateKey(provider.key as keyof ApiKeys, e.target.value)}
                  placeholder={provider.placeholder}
                  className="pr-10 bg-[hsl(var(--surface-container-low))] border-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey(provider.key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))] transition-colors"
                >
                  {showKeys[provider.key] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--outline-variant))]/20">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[hsl(var(--secondary))]"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="signature-gradient text-white border-0 hover:opacity-90"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存配置
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
