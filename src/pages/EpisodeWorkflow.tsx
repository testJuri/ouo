import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { message } from "antd"
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
  X,
  RefreshCw,
  Loader2,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddCharacterDialog } from "@/components/AddCharacterDialog"
import { AddSceneDialog } from "@/components/AddSceneDialog"
import { AddPropDialog } from "@/components/AddPropDialog"
import { ScriptPreviewDialog } from "@/components/ScriptPreviewDialog"
import { ouoApi } from "@/api/ouoApi"
import { useEpisodeMonitor } from "@/hooks/useEpisodeMonitor"
import { useAccountInfo } from "@/hooks/useAccountInfo"
import type {
  OuoEpisodeDetail,
  OuoTaskDetail,
  OuoCharacter,
  OuoScene,
  OuoProp,
  OuoShot,
  OuoVideoMergeHistory,
} from "@/api/ouoTypes"

const workflowSteps = [
  { id: "script", label: "剧本摘要", icon: FileText },
  { id: "characters", label: "角色设计", icon: User },
  { id: "scenes", label: "场景设计", icon: ImageIcon },
  { id: "props", label: "道具设计", icon: Box },
  { id: "storyboard", label: "分镜师", icon: LayoutGrid },
  { id: "final", label: "最终成片", icon: Film },
]

