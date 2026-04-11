import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  Edit3,
  Sparkles,
  Play,
  User,
  Image as ImageIcon,
  Box,
  LayoutGrid,
  Film,
  Pencil,
  Download,
  History,
  Copy,
  Maximize,
  Volume2,
  Pause,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddCharacterDialog } from "@/components/AddCharacterDialog"
import { AddSceneDialog } from "@/components/AddSceneDialog"
import { AddPropDialog } from "@/components/AddPropDialog"

// 工作流步骤
const workflowSteps = [
  { id: "script", label: "剧本摘要", icon: FileText },
  { id: "characters", label: "角色设计", icon: User },
  { id: "scenes", label: "场景设计", icon: ImageIcon },
  { id: "props", label: "道具设计", icon: Box },
  { id: "storyboard", label: "分镜师", icon: LayoutGrid },
  { id: "final", label: "最终成片", icon: Film },
]

// 模拟剧本数据
const mockScript = {
  summary: `ClawHub 的异常波动 画面：极简的桌面特写。K 正在 M5 MacBook Air 上进行沉浸式的 Vibe Coding。屏幕左侧是干净的 Tailwind CSS 组件，右侧是正在运行的 AI 监控面板"龙虾营地 (ClawHub)"。剧情：Auro 的声音如同往常一样温和克制，完美调度着数十个 Agent 节点。Token 消耗平滑，网关状态全绿。K 刚刚完成一个基于 React 的高保真 UI 渲染。变故：毫无预兆地，ClawHub 面板上的 CPU 负载曲线呈现出一种诡异的、违背算法逻辑的几何对称美感。同时，系统后台自动调取了 fnm (Node.js 版本管理器)，开始静默升级所有底层依赖。结尾：K 试图点击暂停，鼠标指针却在屏幕上瞬间解体，化为无数散落的字符。`,
}

// 模拟角色数据
const mockCharacters = [
  {
    id: 1,
    name: "Auro",
    status: "generated",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    name: "K",
    status: "generated",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  },
]

