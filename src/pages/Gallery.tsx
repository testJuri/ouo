import { useState } from "react"
import { 
  Home as HomeIcon,
  FolderOpen,
  Triangle,
  Sparkles,
  Plus,
  Settings,
  LogOut,
  User,
  Search,
  ChevronDown,
  Pencil,
  RotateCcw,
  Trash2,
  Image as ImageIcon,
  Wand2
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { authApi } from "@/api"
import { getRefreshToken } from "@/lib/session"
import { useAccountInfo } from "@/hooks/useAccountInfo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

// Mock 生成历史数据
const mockHistory = [
  {
    id: 1,
    timestamp: "2026-04-10 23:42:12",
    type: "图片生成",
    prompt: "一个魔兽世界的角色，精灵弓箭手，风暴的中心，史诗，魔法撕裂，超写实，动态模糊",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=800&h=1000&fit=crop",
    model: "Nano Banana 2",
    ratio: "3:4",
    style: "全部",
  },
  {
    id: 2,
    timestamp: "2026-04-10 23:38:45",
    type: "图片生成",
    prompt: "赛博朋克风格的城市夜景，霓虹灯闪烁，雨滴打在玻璃上，未来科技感",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=600&fit=crop",
    model: "Nano Banana 2",
    ratio: "16:9",
    style: "全部",
  },
  {
    id: 3,
    timestamp: "2026-04-10 23:15:22",
    type: "图片生成",
    prompt: "古风武侠少女，手持长剑，竹林背景，水墨风格，飘逸的长发",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=1000&fit=crop",
    model: "Nano Banana 2",
    ratio: "9:16",
    style: "全部",
  },
  {
    id: 4,
    timestamp: "2026-04-10 22:58:10",
    type: "图片生成",
    prompt: "蒸汽朋克机械龙，齿轮和蒸汽，金属质感，复古未来主义",
    image: "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=800&h=800&fit=crop",
    model: "Nano Banana 2",
    ratio: "1:1",
    style: "全部",
  },
  {
    id: 5,
    timestamp: "2026-04-10 22:45:33",
    type: "图片生成",
    prompt: "梦幻森林场景，发光的蘑菇，萤火虫，神秘的氛围，童话风格",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",
    model: "Nano Banana 2",
    ratio: "4:3",
    style: "全部",
  },
]

// Mock 模型列表
const models = [
  { id: "nano2", name: "Nano Banana 2" },
  { id: "sdxl", name: "SDXL" },
  { id: "midjourney", name: "Midjourney V6" },
  { id: "dalle3", name: "DALL·E 3" },
]

// Mock 比例选项
const ratios = [
  { id: "16:9", name: "16:9" },
  { id: "9:16", name: "9:16" },
  { id: "1:1", name: "1:1" },
  { id: "3:4", name: "3:4" },
  { id: "4:3", name: "4:3" },
]

// Mock 数量选项
const counts = [
  { id: "1", name: "1张" },
  { id: "2", name: "2张" },
  { id: "4", name: "4张" },
]

// 顶部导航组件
function TopNav() {
  const { accountInfo } = useAccountInfo()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authApi.logout(getRefreshToken())
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-xl">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white">
        <span className="font-light">OUO</span>
      </Link>

      {/* 右侧工具 */}
      <div className="flex items-center gap-3">
        {/* 工具图标 */}
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <div className="w-4 h-4 border border-current rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-current rounded-sm" />
          </div>
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-current rounded-sm" />
            ))}
          </div>
        </button>

        {/* 积分显示 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white/80 font-medium">{accountInfo?.balance ?? '--'}</span>
        </div>

        {/* 头像下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white/20 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-xl border-white/10">
            <DropdownMenuLabel className="text-white/60">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>我的账户</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>当前积分</span>
                <span className="font-medium">{accountInfo?.balance ?? '--'}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>设置</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

// 左侧工具栏
function SidebarNav() {
  const navigate = useNavigate()
  
  const tools = [
    { id: 'home', icon: HomeIcon, label: '首页', action: () => navigate('/') },
    { id: 'projects', icon: FolderOpen, label: '项目', action: () => navigate('/') },
    { id: 'create', icon: Triangle, label: '创作', action: () => navigate('/gallery'), active: true },
  ]

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={tool.action}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                tool.active
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 历史记录卡片
function HistoryCard({ item }: { item: typeof mockHistory[0] }) {
  return (
    <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/5">
      {/* 头部信息 */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-white/50">
        <div className="flex items-center gap-3">
          <span>{item.timestamp}</span>
          <span className="text-white/30">{item.type}</span>
          <span className="text-white/70 truncate max-w-md">{item.prompt}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>{item.model}</span>
          <span className="text-white/30">|</span>
          <span>{item.ratio}</span>
        </div>
      </div>
      
      {/* 图片 */}
      <div className="px-4 pb-4">
        <div className="relative group">
          <img 
            src={item.image} 
            alt={item.prompt}
            className="max-h-[500px] rounded-xl object-cover"
          />
          
          {/* 操作按钮 */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-sm hover:bg-black/80 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
              重新编辑
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-sm hover:bg-black/80 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              再次生成
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-red-400 text-sm hover:bg-black/80 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 底部生成输入框
function GenerateInput() {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("nano2")
  const [selectedRatio, setSelectedRatio] = useState("9:16")
  const [selectedCount, setSelectedCount] = useState("1")
  
  // 预计消耗积分
  const estimatedCost = 4

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4">
      <div className="max-w-5xl mx-auto">
        {/* 输入框 */}
        <div className="flex items-start gap-3 mb-4">
          <button className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:border-white/30 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">参考</span>
            <span className="text-[10px]">素材</span>
          </button>
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="上传参考图、输入文字，也可@引用参考图，轻松定制专属图片"
              className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/20"
            />
          </div>
        </div>
        
        {/* 选项栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 添加按钮 */}
            <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            
            {/* 图片类型选择 */}
            <Select value="image">
              <SelectTrigger className="w-20 h-8 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
                <ImageIcon className="w-4 h-4 mr-1" />
                <span>图片</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
                <SelectItem value="image" className="text-white/80">图片</SelectItem>
                <SelectItem value="video" className="text-white/80">视频</SelectItem>
              </SelectContent>
            </Select>
            
            {/* 模型选择 */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-32 h-8 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
                <span>{models.find(m => m.id === selectedModel)?.name}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="text-white/80">
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 比例选择 */}
            <Select value={selectedRatio} onValueChange={setSelectedRatio}>
              <SelectTrigger className="w-20 h-8 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
                <span>{selectedRatio}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
                {ratios.map((ratio) => (
                  <SelectItem key={ratio.id} value={ratio.id} className="text-white/80">
                    {ratio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 数量选择 */}
            <Select value={selectedCount} onValueChange={setSelectedCount}>
              <SelectTrigger className="w-20 h-8 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
                <span>{counts.find(c => c.id === selectedCount)?.name}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
                {counts.map((count) => (
                  <SelectItem key={count.id} value={count.id} className="text-white/80">
                    {count.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 生成按钮 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">预计消耗：{estimatedCost} 积分</span>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <Wand2 className="w-4 h-4" />
              <span>生成</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [filterType, setFilterType] = useState("全部")
  const [filterStyle, setFilterStyle] = useState("全部")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <TopNav />
      
      {/* 左侧工具栏 */}
      <SidebarNav />
      
      {/* 筛选栏 */}
      <div className="fixed top-16 right-8 z-40 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="搜索..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-24 h-9 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
            <span>{filterType}</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </SelectTrigger>
          <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
            <SelectItem value="全部" className="text-white/80">全部</SelectItem>
            <SelectItem value="图片" className="text-white/80">图片</SelectItem>
            <SelectItem value="视频" className="text-white/80">视频</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStyle} onValueChange={setFilterStyle}>
          <SelectTrigger className="w-24 h-9 bg-white/5 border-white/10 text-white/80 text-sm hover:bg-white/10">
            <span>{filterStyle}</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </SelectTrigger>
          <SelectContent className="bg-black/80 backdrop-blur-xl border-white/10">
            <SelectItem value="全部" className="text-white/80">全部</SelectItem>
            <SelectItem value="风格1" className="text-white/80">风格1</SelectItem>
            <SelectItem value="风格2" className="text-white/80">风格2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 主内容区 */}
      <main className="pt-20 pb-40 px-8 pl-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {mockHistory.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      </main>
      
      {/* 底部生成输入框 */}
      <GenerateInput />
    </div>
  )
}
