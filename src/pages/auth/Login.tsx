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

  const handleSocialLogin = (provider: string) => {
    // Mock 第三方登录
    notify.success(`${provider} 登录演示：已模拟登录成功`)
    
    const user = {
      email: `${provider.toLowerCase()}@example.com`,
      name: `${provider} 用户`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      isLoggedIn: true
    }
    localStorage.setItem("manga-user", JSON.stringify(user))
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--outline-variant))]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[hsl(var(--surface-container-lowest))] text-[hsl(var(--secondary))]">
                或使用以下方式
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => handleSocialLogin("Google")}
              className="h-11 rounded-xl border-[hsl(var(--outline-variant))]"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => handleSocialLogin("GitHub")}
              className="h-11 rounded-xl border-[hsl(var(--outline-variant))]"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
              GitHub
            </Button>
          </div>
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
