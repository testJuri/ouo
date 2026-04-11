import { Link } from "react-router-dom"
import { Home, Image, Settings } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col p-6 z-50 glass-panel border-r border-white/5">
      {/* Logo */}
      <div className="mb-8 px-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">
            轩晔<span className="font-light text-white/60">OUO</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium bg-white/15 border border-white/10 transition-all"
        >
          <Home className="w-5 h-5" />
          <span>首页</span>
        </Link>
        <Link
          to="/gallery"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 border border-transparent transition-all"
        >
          <Image className="w-5 h-5" />
          <span>画廊</span>
        </Link>
      </nav>

      {/* User Section */}
      <div className="pt-4 mt-auto border-t border-white/10">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span>设置</span>
        </Link>
      </div>
    </aside>
  )
}
