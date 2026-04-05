import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFeedback } from "@/components/feedback/FeedbackProvider"

export default function Login() {
  const { notify } = useFeedback()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  // Mock 数据自动填充，方便测试
  const [email, setEmail] = useState("demo@mangacanvas.com")
  const [password, setPassword] = useState("123456")
  const [username, setUsername] = useState("DemoCreator")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      notify.warning("请输入邮箱和密码")
      return
    }

    if (!isLogin && !username.trim()) {
      notify.warning("请输入用户名")
      return
    }

    setIsLoading(true)

    // Mock 登录/注册延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 存储用户到 localStorage
    const user = {
      email,
      name: isLogin ? email.split('@')[0] : username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isLoggedIn: true
    }
    localStorage.setItem("manga-user", JSON.stringify(user))

    setIsLoading(false)
    
    // 跳转到 Dashboard
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[hsl(var(--primary))] tracking-tighter mb-2">
            MangaCanvas
          </h1>
          <p className="text-[hsl(var(--secondary))]">
            {isLogin ? "欢迎回来，继续你的创作之旅" : "创建账号，开启漫画创作新纪元"}
          </p>
        </div>

        <Card className="bg-[hsl(var(--surface-container-lowest))] border-0 p-8 rounded-2xl shadow-xl">
          {/* Toggle */}
          <div className="flex bg-[hsl(var(--surface-container-low))] p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin 
                  ? "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-surface))] shadow-sm" 
                  : "text-[hsl(var(--secondary))]"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin 
                  ? "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-surface))] shadow-sm" 
                  : "text-[hsl(var(--secondary))]"
              }`}
            >
              注册
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">用户名</label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">邮箱</label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link 
                  to="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    notify.info("重置链接已发送至邮箱（Mock）")
                  }}
                  className="text-xs text-[hsl(var(--primary))] hover:underline"
                >
                  忘记密码？
                </Link>
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 signature-gradient text-white rounded-xl font-bold text-base border-0 mt-2 disabled:opacity-50"
            >
              {isLoading ? "请稍候..." : (isLogin ? "登录" : "创建账号")}
            </Button>
          </form>

        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[hsl(var(--secondary))] mt-8">
          登录即表示你同意我们的
          <Link to="/terms" className="text-[hsl(var(--primary))] hover:underline">服务条款</Link>
          和
          <Link to="/privacy" className="text-[hsl(var(--primary))] hover:underline">隐私政策</Link>
        </p>
      </div>
    </div>
  )
}
