/**
 * Project Store - 项目资产状态管理
 * 
 * 职责：
 * 1. 管理项目工作台的所有资产数据（片段、场景、角色、物品）
 * 2. 提供统一的 CRUD 操作
 * 3. 处理 ID 生成、时间戳等通用逻辑
 * 4. 支持未来接入 API 层
 * 
 * 设计原则：
 * - 按领域拆分 actions（episodes, scenes, characters, objects）
 * - 每个领域独立管理，避免互相影响
 * - 保持向后兼容，支持 props 注入（便于测试和 Storybook）
 */

import { create } from 'zustand'
import type {
  Episode,
  EpisodeCreateData,
  Scene,
  SceneCreateData,
  Character,
  CharacterCreateData,
  ObjectItem,
  ObjectCreateData,
  ProjectTab,
} from '@/types'
import {
  initialEpisodes,
  initialScenes,
  initialCharacters,
  initialObjects,
  modelImages,
  objectTypeImages,
  objectTypeLabels,
} from '@/data/initialData'

// ==================== Store State 类型 ====================

interface ProjectState {
  // === 当前激活状态 ===
  activeTab: ProjectTab
  currentPage: number
  
  // === 抽屉/弹框开关状态 ===
  ui: {
    isSceneDrawerOpen: boolean
    isEpisodeDialogOpen: boolean
    isCharacterDrawerOpen: boolean
    isObjectDrawerOpen: boolean
  }
  
  // === 资产数据 ===
  assets: {
    episodes: Episode[]
    scenes: Scene[]
    characters: Character[]
    objects: ObjectItem[]
  }
}

// ==================== Actions 类型 ====================

interface ProjectActions {
  // === Tab 导航 ===
  setActiveTab: (tab: ProjectTab) => void
  setCurrentPage: (page: number) => void
  
  // === UI 控制 ===
  openDrawer: (type: 'scene' | 'episode' | 'character' | 'object') => void
  closeDrawer: (type: 'scene' | 'episode' | 'character' | 'object') => void
  closeAllDrawers: () => void
  
  // === Episodes CRUD ===
  createEpisode: (data: EpisodeCreateData) => Episode
  updateEpisode: (id: number, data: Partial<Episode>) => void
  deleteEpisode: (id: number) => void
  duplicateEpisode: (id: number) => Episode | null
  
  // === Scenes CRUD ===
  createScene: (data: SceneCreateData) => Scene
  updateScene: (id: number, data: Partial<Scene>) => void
  deleteScene: (id: number) => void
  duplicateScene: (id: number) => Scene | null
  
  // === Characters CRUD ===
  createCharacter: (data: CharacterCreateData) => Character
  updateCharacter: (id: number, data: Partial<Character>) => void
  deleteCharacter: (id: number) => void
  duplicateCharacter: (id: number) => Character | null
  
  // === Objects CRUD ===
  createObject: (data: ObjectCreateData) => ObjectItem
  updateObject: (id: number, data: Partial<ObjectItem>) => void
  deleteObject: (id: number) => void
  duplicateObject: (id: number) => ObjectItem | null
  
  // === 批量操作 ===
  bulkDelete: (type: keyof ProjectState['assets'], ids: number[]) => void
  
  // === 数据注入（用于外部控制或测试）===
  setAssets: (type: keyof ProjectState['assets'], data: any[]) => void
  resetToInitial: () => void
}

// ==================== 组合类型 ====================

export type ProjectStore = ProjectState & ProjectActions

// ==================== ID 生成器 ====================

const generateId = (items: { id: number }[]): number => {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}

const generateCode = (prefix: string, id: number): string => {
  return `${prefix}_${String(id).padStart(3, '0')}`
}

// ==================== Store 实现 ====================