function TopNav({ 
  projectName, 
  episodeTitle,
  aspectRatio,
}: { 
  projectName: string
  episodeTitle: string
  aspectRatio: string
}) {
  const { projectId } = useParams<{ projectId: string }>()
  const { accountInfo } = useAccountInfo()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 glass-panel border-b border-white/5">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="font-light text-white/60">OUO</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/5 h-8 px-3"
          asChild
        >
          <Link to={`/project/${projectId}`}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回剧集列表
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-sm">
          <Edit3 className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/70">{projectName}</span>
          <span className="text-white/40 text-xs">{aspectRatio}</span>
        </div>
        <span className="text-white/40 text-xs mt-0.5">{episodeTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-white/50" />
          <span className="text-sm text-white/80 font-medium">{accountInfo?.balance ?? '--'}</span>
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

function StepSidebar({ activeSection }: { activeSection: string }) {
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

function parseScript(summary: string) {
  return {
    title: summary.match(/^(.*?) 画面：/)?.[1] || "",
    scene: summary.match(/画面：\s*(.+?)(?=剧情：)/s)?.[1]?.trim() || "",
    plot: summary.match(/剧情：\s*(.+?)(?=变故：)/s)?.[1]?.trim() || "",
    twist: summary.match(/变故：\s*(.+?)(?=结尾：)/s)?.[1]?.trim() || "",
    ending: summary.match(/结尾：\s*(.+)$/s)?.[1]?.trim() || "",
  }
}

function ScriptSection({ summary }: { summary: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const scriptContent = parseScript(summary)
  
  return (
    <div id="section-script" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
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
      
      <ScriptPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        script={scriptContent}
      />
      
      {isExpanded && (
        <div className="p-6">
          <div className="mb-4">
            <span className="text-xs text-white/40 uppercase tracking-wider">剧本摘要</span>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <p className="text-white/70 leading-relaxed text-sm line-clamp-4">
              {summary || '暂无剧本内容'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CharacterDesigner({
  characters,
  episodeId,
  onRefresh,
}: {
  characters: OuoCharacter[]
  episodeId: number
  onRefresh: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddCharacter = async (data: { name: string; prompt: string }) => {
    try {
      await ouoApi.createCharacter(episodeId, data.name, data.prompt)
      message.success('角色创建成功')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建失败')
    }
  }

  const handleGeneratePic = async (characterId: number) => {
    try {
      await ouoApi.generateCharacterPic(characterId)
      message.success('开始生成角色图片')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '生成失败')
    }
  }
  
  return (
    <div id="section-characters" className="glass-panel rounded-2xl overflow-hidden mb-6 scroll-mt-24">
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
      
      <AddCharacterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddCharacter}
      />
      
      {isExpanded && (
        <div className="p-6">
          {characters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <User className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无角色，请等待生成或手动添加</p>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {characters.map((character) => (
                <div 
                  key={character.characterId} 
                  className="group relative w-40 rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="aspect-[2/3] relative">
                    {character.characterImage ? (
                      <img 
                        src={character.characterImage} 
                        alt={character.characterName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <User className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs ${
                      character.generationStatus === 'SUCCESS'
                        ? 'bg-white/20 backdrop-blur-sm text-white'
                        : character.generationStatus === 'RUNNING'
                        ? 'bg-yellow-500/20 backdrop-blur-sm text-yellow-400'
                        : character.generationStatus === 'FAILED'
                        ? 'bg-red-500/20 backdrop-blur-sm text-red-400'
                        : 'bg-white/10 backdrop-blur-sm text-white/60'
                    }`}>
                      {character.generationStatus === 'SUCCESS' ? '已生成' 
                        : character.generationStatus === 'RUNNING' ? '生成中...'
                        : character.generationStatus === 'FAILED' ? '失败'
                        : '待生成'}
                    </div>
                    {!character.characterImage && character.generationStatus !== 'RUNNING' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          size="sm" 
                          className="bg-white text-black hover:bg-white/90"
                          onClick={(e) => { e.stopPropagation(); handleGeneratePic(character.characterId) }}
                        >
                          生成图片
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-white font-medium text-sm">{character.characterName}</span>
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

function SceneDesigner({
  scenes,
  episodeId,
  onRefresh,
}: {
  scenes: OuoScene[]
  episodeId: number
  onRefresh: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddScene = async (data: { name: string; prompt: string; image?: File }) => {
    try {
      await ouoApi.createScene(episodeId, data.name, data.prompt)
      message.success('场景创建成功')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建失败')
    }
  }

  const handleGenerateScenePic = async (sceneId: number) => {
    try {
      await ouoApi.generateScenePic(sceneId)
      message.success('开始生成场景图片')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '生成失败')
    }
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
      
      <AddSceneDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddScene}
      />

      {isExpanded && (
        <div className="p-6">
          {scenes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无场景，请等待生成或手动添加</p>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {scenes.map((scene) => (
                <div 
                  key={scene.sceneId}
                  className="group relative w-48 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="aspect-[16/9] relative">
                    {scene.sceneImage ? (
                      <img src={scene.sceneImage} alt={scene.location} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <ImageIcon className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs ${
                      scene.generationStatus === 'SUCCESS' ? 'bg-white/20 text-white'
                        : scene.generationStatus === 'RUNNING' ? 'bg-yellow-500/20 text-yellow-400'
                        : scene.generationStatus === 'FAILED' ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {scene.generationStatus === 'SUCCESS' ? '已生成'
                        : scene.generationStatus === 'RUNNING' ? '生成中...'
                        : scene.generationStatus === 'FAILED' ? '失败'
                        : '待生成'}
                    </div>
                    {!scene.sceneImage && scene.generationStatus !== 'RUNNING' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          size="sm" 
                          className="bg-white text-black hover:bg-white/90"
                          onClick={() => handleGenerateScenePic(scene.sceneId)}
                        >
                          生成图片
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="text-white font-medium text-sm">{scene.location}</span>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{scene.description}</p>
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

function PropDesigner({
  props,
  episodeId,
  onRefresh,
}: {
  props: OuoProp[]
  episodeId: number
  onRefresh: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleAddProp = async (data: { name: string; prompt: string; image?: File }) => {
    try {
      await ouoApi.createProp(episodeId, data.name, data.prompt)
      message.success('道具创建成功')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '创建失败')
    }
  }

  const handleRegenerateProp = async (propId: number) => {
    try {
      await ouoApi.regenerateProp(propId)
      message.success('开始重新生成道具')
      onRefresh()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '生成失败')
    }
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
      
      <AddPropDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleAddProp}
      />
      
      {isExpanded && (
        <div className="p-6">
          {props.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <Box className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无道具，请等待生成或手动添加</p>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {props.map((prop) => (
                <div 
                  key={prop.propId}
                  className="group relative w-40 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="aspect-square relative">
                    {prop.propImage ? (
                      <img src={prop.propImage} alt={prop.propName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Box className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs ${
                      prop.generationStatus === 'SUCCESS' ? 'bg-white/20 text-white'
                        : prop.generationStatus === 'RUNNING' ? 'bg-yellow-500/20 text-yellow-400'
                        : prop.generationStatus === 'FAILED' ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {prop.generationStatus === 'SUCCESS' ? '已生成'
                        : prop.generationStatus === 'RUNNING' ? '生成中...'
                        : prop.generationStatus === 'FAILED' ? '失败'
                        : '待生成'}
                    </div>
                    {prop.generationStatus !== 'RUNNING' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          size="sm" 
                          className="bg-white text-black hover:bg-white/90"
                          onClick={() => handleRegenerateProp(prop.propId)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          重新生成
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-white font-medium text-sm">{prop.propName}</span>
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

function StoryboardDesigner({
  episodeId,
  shots,
  onRefreshShots,
}: {
  episodeId: number
  shots: OuoShot[]
  onRefreshShots: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSplitting, setIsSplitting] = useState(false)
  const [isBatchGenerating, setIsBatchGenerating] = useState(false)

  const handleSplitShots = async () => {
    setIsSplitting(true)
    try {
      await ouoApi.splitEpisodeShots(episodeId)
      message.success('分镜拆分已开始')
      onRefreshShots()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '拆分失败')
    } finally {
      setIsSplitting(false)
    }
  }

  const handleBatchGenerate = async () => {
    setIsBatchGenerating(true)
    try {
      await ouoApi.batchGenerateShots(episodeId)
      message.success('批量生成已开始')
      onRefreshShots()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '批量生成失败')
    } finally {
      setIsBatchGenerating(false)
    }
  }

  const handleRegenerateShot = async (shotId: number) => {
    try {
      await ouoApi.regenerateShot(shotId)
      message.success('开始重新生成分镜')
      onRefreshShots()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '重新生成失败')
    }
  }

  const handleAddShot = async (shotId: number) => {
    try {
      await ouoApi.addShot(shotId, 'after')
      message.success('分镜已添加')
      onRefreshShots()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '添加失败')
    }
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
          {shots.length === 0 ? (
            <Button 
              size="sm" 
              className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
              onClick={handleSplitShots}
              disabled={isSplitting}
            >
              {isSplitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
              拆分分镜
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-white/10 text-white hover:bg-white/15 border border-white/10"
              onClick={handleBatchGenerate}
              disabled={isBatchGenerating}
            >
              {isBatchGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
              批量生成
            </Button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="p-6">
          {shots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无分镜，点击"拆分分镜"开始</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {shots.map((shot) => (
                <div key={shot.shotId} className="flex items-center gap-4">
                  <div className="group relative w-64 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    <div className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-xs ${
                      shot.videoStatus === 'SUCCESS' 
                        ? "bg-white/20 text-white" 
                        : shot.videoStatus === 'RUNNING'
                        ? "bg-yellow-500/20 text-yellow-400"
                        : shot.videoStatus === 'FAILED'
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {shot.videoStatus === 'SUCCESS' ? '已完成' 
                        : shot.videoStatus === 'RUNNING' ? '生成中' 
                        : shot.videoStatus === 'FAILED' ? '失败'
                        : '待生成'}
                    </div>

                    <div className="aspect-[4/3] relative bg-black/40">
                      {shot.videoUrl ? (
                        <video 
                          src={shot.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <span className="text-white/40 text-sm mb-2">暂无视频</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleAddShot(shot.shotId)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-dashed border-white/30 bg-black/60 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white/80 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 z-20"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-medium mb-2">分镜 {shot.shotSeq}</h3>
                      {shot.videoPrompt && (
                        <p className="text-xs text-white/50 line-clamp-3">{shot.videoPrompt}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <button className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                          <Pencil className="w-3 h-3" />
                          编辑
                        </button>
                        <button 
                          className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                          onClick={() => handleRegenerateShot(shot.shotId)}
                        >
                          <RefreshCw className="w-3 h-3" />
                          重新生成
                        </button>
                        {shot.videoUrl && (
                          <a 
                            href={shot.videoUrl} 
                            download 
                            className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            下载
                          </a>
                        )}
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

function FinalVideo({
  episodeId,
  episodeDetail,
}: {
  episodeId: number
  episodeDetail: OuoEpisodeDetail | null
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSynthesisModal, setShowSynthesisModal] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [mergeHistory, setMergeHistory] = useState<OuoVideoMergeHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  
  const fetchHistory = useCallback(async () => {
    try {
      const data = await ouoApi.getVideoMergeHistory(episodeId)
      setMergeHistory(data)
    } catch {
      // ignore
    }
  }, [episodeId])

  const handleSynthesis = async () => {
    setIsMerging(true)
    setShowSynthesisModal(false)
    try {
      await ouoApi.mergeEpisodeVideo(episodeId)
      message.success('开始合成最终成片')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '合成失败')
    } finally {
      setIsMerging(false)
    }
  }

  const handleCopyLink = () => {
    const url = episodeDetail?.videoUrl
    if (url) {
      navigator.clipboard.writeText(url)
      message.success('视频链接已复制')
    } else {
      message.warning('暂无视频链接')
    }
  }

  const videoUrl = episodeDetail?.videoUrl
  
  return (
    <div id="section-final" className="glass-panel rounded-2xl overflow-hidden scroll-mt-24">
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
            onClick={() => { fetchHistory(); setShowHistory(true) }}
          >
            <History className="w-4 h-4 mr-1.5" />
            历史版本
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 mr-1.5" />
            复制视频链接
          </Button>
          {videoUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              asChild
            >
              <a href={videoUrl} download>
                <Download className="w-4 h-4 mr-1.5" />
                下载成片
              </a>
            </Button>
          )}
          <Button 
            size="sm" 
            className="bg-amber-500/90 text-black hover:bg-amber-500 font-medium"
            onClick={() => setShowSynthesisModal(true)}
            disabled={isMerging}
          >
            {isMerging ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
            合成最终成片
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6">
          {videoUrl ? (
            <div className="relative bg-black/60 rounded-2xl overflow-hidden">
              <div className="relative aspect-[9/16] max-w-sm mx-auto">
                <video 
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls={isPlaying}
                  poster={episodeDetail?.cover}
                />
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
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <Film className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">暂无成片，请先完成分镜生成后合成</p>
            </div>
          )}
        </div>
      )}
      
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
                onClick={handleSynthesis}
              >
                确认合成
              </Button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#1a1d24] rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">历史版本</h3>
              <button onClick={() => setShowHistory(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {mergeHistory.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-8">暂无历史版本</p>
            ) : (
              <div className="space-y-3">
                {mergeHistory.map((h) => (
                  <div key={h.historyId} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        h.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400'
                          : h.status === 'RUNNING' ? 'bg-yellow-500/20 text-yellow-400'
                          : h.status === 'FAILED' ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/10 text-white/60'
                      }`}>{h.status}</span>
                      <span className="text-white/40 text-xs ml-2">
                        {new Date(h.createdAt * 1000).toLocaleString()}
                      </span>
                    </div>
                    {h.mergeUrl && h.status === 'SUCCESS' && (
                      <a href={h.mergeUrl} download className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        下载
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EpisodeWorkflow() {
  const { projectId, episodeId: episodeIdParam } = useParams<{ projectId: string; episodeId: string }>()
  const episodeId = Number(episodeIdParam)
  const taskId = Number(projectId)

  const [activeSection, setActiveSection] = useState("script")
  const [taskDetail, setTaskDetail] = useState<OuoTaskDetail | null>(null)
  const [episodeDetail, setEpisodeDetail] = useState<OuoEpisodeDetail | null>(null)
  const [shots, setShots] = useState<OuoShot[]>([])
  const [loading, setLoading] = useState(true)

  const { monitor, refresh: refreshMonitor, startPolling } = useEpisodeMonitor(episodeId)

  const fetchShots = useCallback(async () => {
    if (!episodeId) return
    try {
      const data = await ouoApi.getEpisodeShots(episodeId)
      setShots(data)
    } catch {
      // ignore
    }
  }, [episodeId])

  const fetchEpisodeDetail = useCallback(async () => {
    if (!episodeId) return
    try {
      const data = await ouoApi.getEpisodeDetail(episodeId)
      setEpisodeDetail(data)
    } catch {
      // ignore
    }
  }, [episodeId])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const promises: Promise<unknown>[] = [fetchEpisodeDetail(), fetchShots()]
      if (taskId) {
        promises.push(
          ouoApi.getTaskDetail(taskId).then(setTaskDetail).catch(() => {})
        )
      }
      await Promise.all(promises)
      setLoading(false)
    }
    init()
  }, [taskId, episodeId, fetchEpisodeDetail, fetchShots])

  const handleAutoProcess = async () => {
    try {
      await ouoApi.autoProcessEpisode(episodeId)
      message.success('一键创作已启动')
      refreshMonitor()
      startPolling()
    } catch (err) {
      message.error(err instanceof Error ? err.message : '启动失败')
    }
  }

  const handleRefresh = () => {
    refreshMonitor()
    fetchShots()
    fetchEpisodeDetail()
  }

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
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <TopNav 
        projectName={taskDetail?.title || '项目'}
        episodeTitle={episodeDetail?.title || '剧集'}
        aspectRatio={taskDetail?.aspectRatio || episodeDetail?.aspectRatio || ''}
      />
      
      <StepSidebar activeSection={activeSection} />
      
      <main className="pt-20 pb-12 px-8 pr-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-end mb-4">
            <Button
              size="sm"
              className="bg-amber-500/90 text-black hover:bg-amber-500 font-medium"
              onClick={handleAutoProcess}
            >
              <Zap className="w-4 h-4 mr-1" />
              一键创作
            </Button>
          </div>

          <ScriptSection summary={episodeDetail?.content || ''} />
          
          <CharacterDesigner 
            characters={monitor?.characters || []} 
            episodeId={episodeId}
            onRefresh={handleRefresh}
          />
          
          <SceneDesigner 
            scenes={monitor?.scenes || []}
            episodeId={episodeId}
            onRefresh={handleRefresh}
          />
          
          <PropDesigner 
            props={monitor?.props || []}
            episodeId={episodeId}
            onRefresh={handleRefresh}
          />
          
          <StoryboardDesigner 
            episodeId={episodeId}
            shots={shots}
            onRefreshShots={fetchShots}
          />
          
          <FinalVideo
            episodeId={episodeId}
            episodeDetail={episodeDetail}
          />
        </div>
      </main>
    </div>
  )
}