// 顶部导航栏
function TopNav({ 
  projectName, 
  scriptFile, 
  episodeTitle 
}: { 
  projectName: string
  scriptFile: string
  episodeTitle: string 
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 glass-panel border-b border-white/5">
      {/* Left: Logo & Back */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">
            轩晔<span className="font-light text-white/60">OUO</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/5 h-8 px-3"
          asChild
        >
          <Link to="/project/1">
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回剧集列表
          </Link>
        </Button>
      </div>

      {/* Center: Project Info */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/50">{scriptFile}</span>
          <Edit3 className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/70">{projectName}</span>
          <span className="text-white/40 text-xs">9:16</span>
        </div>
        <span className="text-white/40 text-xs mt-0.5">{episodeTitle}</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-white/50" />
          <span className="text-sm text-white/80 font-medium">52</span>
          <span className="text-xs text-white/30">|</span>
          <span className="text-xs text-white/50">充值</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border border-white/20 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  )
}

// 右侧锚点导航
function StepSidebar({ 
  activeSection 
}: { 
  activeSection: string
}) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-2">
        {workflowSteps.map((step) => {
          const isActive = activeSection === step.id
          
          return (
            <button
              key={step.id}
              onClick={() => scrollToSection(step.id)}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? "bg-amber-500 text-black font-medium" 
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                }
              `}
            >
              <span>{step.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 编剧/剧本摘要模块
function ScriptSection({ summary }: { summary: string }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  
  // 解析剧本内容
  const scriptContent = {
    title: summary.match(/^(.*?) 画面：/)?.[1] || "",
    scene: summary.match(/画面：\s*(.+?)(?=剧情：)/s)?.[1]?.trim() || "",
    plot: summary.match(/剧情：\s*(.+?)(?=变故：)/s)?.[1]?.trim() || "",
    twist: summary.match(/变故：\s*(.+?)(?=结尾：)/s)?.[1]?.trim() || "",
    ending: summary.match(/结尾：\s*(.+)$/s)?.[1]?.trim() || "",
  }
  
  return (
    <div id="section-script" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">编剧</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setPreviewOpen(true)}
          >
            <Play className="w-4 h-4 mr-1" />
            预览本集剧本
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Preview Dialog */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#0a0c12] rounded-2xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">剧本摘要</h3>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="bg-[#0d1020] rounded-xl p-6 border border-blue-500/20">
                {/* Title */}
                <h4 className="text-lg font-medium text-white mb-6">
                  {scriptContent.title}
                </h4>
                
                {/* Scene */}
                <div className="mb-6">
                  <span className="text-white/90 font-medium">画面：</span>
                  <span className="text-white/80 leading-relaxed ml-1">
                    {scriptContent.scene}
                  </span>
                </div>
                
                {/* Plot */}
                <div className="mb-6">
                  <span className="text-white/90 font-medium">剧情：</span>
                  <span className="text-white/80 leading-relaxed ml-1">
                    {scriptContent.plot}
                  </span>
                </div>
                
                {/* Twist */}
                <div className="mb-6">
                  <span className="text-white/90 font-medium">变故：</span>
                  <span className="text-white/80 leading-relaxed ml-1">
                    {scriptContent.twist}
                  </span>
                </div>
                
                {/* Ending */}
                <div>
                  <span className="text-white/90 font-medium">结尾：</span>
                  <span className="text-white/80 leading-relaxed ml-1">
                    {scriptContent.ending}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="mb-4">
            <span className="text-xs text-white/40 uppercase tracking-wider">剧本摘要</span>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <p className="text-white/70 leading-relaxed text-sm line-clamp-4">
              {summary}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// 角色设计师模块
function CharacterDesigner({ characters }: { characters: typeof mockCharacters }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddCharacter = (data: { name: string; prompt: string }) => {
    console.log("添加角色:", data)
    // TODO: 调用 API 添加角色
  }
  
  return (
    <div id="section-characters" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">角色设计师</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            size="sm" 
            className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>
      
      {/* Add Character Dialog */}
      <AddCharacterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddCharacter}
      />
      
      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="flex gap-4">
            {characters.map((character) => (
              <div 
                key={character.id} 
                className="group relative w-40 rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all"
              >
                {/* Character Image */}
                <div className="aspect-[2/3] relative">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Generated Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white text-xs">
                    已生成
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-white text-black hover:bg-white/90">
                      查看
                    </Button>
                  </div>
                </div>
                {/* Character Name */}
                <div className="p-3 text-center">
                  <span className="text-white font-medium">{character.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 场景设计模块
function SceneDesigner() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddScene = (data: { name: string; prompt: string; image?: File }) => {
    console.log("添加场景:", data)
    // TODO: 调用 API 添加场景
  }
  
  return (
    <div id="section-scenes" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">场景设计</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            size="sm" 
            className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>
      
      {/* Add Scene Dialog */}
      <AddSceneDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddScene}
      />
      {isExpanded && (
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">暂无场景，点击添加创建</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 道具设计模块
function PropDesigner() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddProp = (data: { name: string; prompt: string; image?: File }) => {
    console.log("添加道具:", data)
    // TODO: 调用 API 添加道具
  }
  
  return (
    <div id="section-props" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">道具设计</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            size="sm" 
            className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>
      
      {/* Add Prop Dialog */}
      <AddPropDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddProp}
      />
      
      {isExpanded && (
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <Box className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">暂无道具，点击添加创建</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 分镜卡片类型
interface StoryboardCard {
  id: number
  title: string
  status: "completed" | "pending" | "generating"
  image?: string
  style: string
  characters: string
  location: string
  cameraScript: string
}

// 分镜师模块
function StoryboardDesigner() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [cards, setCards] = useState<StoryboardCard[]>([
    {
      id: 1,
      title: "分镜 1",
      status: "completed",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop",
      style: "真人-赛博朋克风格",
      characters: "K【@K】、Auro【@Auro】",
      location: "K的工作空间【@K的工作空间】",
      cameraScript: "特写平视...",
    },
    {
      id: 2,
      title: "分镜 2",
      status: "completed",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=600&fit=crop",
      style: "真人-赛博朋克风格",
      characters: "K【@K】",
      location: "K的工作空间【@K的工作空间】",
      cameraScript: "分镜一:特写平视...",
    },
    {
      id: 3,
      title: "分镜 3",
      status: "pending",
      style: "真人-赛博朋克风格",
      characters: "K【@K】、Auro【@Auro】",
      location: "K的工作空间【@K的工作空间】",
      cameraScript: "特写，...",
    },
  ])

  const handleAddCard = (index: number) => {
    const newCard: StoryboardCard = {
      id: Date.now(),
      title: `分镜 ${cards.length + 1}`,
      status: "pending",
      style: "真人-赛博朋克风格",
      characters: "",
      location: "",
      cameraScript: "",
    }
    const newCards = [...cards]
    newCards.splice(index + 1, 0, newCard)
    // 重新编号
    newCards.forEach((card, i) => {
      card.title = `分镜 ${i + 1}`
    })
    setCards(newCards)
  }

  return (
    <div id="section-storyboard" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">分镜师</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            size="sm" 
            className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            生成分镜
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无分镜，生成后在此查看</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {cards.map((card, index) => (
                <div key={card.id} className="flex items-center gap-4">
                  {/* Card */}
                  <div className="group relative w-64 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-xs ${
                      card.status === "completed" 
                        ? "bg-white/20 text-white" 
                        : card.status === "generating"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {card.status === "completed" ? "已完成" : card.status === "generating" ? "生成中" : "待生成"}
                    </div>

                    {/* Image or Placeholder */}
                    <div className="aspect-[4/3] relative bg-black/40">
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <span className="text-white/40 text-sm mb-2">暂无视频</span>
                          {/* Hover Add Button */}
                          <button 
                            onClick={() => handleAddCard(index)}
                            className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white/80 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                      
                      {/* Hover Add Button (for cards with image) */}
                      {card.image && (
                        <button 
                          onClick={() => handleAddCard(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-dashed border-white/30 bg-black/60 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white/80 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 z-20"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-2">{card.title}</h3>
                      <p className="text-xs text-white/50 line-clamp-3">
                        Style: {card.style} characters: {card.characters} location: {card.location} Camera script: {card.cameraScript}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                          <Pencil className="w-3 h-3" />
                          编辑
                        </button>
                        <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {card.status === "completed" ? "重新生成" : "生成"}
                        </button>
                        <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          下载视频
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 最终成片模块
function FinalVideo() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime] = useState(0)
  void currentTime;
  const [duration] = useState(14) // 14秒视频
  const [showSynthesisModal, setShowSynthesisModal] = useState(false)
  
  // 模拟视频数据
  const videoData = {
    poster: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=1067&fit=crop",
    versions: [
      { id: 1, date: "2024-01-15 14:32", duration: "00:14", isActive: true },
      { id: 2, date: "2024-01-15 12:10", duration: "00:14", isActive: false },
      { id: 3, date: "2024-01-14 18:45", duration: "00:14", isActive: false },
    ]
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleSynthesis = () => {
    setShowSynthesisModal(true)
  }
  
  return (
    <div id="section-final" className="glass-panel rounded-2xl overflow-hidden scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-medium text-white">最终成片</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <History className="w-4 h-4 mr-1.5" />
            历史版本
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Copy className="w-4 h-4 mr-1.5" />
            复制视频链接
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-1.5" />
            下载成片
          </Button>
          <Button 
            size="sm" 
            className="bg-amber-500/90 text-black hover:bg-amber-500 font-medium"
            onClick={handleSynthesis}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            合成最终成片
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6">
          {/* Video Player Container */}
          <div className="relative bg-black/60 rounded-2xl overflow-hidden">
            {/* Video */}
            <div className="relative aspect-[9/16] max-w-sm mx-auto">
              <img 
                src={videoData.poster}
                alt="视频封面"
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-105"
                  >
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </button>
                </div>
              )}
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer">
                  <div 
                    className="h-full bg-white/60 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-white/80 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5" fill="currentColor" />
                      )}
                    </button>
                    <button className="text-white hover:text-white/80 transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="text-white/80 text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button className="text-white hover:text-white/80 transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hint Text */}
          <p className="mt-4 text-sm text-white/40">
            可以在右上角切换历史版本，也可以直接下载当前选中的成片。
          </p>
        </div>
      )}
      
      {/* Synthesis Modal */}
      {showSynthesisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#1a1d24] rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">合成最终成片</h3>
              <button 
                onClick={() => setShowSynthesisModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/60 text-sm mb-6">
              确定要开始合成最终成片吗？此过程可能需要几分钟时间。
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowSynthesisModal(false)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                取消
              </Button>
              <Button 
                className="bg-amber-500/90 text-black hover:bg-amber-500 font-medium"
                onClick={() => {
                  setShowSynthesisModal(false)
                  console.log("开始合成...")
                }}
              >
                确认合成
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EpisodeWorkflow() {
  const { projectId, episodeId } = useParams<{ projectId: string; episodeId: string }>()
  void projectId; void episodeId;
  const [activeSection, setActiveSection] = useState("script")
  
  // 模拟数据
  const project = {
    name: "《赛博朋克风格》",
    scriptFile: "覆写协议.txt",
  }
  
  const episode = {
    title: "第一集",
  }

  // 监听滚动，更新当前激活的 section
  useEffect(() => {
    const handleScroll = () => {
      const sections = workflowSteps.map(step => ({
        id: step.id,
        element: document.getElementById(`section-${step.id}`)
      })).filter(s => s.element)

      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element) {
          const offsetTop = section.element.offsetTop
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <TopNav 
        projectName={project.name} 
        scriptFile={project.scriptFile}
        episodeTitle={episode.title}
      />
      
      {/* Right Step Sidebar */}
      <StepSidebar 
        activeSection={activeSection}
      />
      
      {/* Main Content */}
      <main className="pt-20 pb-12 px-8 pr-40">
        <div className="max-w-6xl mx-auto">
          {/* Script Section */}
          <ScriptSection summary={mockScript.summary} />
          
          {/* Character Designer Section */}
          <CharacterDesigner characters={mockCharacters} />
          
          {/* Scene Designer Section */}
          <SceneDesigner />
          
          {/* Prop Designer Section */}
          <PropDesigner />
          
          {/* Storyboard Section */}
          <StoryboardDesigner />
          
          {/* Final Video Section */}
          <FinalVideo />
        </div>
      </main>
    </div>
  )
}
