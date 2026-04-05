/**
 * ProjectDetail - 项目工作台
 * 
 * 重构后职责：
 * 1. 页面布局容器（Sidebar + Header + Content）
 * 2. 弹框/抽屉的渲染控制
 * 3. Tab 切换路由
 * 
 * 状态管理已迁移至：
 * - projectStore.ts: 资产数据（episodes/scenes/characters/objects）
 */

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import ProjectHeader from "@/components/layout/ProjectHeader"
import { useFeedback } from "@/components/feedback/FeedbackProvider"
import { useProjectStore } from "@/stores/projectStore"
import type { ProjectTab } from "@/types"

// Tabs
import ScenesTab from "./tabs/ScenesTab"
import CharactersTab from "./tabs/CharactersTab"
import EpisodesTab from "./tabs/EpisodesTab"
import ObjectsTab from "./tabs/ObjectsTab"
import PlaceholderTab from "./tabs/PlaceholderTab"

// Creators
import SceneCreator from "./SceneCreator"
import EpisodeCreator from "./EpisodeCreator"
import CharacterCreator from "./CharacterCreator"
import ObjectCreator from "./ObjectCreator"

const secondaryTabs: { id: ProjectTab; label: string }[] = [
  { id: "episodes", label: "片段管理" },
  { id: "characters", label: "角色管理" },
  { id: "scenes", label: "场景管理" },
  { id: "objects", label: "物品管理" },
]

export default function ProjectDetail() {
  const { confirm, notify } = useFeedback()
  // 从 Store 获取状态
  const activeTab = useProjectStore((state) => state.activeTab)
  const currentPage = useProjectStore((state) => state.currentPage)
  const ui = useProjectStore((state) => state.ui)
  const assets = useProjectStore((state) => state.assets)
  const { 
    setActiveTab, 
    setCurrentPage, 
    closeDrawer, 
    openDrawer,
    createEpisode,
    createScene,
    createCharacter,
    createObject,
    bulkDelete,
  } = useProjectStore()
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const assetType = useMemo(() => {
    switch (activeTab) {
      case "episodes":
        return "episodes" as const
      case "characters":
        return "characters" as const
      case "scenes":
        return "scenes" as const
      case "objects":
        return "objects" as const
      default:
        return "scenes" as const
    }
  }, [activeTab])

  useEffect(() => {
    setBatchMode(false)
    setSelectedIds([])
  }, [activeTab])

  const handleToggleSelect = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const handleBatchDelete = async () => {
    if (!batchMode) {
      setBatchMode(true)
      return
    }

    if (selectedIds.length === 0) {
      notify.info("请先选择要删除的内容")
      return
    }

    const confirmed = await confirm({
      title: `删除所选${selectedIds.length}项`,
      description: `当前页共 ${assets[assetType].length} 项，删除后无法恢复。确定继续吗？`,
      confirmText: "确认删除",
      tone: "danger",
    })

    if (!confirmed) return

    bulkDelete(assetType, selectedIds)
    notify.success(`已删除 ${selectedIds.length} 项`)
    setSelectedIds([])
    setBatchMode(false)
  }

  // Tab 内容渲染
  const renderTabContent = () => {
    switch (activeTab) {
      case "episodes":
        return (
          <EpisodesTab
            onAddNew={() => openDrawer('episode')}
            batchMode={batchMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )
      case "scenes":
        return (
          <ScenesTab
            onAddNew={() => openDrawer('scene')}
            batchMode={batchMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )
      case "characters":
        return (
          <CharactersTab
            onAddNew={() => openDrawer('character')}
            batchMode={batchMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )
      case "objects":
        return (
          <ObjectsTab
            onAddNew={() => openDrawer('object')}
            batchMode={batchMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )
      default:
        return <PlaceholderTab label={secondaryTabs.find(t => t.id === activeTab)?.label || ""} />
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[hsl(var(--surface))]">
      {/* Episode Creator Dialog */}
      <EpisodeCreator 
        open={ui.isEpisodeDrawerOpen} 
        onOpenChange={(open) => open ? openDrawer('episode') : closeDrawer('episode')} 
        onCreate={createEpisode} 
      />

      {/* Character Creator Drawer */}
      <CharacterCreator 
        open={ui.isCharacterDrawerOpen} 
        onOpenChange={(open) => open ? openDrawer('character') : closeDrawer('character')} 
        onCreate={createCharacter} 
      />

      {/* Scene Creator Drawer */}
      <SceneCreator 
        open={ui.isSceneDrawerOpen} 
        onOpenChange={(open) => open ? openDrawer('scene') : closeDrawer('scene')} 
        onCreate={createScene} 
      />

      {/* Object Creator Drawer */}
      <ObjectCreator 
        open={ui.isObjectDrawerOpen} 
        onOpenChange={(open) => open ? openDrawer('object') : closeDrawer('object')} 
        onCreate={createObject} 
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="relative ml-64 h-screen overflow-hidden">
        {/* Header */}
        <ProjectHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Canvas */}
        <div className="h-full overflow-y-auto px-8 pb-12 pt-24">
          {/* Secondary Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[hsl(var(--secondary))]">排序:</span>
              <div className="flex items-center bg-[hsl(var(--surface-container-low))] rounded-lg px-3 py-2 gap-2 text-xs font-medium text-[hsl(var(--secondary))]">
                <span>最近</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
              {batchMode && (
                <span className="rounded-full bg-[hsl(var(--surface-container-low))] px-3 py-2 text-xs font-medium text-[hsl(var(--primary))]">
                  已选 {selectedIds.length} 项
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {batchMode && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setBatchMode(false)
                    setSelectedIds([])
                  }}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-[hsl(var(--secondary))] hover:bg-[hsl(var(--surface-container-low))]"
                >
                  取消
                </Button>
              )}
              <Button
                onClick={handleBatchDelete}
                className="bg-[hsl(var(--primary))] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-sm border-0"
              >
                <Trash2 className="w-4 h-4" />
                {batchMode ? `删除所选${selectedIds.length ? ` (${selectedIds.length})` : ""}` : "批量删除"}
              </Button>
            </div>
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
