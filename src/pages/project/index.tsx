import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import ProjectHeader from "@/components/layout/ProjectHeader"
import ScenesTab, { Scene } from "./tabs/ScenesTab"
import CharactersTab, { Character } from "./tabs/CharactersTab"
import PlaceholderTab from "@/pages/project/tabs/PlaceholderTab"
import SceneCreator, { SceneCreateData } from "./SceneCreator"
import EpisodeCreator from "./EpisodeCreator"
import EpisodesTab from "./tabs/EpisodesTab"
import CharacterCreator, { CharacterCreateData } from "./CharacterCreator"
import ObjectCreator, { ObjectCreateData } from "./ObjectCreator"
import ObjectsTab, { ObjectItem } from "./tabs/ObjectsTab"

const secondaryTabs = [
  { id: "episodes", label: "片段管理" },
  { id: "characters", label: "角色管理" },
  { id: "scenes", label: "场景管理" },
  { id: "objects", label: "物品管理" },
  { id: "fusion", label: "融合生图" },
  { id: "remix", label: "图片改创" },
]

const initialEpisodes = [
  {
    id: 1,
    name: "序章：觉醒",
    count: 12,
    status: "completed" as const,
    modified: "2 小时前",
    code: "EP_001"
  },
  {
    id: 2,
    name: "第一话：初入学园",
    count: 24,
    status: "in-progress" as const,
    modified: "1 天前",
    code: "EP_002"
  },
  {
    id: 3,
    name: "第二话：黄昏对决",
    count: 18,
    status: "draft" as const,
    modified: "3 小时前",
    code: "EP_003"
  },
]

const initialScenes: Scene[] = [
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

const initialCharacters: Character[] = [
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
  }
]

const initialObjects: ObjectItem[] = [
  {
    id: 1,
    name: "光子武士刀",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop",
    type: "武器",
    status: "in-use",
    scene: "赛博街区 7 号扇区",
    modified: "2 小时前"
  },
  {
    id: 2,
    name: "古董怀表",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=300&h=300&fit=crop",
    type: "道具",
    status: "draft",
    scene: "黄昏教室 2B",
    modified: "1 天前"
  },
  {
    id: 3,
    name: "魔法卷轴",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop",
    type: "道具",
    status: "in-use",
    scene: "薄雾寺院庭院",
    modified: "3 小时前"
  },
  {
    id: 4,
    name: "战术背包",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    type: "服装",
    status: "draft",
    scene: "观测甲板欧米茄",
    modified: "5 天前"
  }
]