const initialState: ProjectState = {
  activeTab: 'scenes',
  currentPage: 1,
  ui: {
    isSceneDrawerOpen: false,
    isEpisodeDialogOpen: false,
    isCharacterDrawerOpen: false,
    isObjectDrawerOpen: false,
  },
  assets: {
    episodes: initialEpisodes,
    scenes: initialScenes,
    characters: initialCharacters,
    objects: initialObjects,
  },
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...initialState,

  // ==================== Tab 导航 ====================
  
  setActiveTab: (tab) => set({ activeTab: tab, currentPage: 1 }),
  
  setCurrentPage: (page) => set({ currentPage: page }),

  // ==================== UI 控制 ====================
  
  openDrawer: (type) => {
    const key = `is${type.charAt(0).toUpperCase() + type.slice(1)}DrawerOpen` as keyof ProjectState['ui']
    set((state) => ({
      ui: { ...state.ui, [key]: true },
    }))
  },
  
  closeDrawer: (type) => {
    const key = `is${type.charAt(0).toUpperCase() + type.slice(1)}DrawerOpen` as keyof ProjectState['ui']
    set((state) => ({
      ui: { ...state.ui, [key]: false },
    }))
  },
  
  closeAllDrawers: () => set({
    ui: {
      isSceneDrawerOpen: false,
      isEpisodeDialogOpen: false,
      isCharacterDrawerOpen: false,
      isObjectDrawerOpen: false,
    },
  }),

  // ==================== Episodes CRUD ====================
  
  createEpisode: (data) => {
    const { episodes } = get().assets
    const newId = generateId(episodes)
    
    const newEpisode: Episode = {
      id: newId,
      name: data.folderName,
      count: Number(data.episodeCount) || 1,
      status: 'draft',
      modified: '刚刚',
      code: generateCode('EP', newId),
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        episodes: [newEpisode, ...state.assets.episodes],
      },
    }))
    
    return newEpisode
  },
  
  updateEpisode: (id, data) => {
    set((state) => ({
      assets: {
        ...state.assets,
        episodes: state.assets.episodes.map((ep) =>
          ep.id === id ? { ...ep, ...data, modified: '刚刚' } : ep
        ),
      },
    }))
  },
  
  deleteEpisode: (id) => {
    set((state) => ({
      assets: {
        ...state.assets,
        episodes: state.assets.episodes.filter((ep) => ep.id !== id),
      },
    }))
  },
  
  duplicateEpisode: (id) => {
    const { episodes } = get().assets
    const episode = episodes.find((e) => e.id === id)
    if (!episode) return null
    
    const newId = generateId(episodes)
    const newEpisode: Episode = {
      ...episode,
      id: newId,
      name: `${episode.name} (复制)`,
      status: 'draft',
      modified: '刚刚',
      code: generateCode('EP', newId),
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        episodes: [newEpisode, ...state.assets.episodes],
      },
    }))
    
    return newEpisode
  },

  // ==================== Scenes CRUD ====================
  
  createScene: (data) => {
    const { scenes } = get().assets
    const newId = generateId(scenes)
    
    const newScene: Scene = {
      id: newId,
      name: data.name,
      image: modelImages[data.model] || modelImages.classic,
      status: data.status,
      modified: '刚刚',
      code: generateCode('SC', newId),
      genMethod: data.genMethod,
      model: data.model,
      description: data.description,
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        scenes: [newScene, ...state.assets.scenes],
      },
    }))
    
    return newScene
  },
  
  updateScene: (id, data) => {
    set((state) => ({
      assets: {
        ...state.assets,
        scenes: state.assets.scenes.map((s) =>
          s.id === id ? { ...s, ...data, modified: '刚刚' } : s
        ),
      },
    }))
  },
  
  deleteScene: (id) => {
    set((state) => ({
      assets: {
        ...state.assets,
        scenes: state.assets.scenes.filter((s) => s.id !== id),
      },
    }))
  },
  
  duplicateScene: (id) => {
    const { scenes } = get().assets
    const scene = scenes.find((s) => s.id === id)
    if (!scene) return null
    
    const newId = generateId(scenes)
    const newScene: Scene = {
      ...scene,
      id: newId,
      name: `${scene.name} (复制)`,
      code: `${scene.code}_COPY`,
      modified: '刚刚',
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        scenes: [newScene, ...state.assets.scenes],
      },
    }))
    
    return newScene
  },

  // ==================== Characters CRUD ====================
  
  createCharacter: (data) => {
    const { characters } = get().assets
    const newId = generateId(characters)
    
    const newCharacter: Character = {
      id: newId,
      name: data.name,
      image: data.referenceImage || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop',
      role: data.role === 'main' ? '主角' : '配角',
      style: data.style || '默认风格',
      scenes: 0,
      gender: data.gender,
      ageGroup: data.ageGroup,
      genMethod: data.genMethod,
      model: data.model,
      description: data.description,
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        characters: [newCharacter, ...state.assets.characters],
      },
    }))
    
    return newCharacter
  },
  
  updateCharacter: (id, data) => {
    set((state) => ({
      assets: {
        ...state.assets,
        characters: state.assets.characters.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      },
    }))
  },
  
  deleteCharacter: (id) => {
    set((state) => ({
      assets: {
        ...state.assets,
        characters: state.assets.characters.filter((c) => c.id !== id),
      },
    }))
  },
  
  duplicateCharacter: (id) => {
    const { characters } = get().assets
    const character = characters.find((c) => c.id === id)
    if (!character) return null
    
    const newId = generateId(characters)
    const newCharacter: Character = {
      ...character,
      id: newId,
      name: `${character.name} (复制)`,
      scenes: 0,
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        characters: [newCharacter, ...state.assets.characters],
      },
    }))
    
    return newCharacter
  },

  // ==================== Objects CRUD ====================
  
  createObject: (data) => {
    const { objects } = get().assets
    const newId = generateId(objects)
    
    const newObject: ObjectItem = {
      id: newId,
      name: data.name,
      image: data.referenceImage || objectTypeImages[data.type] || objectTypeImages.prop,
      type: objectTypeLabels[data.type] || '道具',
      status: 'draft',
      scene: data.scene || '未关联场景',
      modified: '刚刚',
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        objects: [newObject, ...state.assets.objects],
      },
    }))
    
    return newObject
  },
  
  updateObject: (id, data) => {
    set((state) => ({
      assets: {
        ...state.assets,
        objects: state.assets.objects.map((o) =>
          o.id === id ? { ...o, ...data, modified: '刚刚' } : o
        ),
      },
    }))
  },
  
  deleteObject: (id) => {
    set((state) => ({
      assets: {
        ...state.assets,
        objects: state.assets.objects.filter((o) => o.id !== id),
      },
    }))
  },
  
  duplicateObject: (id) => {
    const { objects } = get().assets
    const object = objects.find((o) => o.id === id)
    if (!object) return null
    
    const newId = generateId(objects)
    const newObject: ObjectItem = {
      ...object,
      id: newId,
      name: `${object.name} (复制)`,
      modified: '刚刚',
    }
    
    set((state) => ({
      assets: {
        ...state.assets,
        objects: [newObject, ...state.assets.objects],
      },
    }))
    
    return newObject
  },

  // ==================== 批量操作 ====================
  
  bulkDelete: (type, ids) => {
    set((state) => ({
      assets: {
        ...state.assets,
        [type]: state.assets[type].filter((item: any) => !ids.includes(item.id)),
      },
    }))
  },

  // ==================== 数据注入 ====================
  
  setAssets: (type, data) => {
    set((state) => ({
      assets: {
        ...state.assets,
        [type]: data,
      },
    }))
  },
  
  resetToInitial: () => set({ ...initialState }),
}))

// ==================== Selector Hooks（性能优化）====================

/**
 * 按需选取，避免不必要的重渲染
 * 使用示例：
 * const scenes = useScenesSelector()
 * const { createScene } = useProjectActions()
 */

export const useScenesSelector = () => useProjectStore((state) => state.assets.scenes)
export const useCharactersSelector = () => useProjectStore((state) => state.assets.characters)
export const useObjectsSelector = () => useProjectStore((state) => state.assets.objects)
export const useEpisodesSelector = () => useProjectStore((state) => state.assets.episodes)
export const useActiveTabSelector = () => useProjectStore((state) => state.activeTab)
export const useUIStateSelector = () => useProjectStore((state) => state.ui)
