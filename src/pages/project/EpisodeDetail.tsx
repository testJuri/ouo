import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  CheckCircle2, 
  Users, 
  Image as ImageIcon, 
  Package, 
  Clock,
  MoreHorizontal,
  Wand2,
  Film,
  Sparkles
} from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { useProjectStore } from "@/stores/projectStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock 片段数据
const mockEpisode = {
  id: 1,
  name: "序章：觉醒",
  code: "EP_001",
  status: "in-progress",
  description: "主角在梦中觉醒超能力，发现隐藏的世界真相。这一集将揭示故事的核心设定，为后续剧情埋下伏笔。",
  progress: 65,
  sceneCount: 12,
  modified: "2 小时前",
  created: "2024-03-15",
  duration: "3分45秒",
}

// Mock 关联角色
const relatedCharacters = [
  { id: 1, name: "龙崎真治", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop", role: "主角" },
  { id: 2, name: "月城雪兔", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop", role: "配角" },
  { id: 3, name: "神乐千鹤", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", role: "配角" },
]

// Mock 关联场景
const relatedScenes = [
  { id: 1, name: "赛博街区 7 号扇区", image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?w=300&h=200&fit=crop", shots: 5 },
  { id: 2, name: "黄昏教室 2B", image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=300&h=200&fit=crop", shots: 4 },
  { id: 3, name: "薄雾寺院庭院", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop", shots: 3 },
]

// Mock 关联物品
const relatedObjects = [
  { id: 1, name: "光子武士刀", image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=200&h=200&fit=crop", type: "武器" },
  { id: 2, name: "古董怀表", image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=200&h=200&fit=crop", type: "道具" },
]

// Mock 分镜时间线
const storyboard = [
  { id: 1, scene: "开场", description: "主角在梦中漂浮", duration: "0:15", status: "completed" },
  { id: 2, scene: "转场", description: "意识回归现实", duration: "0:08", status: "completed" },
  { id: 3, scene: "教室内", description: "发现异常能量波动", duration: "0:45", status: "in-progress" },
  { id: 4, scene: "走廊", description: "追逐神秘身影", duration: "0:30", status: "pending" },
  { id: 5, scene: "屋顶", description: "首次展现能力", duration: "1:20", status: "pending" },
  { id: 6, scene: "结尾", description: "接到神秘电话", duration: "0:22", status: "pending" },
]

export default function EpisodeDetail() {
  const { projectId, episodeId } = useParams()
  const { notify } = useFeedback()
  const navigate = useNavigate()
  const { assets, updateEpisode } = useProjectStore()
  
  // 从 store 获取当前片段
  const episode = assets.episodes.find((ep) => ep.id === Number(episodeId))
  
  const handleContinueCreate = () => {
    navigate(`/project/${projectId}/episode/${episodeId}/canvas`)
  }
  
  const handleMarkComplete = () => {
    if (!episode) return
    updateEpisode(episode.id, { status: "completed" })
    notify.success("片段已标记为完成")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500 text-white border-0">已完成</Badge>
      case "in-progress":
        return <Badge className="signature-gradient text-white border-0">进行中</Badge>
      default:
        return <Badge variant="secondary" className="border-0">草稿</Badge>
    }
  }

  const getStoryboardStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-[10px] text-emerald-500 font-medium">✓ 已完成</span>
      case "in-progress":
        return <span className="text-[10px] text-[hsl(var(--primary))] font-medium">⟳ 制作中</span>
      default:
        return <span className="text-[10px] text-[hsl(var(--secondary))] font-medium">○ 待开始</span>
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <Sidebar />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[hsl(var(--surface))]/95 backdrop-blur-sm border-b border-[hsl(var(--outline-variant))]/20">
          <div className="px-8 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/project/${projectId}`)}
                className="text-[hsl(var(--secondary))]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                返回片段列表
              </Button>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-[hsl(var(--on-surface))]">{episode?.name || mockEpisode.name}</h1>
                  {getStatusBadge(episode?.status || mockEpisode.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-[hsl(var(--secondary))]">
                  <span className="font-mono">{episode?.code || mockEpisode.code}</span>
                  <span>·</span>
                  <span>{episode?.count || mockEpisode.sceneCount} 个场景</span>
                  <span>·</span>
                  <span>预计 {mockEpisode.duration}</span>
                  <span>·</span>
                  <span>修改于 {episode?.modified || mockEpisode.modified}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {episode?.status !== "completed" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={handleMarkComplete}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    标记完成
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => notify.info("重命名功能开发中")}>重命名</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => notify.info("复制片段功能开发中")}>复制片段</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => notify.info("导出功能开发中")}>导出</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">删除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Info */}
            <div className="col-span-8 space-y-6">
              {/* Big Create Button */}
              <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6" />
                    <span className="text-sm font-medium opacity-90">AI 辅助创作</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {(episode?.status || mockEpisode.status) === "completed" ? "查看成片" : mockEpisode.progress > 0 ? "继续创作" : "开始创作"}
                  </h2>
                  <p className="text-white/80 mb-6 max-w-md">
                    已完场 {mockEpisode.progress}%，还有 {storyboard.filter(s => s.status !== "completed").length} 个镜头等待制作
                  </p>
                  <Button 
                    size="lg"
                    className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 font-bold px-8 py-6 rounded-xl text-lg"
                    onClick={handleContinueCreate}
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {(episode?.status || mockEpisode.status) === "completed" ? "查看成片" : mockEpisode.progress > 0 ? "继续创作" : "开始创作"}
                  </Button>
                </div>
                {/* Decorative elements */}
                <div className="absolute right-0 top-0 w-64 h-full opacity-20">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="150" cy="100" r="80" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="150" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" />
                    <circle cx="150" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] mb-3 uppercase tracking-wider">剧情简介</h3>
                <p className="text-[hsl(var(--on-surface-variant))] leading-relaxed">
                  {episode?.description || mockEpisode.description}
                </p>
              </div>

              {/* Storyboard Timeline */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] uppercase tracking-wider flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    分镜时间线
                  </h3>
                  <span className="text-xs text-[hsl(var(--secondary))]">
                    {storyboard.filter(s => s.status === "completed").length} / {storyboard.length} 已完成
                  </span>
                </div>
                
                <div className="space-y-3">
                  {storyboard.map((shot, index) => (
                    <div 
                      key={shot.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                        shot.status === "in-progress" 
                          ? "bg-[hsl(var(--surface-container-high))] ring-1 ring-[hsl(var(--primary))]/30" 
                          : "bg-[hsl(var(--surface-container))] hover:bg-[hsl(var(--surface-container-high))]"
                      }`}
                      onClick={() => notify.info(`编辑镜头：${shot.scene}`)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface-container-highest))] flex items-center justify-center text-xs font-bold text-[hsl(var(--secondary))]">
                        {index + 1}
                      </div>
                      <div className="w-16 h-12 rounded-lg bg-[hsl(var(--surface-container-highest))] flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[hsl(var(--secondary))]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[hsl(var(--on-surface))]">{shot.scene}</span>
                          {getStoryboardStatus(shot.status)}
                        </div>
                        <p className="text-xs text-[hsl(var(--secondary))]">{shot.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[hsl(var(--secondary))]">
                        <Clock className="w-3 h-3" />
                        {shot.duration}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 py-3 border-2 border-dashed border-[hsl(var(--outline-variant))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5"
                  onClick={() => notify.info("添加新镜头功能开发中")}
                >
                  + 添加镜头
                </Button>
              </div>
            </div>

            {/* Right Column - Assets */}
            <div className="col-span-4 space-y-6">
              {/* Characters */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    登场角色
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    + 添加
                  </Button>
                </div>
                <div className="space-y-3">
                  {relatedCharacters.map((char) => (
                    <div 
                      key={char.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--surface-container-high))] transition-colors cursor-pointer"
                      onClick={() => notify.info(`查看角色：${char.name}`)}
                    >
                      <img 
                        src={char.image} 
                        alt={char.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[hsl(var(--on-surface))]">{char.name}</p>
                        <p className="text-xs text-[hsl(var(--secondary))]">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenes */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    使用场景
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    + 添加
                  </Button>
                </div>
                <div className="space-y-3">
                  {relatedScenes.map((scene) => (
                    <div 
                      key={scene.id} 
                      className="group cursor-pointer"
                      onClick={() => notify.info(`查看场景：${scene.name}`)}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img 
                          src={scene.image} 
                          alt={scene.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {scene.shots} 镜头
                        </div>
                      </div>
                      <p className="text-xs font-medium text-[hsl(var(--on-surface))] truncate">{scene.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objects */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    道具物品
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    + 添加
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {relatedObjects.map((obj) => (
                    <div 
                      key={obj.id} 
                      className="group cursor-pointer"
                      onClick={() => notify.info(`查看物品：${obj.name}`)}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-1">
                        <img 
                          src={obj.image} 
                          alt={obj.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[10px] text-[hsl(var(--on-surface))] truncate">{obj.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="bg-[hsl(var(--surface-container-low))] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[hsl(var(--on-surface))] mb-4 uppercase tracking-wider">制作进度</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[hsl(var(--secondary))]">总体进度</span>
                      <span className="font-bold text-[hsl(var(--on-surface))]">{mockEpisode.progress}%</span>
                    </div>
                    <div className="h-2 bg-[hsl(var(--surface-container-high))] rounded-full overflow-hidden">
                      <div 
                        className="h-full signature-gradient rounded-full transition-all"
                        style={{ width: `${mockEpisode.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[hsl(var(--surface-container-high))]">
                      <div className="text-lg font-bold text-emerald-500">
                        {storyboard.filter(s => s.status === "completed").length}
                      </div>
                      <div className="text-[10px] text-[hsl(var(--secondary))]">已完成</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[hsl(var(--surface-container-high))]">
                      <div className="text-lg font-bold text-[hsl(var(--primary))]">
                        {storyboard.filter(s => s.status === "in-progress").length}
                      </div>
                      <div className="text-[10px] text-[hsl(var(--secondary))]">制作中</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[hsl(var(--surface-container-high))]">
                      <div className="text-lg font-bold text-[hsl(var(--secondary))]">
                        {storyboard.filter(s => s.status === "pending").length}
                      </div>
                      <div className="text-[10px] text-[hsl(var(--secondary))]">待开始</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