export default function ProjectDetail() {
  const [activeTab, setActiveTab] = useState("scenes")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Drawer/Dialog states
  const [isSceneDrawerOpen, setIsSceneDrawerOpen] = useState(false)
  const [isEpisodeDialogOpen, setIsEpisodeDialogOpen] = useState(false)
  const [isCharacterDrawerOpen, setIsCharacterDrawerOpen] = useState(false)
  const [isObjectDrawerOpen, setIsObjectDrawerOpen] = useState(false)
  
  // Data states
  const [episodes, setEpisodes] = useState(initialEpisodes)
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [objects, setObjects] = useState<ObjectItem[]>(initialObjects)

  const handleCreateEpisode = (data: {
    folderName: string
    episodeCount: string
    description: string
  }) => {
    const nextId = episodes.length > 0 ? Math.max(...episodes.map((e) => e.id)) + 1 : 1
    const newEpisode = {
      id: nextId,
      name: data.folderName,
      count: Number(data.episodeCount) || 1,
      status: "draft" as const,
      modified: "刚刚",
      code: `EP_${String(nextId).padStart(3, "0")}`,
    }
    setEpisodes((prev) => [newEpisode, ...prev])
  }

  const handleCreateScene = (data: SceneCreateData) => {
    const nextId = scenes.length > 0 ? Math.max(...scenes.map((s) => s.id)) + 1 : 1
    const modelImages: Record<string, string> = {
      classic: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=600&h=450&fit=crop",
      cyber: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop",
      ink: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=450&fit=crop",
    }
    const newScene: Scene = {
      id: nextId,
      name: data.name,
      image: modelImages[data.model] || modelImages.classic,
      status: data.status,
      modified: "刚刚",
      code: `SC_${String(nextId).padStart(3, "0")}`,
      genMethod: data.genMethod,
      model: data.model,
      description: data.description,
    }
    setScenes((prev) => [newScene, ...prev])
  }

  const handleCreateCharacter = (data: CharacterCreateData) => {
    const nextId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1
    const newCharacter: Character = {
      id: nextId,
      name: data.name,
      image: data.referenceImage || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop",
      role: data.role === "main" ? "主角" : "配角",
      style: data.style || "默认风格",
      scenes: 0,
      gender: data.gender,
      ageGroup: data.ageGroup,
      genMethod: data.genMethod,
      model: data.model,
      description: data.description,
    }
    setCharacters((prev) => [newCharacter, ...prev])
  }

  const handleCreateObject = (data: ObjectCreateData) => {
    const nextId = objects.length > 0 ? Math.max(...objects.map((o) => o.id)) + 1 : 1
    const typeImages: Record<string, string> = {
      weapon: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop",
      prop: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=300&h=300&fit=crop",
      clothing: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      decoration: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop",
    }
    const newObject: ObjectItem = {
      id: nextId,
      name: data.name,
      image: data.referenceImage || typeImages[data.type] || typeImages.prop,
      type: data.type === "weapon" ? "武器" : data.type === "prop" ? "道具" : data.type === "clothing" ? "服装" : "场景装饰",
      status: "draft",
      scene: data.scene || "未关联场景",
      modified: "刚刚",
    }
    setObjects((prev) => [newObject, ...prev])
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "episodes":
        return <EpisodesTab onAddNew={() => setIsEpisodeDialogOpen(true)} episodes={episodes} />
      case "scenes":
        return <ScenesTab onAddNew={() => setIsSceneDrawerOpen(true)} scenes={scenes} onScenesChange={setScenes} />
      case "characters":
        return <CharactersTab onAddNew={() => setIsCharacterDrawerOpen(true)} characters={characters} onCharactersChange={setCharacters} />
      case "objects":
        return <ObjectsTab onAddNew={() => setIsObjectDrawerOpen(true)} objects={objects} onObjectsChange={setObjects} />
      default:
        return <PlaceholderTab label={secondaryTabs.find(t => t.id === activeTab)?.label || ""} />
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      {/* Episode Creator Dialog */}
      <EpisodeCreator open={isEpisodeDialogOpen} onOpenChange={setIsEpisodeDialogOpen} onCreate={handleCreateEpisode} />

      {/* Character Creator Drawer */}
      <CharacterCreator open={isCharacterDrawerOpen} onOpenChange={setIsCharacterDrawerOpen} onCreate={handleCreateCharacter} />

      {/* Scene Creator Drawer */}
      <SceneCreator open={isSceneDrawerOpen} onOpenChange={setIsSceneDrawerOpen} onCreate={handleCreateScene} />

      {/* Object Creator Drawer */}
      <ObjectCreator open={isObjectDrawerOpen} onOpenChange={setIsObjectDrawerOpen} onCreate={handleCreateObject} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen relative">
        {/* Header */}
        <ProjectHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Canvas */}
        <div className="pt-24 px-8 pb-12">
          {/* Secondary Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[hsl(var(--secondary))]">排序:</span>
              <div className="flex items-center bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2 gap-2 text-xs font-medium text-[hsl(var(--secondary))]">
                <span>最近</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
            </div>
            
            <Button 
              onClick={() => alert("批量删除功能开发中")}
              className="bg-[hsl(var(--primary))] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-sm border-0"
            >
              <Trash2 className="w-4 h-4" />
              批量删除
            </Button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-1 bg-[hsl(var(--surface-container-low))] p-1.5 rounded-xl">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 rounded-lg"
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
                  className={`w-8 h-8 rounded-lg text-xs ${currentPage === page ? "bg-[hsl(var(--primary))] text-white" : ""}`}
                >
                  {page}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 rounded-lg"
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
