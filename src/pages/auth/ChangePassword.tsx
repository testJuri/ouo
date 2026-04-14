import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { authApi } from "@/api"
import { isMockMode } from "@/api/mock"
import { HttpError } from "@/api/core/error"
import { ArrowLeft, Lock } from "lucide-react"

const shouldFallbackToMock = (error: unknown) => {
  if (!(error instanceof HttpError)) {
    return false
  }
  return !error.status || error.status >= 500 || error.code === "ERR_NETWORK"
}

export default function ChangePassword() {
  const { notify } = useFeedback()
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      notify.warning("请填写所有密码字段")
      return
    }

    if (newPassword.length < 6) {
      notify.warning("新密码长度不能少于 6 位")
      return
    }

    if (newPassword !== confirmPassword) {
      notify.warning("两次输入的新密码不一致")
      return
    }

    setIsLoading(true)
    try {
      await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      })
      notify.success("密码修改成功，请重新登录")
      navigate("/login")
    } catch (error) {
      console.log("[ChangePassword] API 错误:", error)
      if (shouldFallbackToMock(error)) {
        notify.warning("后端暂时不可用，Mock 模式下模拟修改成功")
        navigate("/login")
        return
      }
      notify.error(error instanceof Error ? error.message : "密码修改失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 mb-4">
            <Lock className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(var(--on-surface))] mb-2">
            修改密码
          </h1>
          <p className="text-[hsl(var(--secondary))]">
            {isMockMode ? "Mock 模式：任意旧密码均可通过" : "请输入旧密码和新密码"}
          </p>
        </div>

        <Card className="bg-[hsl(var(--surface-container-lowest))] border-0 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">旧密码</label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="请输入旧密码"
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">新密码</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少 6 位）"
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">确认新密码</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 signature-gradient text-white rounded-xl font-bold text-base border-0 mt-2 disabled:opacity-50"
            >
              {isLoading ? "请稍候..." : "确认修改"}
            </Button>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
          </form>
        </Card>
      </div>
    </div>
  )
}
