import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { 
  LayoutGrid, 
  FolderOpen, 
  Image as ImageIcon,
  BarChart3,
  Settings,
  Plus,
  Search, 
  MoreHorizontal,
  Bell,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Clock,
  LayoutList,
  X,
  Copy,
  Dice5,
  Lock,
  RefreshCw,
  Grid3X3,
  ArrowRight,
  Wand2,
  Workflow
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

const navItems = [
  { icon: LayoutGrid, label: "仪表盘", href: "#" },
  { icon: FolderOpen, label: "项目", href: "#", active: true },
  { icon: ImageIcon, label: "媒体库", href: "#" },
  { icon: BarChart3, label: "分析", href: "#" },
]

const tabItems = [
  { id: "episodes", label: "片段管理" },
  { id: "characters", label: "角色管理" },
  { id: "scenes", label: "场景管理", active: true },
  { id: "objects", label: "物品管理" },
  { id: "fusion", label: "融合生图" },
  { id: "creation", label: "图片创作" },
]

const topTabs = [
  { id: "episodes", label: "片段" },
  { id: "characters", label: "角色" },
  { id: "scenes", label: "场景", active: true },
  { id: "objects", label: "物品" },
]

const characters = [
  {
    id: 1,
    name: "龙崎真治",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop",
    role: "主角",
    style: "赛博朋克",
    scenes: 12
  },
  {
    id: 2,
    name: "月城雪兔",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop",
    role: "配角",
    style: "传统水墨",
    scenes: 8
  },
  {
    id: 3,
    name: "神乐千鹤",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    role: "主角",
    style: "现代写实",
    scenes: 15
  },
  {
    id: 4,
    name: "黑崎一护",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    role: "配角",
    style: "热血少年",
    scenes: 6
  },
  {
    id: 5,
    name: "春野樱",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    role: "主角",
    style: "治愈系",
    scenes: 10
  },
  {
    id: 6,
    name: "佐藤健",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    role: "配角",
    style: "科幻风",
    scenes: 7
  },
  {
    id: 7,
    name: "林小北",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    role: "主角",
    style: "青春校园",
    scenes: 18
  },
  {
    id: 8,
    name: "陈默",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
    role: "配角",
    style: "悬疑暗黑",
    scenes: 9
  },
  {
    id: 9,
    name: "白浅",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    role: "主角",
    style: "古风仙侠",
    scenes: 20
  },
  {
    id: 10,
    name: "韩立",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
    role: "配角",
    style: "修仙玄幻",
    scenes: 5
  },
  {
    id: 11,
    name: "苏沐橙",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    role: "主角",
    style: "电竞少女",
    scenes: 14
  },
  {
    id: 12,
    name: "叶修",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=400&fit=crop",
    role: "配角",
    style: "成熟稳重",
    scenes: 11
  }
]

const scenes = [
  {
    id: 1,
    name: "赛博街区 7 号扇区",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "2 小时前",
    code: "BG_042"
  },
  {
    id: 2,
    name: "黄昏教室 2B",
    image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=450&fit=crop",
    status: "draft",
    modified: "1 天前",
    code: "INT_011"
  },
  {
    id: 3,
    name: "薄雾寺院庭院",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "3 小时前",
    code: "EXT_088"
  },
  {
    id: 4,
    name: "观测甲板欧米茄",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=450&fit=crop",
    status: "draft",
    modified: "5 天前",
    code: "SCI_003"
  },
  {
    id: 5,
    name: "低语森林",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=450&fit=crop",
    status: "in-use",
    modified: "12 小时前",
    code: "FNT_072"
  }
]

const generationMethods = [
  { id: "model", label: "通过模型生成场景" },
  { id: "upload", label: "自己上传图片" },
  { id: "angle", label: "机位转换器" },
  { id: "custom", label: "自定义机位", active: true },
]

const generationTasks = [
  {
    id: 1,
    name: "午夜东京小巷 #4",
    status: "processing",
    progress: 45,
    message: "渲染光照层..."
  },
  {
    id: 2,
    name: "赛博朋克屋顶景观",
    status: "completed",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=60&fit=crop"
  },
  {
    id: 3,
    name: "古寺庭院",
    status: "queued",
    waitTime: "2 分钟"
  },
  {
    id: 4,
    name: "学校走廊黄昏",
    status: "queued",
    waitTime: "等待资源..."
  }
]

const shotTypes = [
  { id: "close", label: "特写", zoom: "1.8x" },
  { id: "medium", label: "中景", zoom: "1.0x" },
  { id: "wide", label: "远景", zoom: "0.6x", active: true },
]

export default function ProjectDetail() {
  const [activeTab, setActiveTab] = useState("scenes")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [genMethod, setGenMethod] = useState("custom")
  const [seedType, setSeedType] = useState("fixed")
  const [distance, setDistance] = useState([8.0])
  const [horizontal] = useState(0)
  const [vertical] = useState(31)
  const [zoom, setZoom] = useState(0.6)

  // Generate prompt based on camera settings
  const generatePrompt = () => {
    const hLabel = horizontal < 0 ? "左前" : horizontal > 0 ? "右前" : "正前"
    const vLabel = vertical > 0 ? "微俯" : vertical < 0 ? "仰视" : "平视"
    return `<sks> ${hLabel} quarter view ${vLabel} elevated shot wide shot`
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      {/* Sheet Drawer - Full Width for Complex Form */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent 
          side="right" 
          className="w-[900px] sm:max-w-[900px] p-0 overflow-hidden bg-[hsl(var(--surface))]"
          style={{ maxWidth: '900px' }}
          hideCloseButton
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--outline-variant))]/20 bg-[hsl(var(--surface))]">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold text-[hsl(var(--on-surface))]">创建场景</h2>
            </div>
            <Badge className="signature-gradient text-white border-0 px-4 py-1.5">
              场景生成任务列表
            </Badge>
          </div>

          <div className="flex h-[calc(100vh-70px)]">
            {/* Left Panel - Form */}
            <div className="w-1/2 flex flex-col h-full overflow-y-auto p-6 space-y-6">
              {/* Scene Name */}
              <div className="space-y-2">
                <Input 
                  placeholder="请输入场景名称"
                  className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl h-12 text-lg"
                />
              </div>

              {/* Generation Method */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-1">
                  <span className="text-red-500">*</span> 生成方式
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

              {/* Reference Image & Camera Control */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reference Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <span className="text-red-500">*</span> 场景参考图
                    <HelpCircle className="w-4 h-4 text-[hsl(var(--secondary))]" />
                  </label>
                  <div className="aspect-square bg-[hsl(var(--surface-container-low))] rounded-xl border-2 border-dashed border-[hsl(var(--outline-variant))]/50 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer group">
                    <Plus className="w-8 h-8 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))]" />
                    <span className="text-sm text-[hsl(var(--secondary))]">新增</span>
                  </div>
                </div>

                {/* Camera Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">镜头控制</label>
                  <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-4 space-y-3">
                    {/* Horizontal */}
                    <div className={`p-3 rounded-lg border-l-4 ${horizontal < 0 ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10' : 'border-transparent bg-[hsl(var(--surface-container-high))]'}`}>
                      <div className="text-xs text-[hsl(var(--secondary))] uppercase">Horizontal</div>
                      <div className="font-bold">左前</div>
                      <div className="text-xs text-[hsl(var(--secondary))]">(front-left)</div>
                    </div>
                    {/* Vertical */}
                    <div className={`p-3 rounded-lg border-l-4 border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))]/10`}>
                      <div className="text-xs text-[hsl(var(--secondary))] uppercase">Vertical {vertical}°</div>
                      <div className="font-bold">微俯</div>
                      <div className="text-xs text-[hsl(var(--secondary))]">(elevated)</div>
                    </div>
                    {/* Zoom */}
                    <div className={`p-3 rounded-lg border-l-4 border-[hsl(var(--outline))] bg-[hsl(var(--outline))]/10`}>
                      <div className="text-xs text-[hsl(var(--secondary))] uppercase">Zoom {zoom}</div>
                      <div className="font-bold">远景 (wide shot)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Display */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[hsl(var(--secondary))]">PROMPT</span>
                  <code className="flex-1 text-sm font-mono text-emerald-400 bg-black/30 px-3 py-2 rounded-lg">
                    {generatePrompt()}
                  </code>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">补充描述（可选）</label>
                <Textarea 
                  placeholder="描述镜头背后的世界，引导 AI 的想象方向"
                  rows={4}
                  className="bg-[hsl(var(--surface-container-low))] border-none rounded-xl resize-none"
                />
              </div>

              {/* Seed Control */}
              <div className="space-y-3">
                <label className="text-sm font-medium">种子控制（确保视角一致性）</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSeedType("random")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      seedType === "random"
                        ? "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))]"
                        : "bg-transparent text-[hsl(var(--secondary))]"
                    }`}
                  >
                    <Dice5 className="w-4 h-4" />
                    随机种子
                  </button>
                  <button
                    onClick={() => setSeedType("fixed")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      seedType === "fixed"
                        ? "signature-gradient text-white"
                        : "bg-transparent text-[hsl(var(--secondary))]"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    固定种子
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    value="8425732489199588"
                    readOnly
                    className="flex-1 bg-[hsl(var(--surface-container-low))] border-none rounded-xl font-mono"
                  />
                  <Button variant="ghost" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-[hsl(var(--secondary))]">固定种子可以复现相同的生成结果</p>
              </div>
            </div>

            {/* Right Panel - 3D Preview & Task List */}
            <div className="w-1/2 bg-[hsl(var(--surface-container-low))] flex flex-col h-full">
              {/* 3D Viewport */}
              <div className="flex-1 relative bg-[hsl(var(--surface-container-high))] p-4">
                <div className="absolute top-4 left-4 flex items-center gap-2 text-[hsl(var(--secondary))] text-sm">
                  <Grid3X3 className="w-4 h-4" />
                  <span>3D 预览</span>
                </div>
                
                {/* 3D Grid Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 relative">
                    {/* Grid lines */}
                    <svg className="w-full h-full opacity-40" viewBox="0 0 200 200">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--outline-variant))" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="200" height="200" fill="url(#grid)" />
                      {/* Orbit rings */}
                      <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.6" transform="rotate(-15 100 100)"/>
                      <ellipse cx="100" cy="100" rx="60" ry="60" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" strokeOpacity="0.6"/>
                    </svg>
                    
                    {/* Camera indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-[hsl(var(--primary))] rounded-full shadow-lg shadow-[hsl(var(--primary))]/50"></div>
                    </div>
                    
                    {/* Control points */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-[hsl(var(--primary))] rounded-full"></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-[hsl(var(--primary))] rounded-full"></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-[hsl(var(--secondary))] rounded-full"></div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-[hsl(var(--secondary))] rounded-full"></div>
                  </div>
                </div>

                {/* Hint text */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-xs text-[hsl(var(--secondary))]">
                    拖拽 <span className="text-[hsl(var(--primary))] font-bold">橙色球</span> 调整水平 · 拖拽 <span className="text-[hsl(var(--secondary))] font-bold">灰色球</span> 调整垂直
                  </p>
                </div>

                {/* Reset button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-[hsl(var(--surface))]/80 backdrop-blur rounded-full flex items-center justify-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface))] transition-all">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Shot Type & Distance */}
              <div className="p-4 border-t border-[hsl(var(--outline-variant))]/20 space-y-4">
                {/* Shot Types */}
                <div className="flex gap-2">
                  {shotTypes.map((shot) => (
                    <button
                      key={shot.id}
                      onClick={() => setZoom(parseFloat(shot.zoom))}
                      className={`flex-1 py-3 px-2 rounded-xl text-center transition-all ${
                        Math.abs(zoom - parseFloat(shot.zoom)) < 0.1
                          ? "signature-gradient text-white font-bold"
                          : "bg-[hsl(var(--surface-container-high))] text-[hsl(var(--on-surface))]"
                      }`}
                    >
                      <div className="text-sm">{shot.label}</div>
                      <div className="text-xs opacity-60">{shot.zoom}</div>
                    </button>
                  ))}
                </div>

                {/* Distance Control */}
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-2 border-[hsl(var(--outline-variant))]">
                    <RefreshCw className="w-4 h-4" />
                    初始化角度
                  </Button>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-[hsl(var(--secondary))]">Distance</span>
                    <Slider
                      value={distance}
                      onValueChange={setDistance}
                      max={20}
                      min={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-[hsl(var(--primary))] w-12">{distance[0].toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Task List Preview */}
              <div className="h-48 overflow-y-auto p-4 border-t border-[hsl(var(--outline-variant))]/20">
                <div className="flex items-center gap-2 mb-3">
                  <LayoutList className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <span className="text-sm font-bold">生成任务</span>
                </div>
                <div className="space-y-2">
                  {generationTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--surface-container-high))]/50">
                      {task.status === "processing" && (
                        <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                      )}
                      {task.status === "completed" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className="text-sm flex-1 truncate">{task.name}</span>
                      {task.status === "processing" && (
                        <span className="text-xs text-[hsl(var(--primary))]">45%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--surface))] to-transparent">
            <Button className="w-full py-6 signature-gradient text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity border-0">
              提交任务（消耗2积分）
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[hsl(var(--surface-container-low))] flex flex-col p-6 gap-y-4 z-40">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[hsl(var(--on-surface))]">创作工作室</h1>
          <p className="text-xs text-[hsl(var(--secondary))] font-medium uppercase tracking-widest mt-1">
            创作者工作室
          </p>
        </div>

        {/* New Project Button */}
        <Button className="signature-gradient text-white font-semibold py-3 px-6 rounded-xl mb-6 flex items-center justify-center gap-2 transition-transform active:scale-95 duration-150 border-0">
          <Plus className="w-4 h-4" />
          新建项目
        </Button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? "text-[hsl(var(--primary))] font-semibold bg-[hsl(var(--surface-container-high))]" 
                  : "text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User Section */}
        <div className="pt-6 mt-6 border-t border-[hsl(var(--outline-variant))]/30">
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2 text-[hsl(var(--on-secondary-fixed-variant))] mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>返回控制台</span>
            </Button>
          </Link>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))] transition-colors">
            <Settings className="w-5 h-5" />
            <span>设置</span>
          </a>
          <div className="mt-4 flex items-center gap-3 px-4 py-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="用户" />
              <AvatarFallback>陈</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-[hsl(var(--on-surface))]">陈晓明</p>
              <p className="text-[10px] text-[hsl(var(--secondary))]">专业创作者</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen relative">
        {/* Top Navigation */}
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[hsl(var(--surface-container-lowest))]/80 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-[hsl(var(--outline-variant))]/15">
          <div className="flex items-center gap-8">
            <span className="text-lg font-black text-[hsl(var(--on-surface))]">项目资源</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--secondary))] w-4 h-4" />
              <Input 
                placeholder="搜索资源..." 
                className="pl-10 pr-4 py-1.5 bg-[hsl(var(--surface-container-low))] rounded-lg text-sm border-none focus:ring-0 focus:bg-[hsl(var(--surface-container-lowest))] transition-all w-64"
              />
            </div>
          </div>
          
          {/* Top Tabs */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {topTabs.map((tab) => (
              <a 
                key={tab.id}
                href="#" 
                className={`pb-2 transition-all ${
                  tab.active 
                    ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--on-surface))]">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-4 w-[1px] bg-[hsl(var(--outline-variant))]" />
            <Button variant="ghost" className="text-[hsl(var(--on-surface))] font-medium text-xs hover:bg-[hsl(var(--surface-container-high))]">
              分享
            </Button>
            <Button className="signature-gradient text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 border-0">
              导出视频
            </Button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="pt-24 px-8 pb-12">
          {/* Secondary Navigation Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex bg-[hsl(var(--surface-container-low))] p-1 rounded-xl overflow-x-auto max-w-full">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
                      ? "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-surface))] font-bold" 
                      : "text-[hsl(var(--on-secondary-fixed-variant))] hover:bg-[hsl(var(--surface-container-high))]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2 gap-2 text-xs font-medium text-[hsl(var(--secondary))]">
                <span>排序: 最近</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
              <Button className="bg-[hsl(var(--primary))] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-sm border-0">
                <Trash2 className="w-4 h-4" />
                批量删除
              </Button>
            </div>
          </div>

          {/* Content Area - Switch based on active tab */}
          {activeTab === "scenes" ? (
            /* Scenes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Add New Scene Card */}
              <div 
                onClick={() => setIsDrawerOpen(true)}
                className="aspect-[4/3] bg-[hsl(var(--surface-container))] border-2 border-dashed border-[hsl(var(--outline-variant))] flex flex-col items-center justify-center rounded-xl hover:bg-[hsl(var(--surface-container-low))] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-container-high))] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <span className="text-sm font-bold text-[hsl(var(--on-surface-variant))]">添加新场景</span>
                <span className="text-[10px] text-[hsl(var(--secondary))] mt-1 uppercase tracking-tighter">初始化资源画布</span>
              </div>

              {/* Scene Cards */}
              {scenes.map((scene) => (
                <div 
                  key={scene.id}
                  className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] w-full relative overflow-hidden">
                    <img 
                      src={scene.image} 
                      alt={scene.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge 
                        className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border-0 ${
                          scene.status === "in-use" 
                            ? "bg-[hsl(var(--primary))] text-white" 
                            : "bg-[hsl(var(--surface-container-highest))] text-[hsl(var(--on-secondary-fixed-variant))]"
                        }`}
                      >
                        {scene.status === "in-use" ? "使用中" : "草稿"}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="flex-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                        >
                          {scene.status === "in-use" ? "编辑详情" : "继续工作"}
                        </Button>
                        <Button 
                          variant="secondary"
                          size="icon"
                          className="w-10 bg-white/20 backdrop-blur-md text-white py-2 rounded-lg border border-white/30 hover:bg-white/40 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-extrabold text-[hsl(var(--on-surface))] mb-1">{scene.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[hsl(var(--secondary))] font-medium">修改于 {scene.modified}</span>
                      <Badge variant="secondary" className="text-[10px] bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))] px-2 py-0.5 rounded-full font-bold border-0">
                        {scene.code}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "characters" ? (
            /* Characters Grid - More columns for denser layout */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {/* Add New Character Card */}
              <div 
                className="aspect-[4/5] rounded-lg border-2 border-dashed border-[hsl(var(--outline-variant))] bg-[linear-gradient(180deg,hsl(var(--surface-container))_0%,hsl(var(--surface-container-low))_100%)] p-3.5 transition-all hover:border-[hsl(var(--primary))]/35 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/5"
              >
                <div className="mb-5 pt-2">
                  <h3 className="text-sm font-bold text-[hsl(var(--on-surface))]">添加角色</h3>
                  <p className="mt-1 text-[11px] leading-5 text-[hsl(var(--secondary))]">
                    选择创作方式。
                  </p>
                </div>

                <div className="mt-auto space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl bg-[hsl(var(--surface-container-high))] px-3 py-3 text-left transition-all hover:bg-[hsl(var(--surface-container-highest))]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]">
                        <Wand2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[hsl(var(--on-surface))]">快捷创作</div>
                        <div className="text-[10px] text-[hsl(var(--secondary))]">快速建角色</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--secondary))]" />
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-[hsl(var(--outline-variant))]/60 bg-[hsl(var(--surface))]/75 px-3 py-3 text-left transition-all hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface-container-lowest))]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--secondary-container))] text-[hsl(var(--on-secondary-container))]">
                        <Workflow className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[hsl(var(--on-surface))]">无限画布</div>
                        <div className="text-[10px] text-[hsl(var(--secondary))]">自由编排</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--secondary))]" />
                  </button>
                </div>
              </div>

              {/* Character Cards - Compact version */}
              {characters.map((character) => (
                <div 
                  key={character.id}
                  className="group relative bg-[hsl(var(--surface-container-lowest))] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[hsl(var(--on-surface))]/5 transition-all hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/5] w-full relative overflow-hidden">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge 
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase border-0 ${
                          character.role === "主角" 
                            ? "bg-[hsl(var(--primary))] text-white" 
                            : "bg-[hsl(var(--secondary))] text-white"
                        }`}
                      >
                        {character.role}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--on-surface))]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex gap-1.5 w-full">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="flex-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold py-1.5 rounded-md border border-white/30 hover:bg-white/40 transition-colors h-auto"
                        >
                          编辑
                        </Button>
                        <Button 
                          variant="secondary"
                          size="icon"
                          className="w-7 h-7 bg-white/20 backdrop-blur-md text-white rounded-md border border-white/30 hover:bg-white/40 transition-colors"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-xs font-bold text-[hsl(var(--on-surface))] truncate">{character.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-[hsl(var(--secondary))] truncate max-w-[60%]">{character.style}</span>
                      <span className="text-[9px] text-[hsl(var(--secondary))]">{character.scenes}场景</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Other Tabs Placeholder */
            <div className="flex flex-col items-center justify-center py-24 bg-[hsl(var(--surface-container-low))]/50 rounded-xl border border-dashed border-[hsl(var(--outline-variant))]">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--surface-container))] flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-[hsl(var(--secondary))]" />
              </div>
              <h3 className="text-lg font-bold text-[hsl(var(--on-surface))] mb-2">
                {tabItems.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-[hsl(var(--secondary))]">
                该功能模块正在开发中，敬请期待...
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-1 bg-[hsl(var(--surface-container-low))] p-1.5 rounded-xl">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))] transition-colors"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page 
                      ? "bg-[hsl(var(--primary))] text-white" 
                      : "text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))]"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-high))] transition-colors"
                onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
