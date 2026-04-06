/**
 * 模拟项目 API 层
 * 
 * 设计原则：
 * 1. 模拟真实 API 的异步行为（延迟、错误处理）
 * 2. 数据持久化到 localStorage
 * 3. 统一的响应格式 { success, data, message }
 * 4. 便于后续替换为真实 HTTP API
 * 
 * 使用方式：
 * import { projectApi } from '@/api/projectApi'
 * const { data } = await projectApi.episodes.getAll()
 */

import type { 
  Episode, EpisodeCreateData,
  Scene, SceneCreateData,
  Character, CharacterCreateData,
  ObjectItem, ObjectCreateData,
} from '@/types'
import { 
  getStorageItems, 
  setStorageItems,
} from '@/utils/storage'

// ============ 模拟延迟配置 ============
const MOCK_DELAY = 300 // 模拟网络延迟 ms

// 模拟延迟函数
const delay = (ms: number = MOCK_DELAY) => 
  new Promise(resolve => setTimeout(resolve, ms))

// 统一响应格式
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 成功响应
const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
})

// 错误响应
const errorResponse = <T>(message: string, fallbackData: T): ApiResponse<T> => ({
  success: false,
  data: fallbackData,
  message,
})

// ============ ID 生成器 ============
const generateId = (items: { id: number }[]): number => {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}

const generateCode = (prefix: string, id: number): string => {
  return `${prefix}_${String(id).padStart(3, '0')}`
}

// ============ Episodes API ============
export const episodesApi = {
  /** 获取所有片段 */
  async getAll(): Promise<ApiResponse<Episode[]>> {
    await delay()
    try {
      const episodes = getStorageItems('episodes')
      return successResponse(episodes)
    } catch (error) {
      return errorResponse('获取片段列表失败', [])
    }
  },

  /** 获取单个片段 */
  async getById(id: number): Promise<ApiResponse<Episode | null>> {
    await delay()
    try {
      const episodes = getStorageItems('episodes')
      const episode = episodes.find(e => e.id === id) || null
      return successResponse(episode)
    } catch (error) {
      return errorResponse('获取片段详情失败', null)
    }
  },

  /** 创建片段 */
  async create(data: EpisodeCreateData): Promise<ApiResponse<Episode>> {
    await delay(500)
    try {
      const episodes = getStorageItems('episodes')
      const newId = generateId(episodes)
      
      const newEpisode: Episode = {
        id: newId,
        name: data.folderName,
        count: Number(data.episodeCount) || 1,
        status: 'draft',
        modified: '刚刚',
        code: generateCode('EP', newId),
        description: data.description,
      }
      
      const updatedEpisodes = [newEpisode, ...episodes]
      setStorageItems('episodes', updatedEpisodes)
      
      return successResponse(newEpisode)
    } catch (error) {
      return errorResponse('创建片段失败', {} as Episode)
    }
  },

  /** 更新片段 */
  async update(id: number, data: Partial<Episode>): Promise<ApiResponse<Episode | null>> {
    await delay(400)
    try {
      const episodes = getStorageItems('episodes')
      let updatedEpisode: Episode | null = null
      
      const updatedEpisodes = episodes.map(ep => {
        if (ep.id === id) {
          updatedEpisode = { ...ep, ...data, modified: '刚刚' }
          return updatedEpisode
        }
        return ep
      })
      
      setStorageItems('episodes', updatedEpisodes)
      return successResponse(updatedEpisode)
    } catch (error) {
      return errorResponse('更新片段失败', null)
    }
  },

  /** 删除片段 */
  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const episodes = getStorageItems('episodes')
      const updatedEpisodes = episodes.filter(ep => ep.id !== id)
      setStorageItems('episodes', updatedEpisodes)
      return successResponse(true)
    } catch (error) {
      return errorResponse('删除片段失败', false)
    }
  },

  /** 复制片段 */
  async duplicate(id: number): Promise<ApiResponse<Episode | null>> {
    await delay(500)
    try {
      const episodes = getStorageItems('episodes')
      const episode = episodes.find(e => e.id === id)
      if (!episode) return successResponse(null)
      
      const newId = generateId(episodes)
      const newEpisode: Episode = {
        ...episode,
        id: newId,
        name: `${episode.name} (复制)`,
        status: 'draft',
        modified: '刚刚',
        code: generateCode('EP', newId),
      }
      
      const updatedEpisodes = [newEpisode, ...episodes]
      setStorageItems('episodes', updatedEpisodes)
      
      return successResponse(newEpisode)
    } catch (error) {
      return errorResponse('复制片段失败', null)
    }
  },
}

// ============ Scenes API ============
export const scenesApi = {
  /** 获取所有场景 */
  async getAll(): Promise<ApiResponse<Scene[]>> {
    await delay()
    try {
      const scenes = getStorageItems('scenes')
      return successResponse(scenes)
    } catch (error) {
      return errorResponse('获取场景列表失败', [])
    }
  },

  /** 获取单个场景 */
  async getById(id: number): Promise<ApiResponse<Scene | null>> {
    await delay()
    try {
      const scenes = getStorageItems('scenes')
      const scene = scenes.find(s => s.id === id) || null
      return successResponse(scene)
    } catch (error) {
      return errorResponse('获取场景详情失败', null)
    }
  },

  /** 创建场景 */
  async create(data: SceneCreateData): Promise<ApiResponse<Scene>> {
    await delay(500)
    try {
      const scenes = getStorageItems('scenes')
      const newId = generateId(scenes)
      
      // 动态导入以避免循环依赖
      const { modelImages } = await import('@/data/initialData')
      
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
      
      const updatedScenes = [newScene, ...scenes]
      setStorageItems('scenes', updatedScenes)
      
      return successResponse(newScene)
    } catch (error) {
      return errorResponse('创建场景失败', {} as Scene)
    }
  },

  /** 更新场景 */
  async update(id: number, data: Partial<Scene>): Promise<ApiResponse<Scene | null>> {
    await delay(400)
    try {
      const scenes = getStorageItems('scenes')
      let updatedScene: Scene | null = null
      
      const updatedScenes = scenes.map(s => {
        if (s.id === id) {
          updatedScene = { ...s, ...data, modified: '刚刚' }
          return updatedScene
        }
        return s
      })
      
      setStorageItems('scenes', updatedScenes)
      return successResponse(updatedScene)
    } catch (error) {
      return errorResponse('更新场景失败', null)
    }
  },

  /** 删除场景 */
  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const scenes = getStorageItems('scenes')
      const updatedScenes = scenes.filter(s => s.id !== id)
      setStorageItems('scenes', updatedScenes)
      return successResponse(true)
    } catch (error) {
      return errorResponse('删除场景失败', false)
    }
  },

  /** 复制场景 */
  async duplicate(id: number): Promise<ApiResponse<Scene | null>> {
    await delay(500)
    try {
      const scenes = getStorageItems('scenes')
      const scene = scenes.find(s => s.id === id)
      if (!scene) return successResponse(null)
      
      const newId = generateId(scenes)
      const newScene: Scene = {
        ...scene,
        id: newId,
        name: `${scene.name} (复制)`,
        code: `${scene.code}_COPY`,
        modified: '刚刚',
      }
      
      const updatedScenes = [newScene, ...scenes]
      setStorageItems('scenes', updatedScenes)
      
      return successResponse(newScene)
    } catch (error) {
      return errorResponse('复制场景失败', null)
    }
  },
}

// ============ Characters API ============
export const charactersApi = {
  /** 获取所有角色 */
  async getAll(): Promise<ApiResponse<Character[]>> {
    await delay()
    try {
      const characters = getStorageItems('characters')
      return successResponse(characters)
    } catch (error) {
      return errorResponse('获取角色列表失败', [])
    }
  },

  /** 获取单个角色 */
  async getById(id: number): Promise<ApiResponse<Character | null>> {
    await delay()
    try {
      const characters = getStorageItems('characters')
      const character = characters.find(c => c.id === id) || null
      return successResponse(character)
    } catch (error) {
      return errorResponse('获取角色详情失败', null)
    }
  },

  /** 创建角色 */
  async create(data: CharacterCreateData): Promise<ApiResponse<Character>> {
    await delay(500)
    try {
      const characters = getStorageItems('characters')
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
      
      const updatedCharacters = [newCharacter, ...characters]
      setStorageItems('characters', updatedCharacters)
      
      return successResponse(newCharacter)
    } catch (error) {
      return errorResponse('创建角色失败', {} as Character)
    }
  },

  /** 更新角色 */
  async update(id: number, data: Partial<Character>): Promise<ApiResponse<Character | null>> {
    await delay(400)
    try {
      const characters = getStorageItems('characters')
      let updatedCharacter: Character | null = null
      
      const updatedCharacters = characters.map(c => {
        if (c.id === id) {
          updatedCharacter = { ...c, ...data }
          return updatedCharacter
        }
        return c
      })
      
      setStorageItems('characters', updatedCharacters)
      return successResponse(updatedCharacter)
    } catch (error) {
      return errorResponse('更新角色失败', null)
    }
  },

  /** 删除角色 */
  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const characters = getStorageItems('characters')
      const updatedCharacters = characters.filter(c => c.id !== id)
      setStorageItems('characters', updatedCharacters)
      return successResponse(true)
    } catch (error) {
      return errorResponse('删除角色失败', false)
    }
  },

  /** 复制角色 */
  async duplicate(id: number): Promise<ApiResponse<Character | null>> {
    await delay(500)
    try {
      const characters = getStorageItems('characters')
      const character = characters.find(c => c.id === id)
      if (!character) return successResponse(null)
      
      const newId = generateId(characters)
      const newCharacter: Character = {
        ...character,
        id: newId,
        name: `${character.name} (复制)`,
        scenes: 0,
      }
      
      const updatedCharacters = [newCharacter, ...characters]
      setStorageItems('characters', updatedCharacters)
      
      return successResponse(newCharacter)
    } catch (error) {
      return errorResponse('复制角色失败', null)
    }
  },
}

// ============ Objects API ============
export const objectsApi = {
  /** 获取所有物品 */
  async getAll(): Promise<ApiResponse<ObjectItem[]>> {
    await delay()
    try {
      const objects = getStorageItems('objects')
      return successResponse(objects)
    } catch (error) {
      return errorResponse('获取物品列表失败', [])
    }
  },

  /** 获取单个物品 */
  async getById(id: number): Promise<ApiResponse<ObjectItem | null>> {
    await delay()
    try {
      const objects = getStorageItems('objects')
      const object = objects.find(o => o.id === id) || null
      return successResponse(object)
    } catch (error) {
      return errorResponse('获取物品详情失败', null)
    }
  },

  /** 创建物品 */
  async create(data: ObjectCreateData): Promise<ApiResponse<ObjectItem>> {
    await delay(500)
    try {
      const objects = getStorageItems('objects')
      const newId = generateId(objects)
      
      // 动态导入以避免循环依赖
      const { objectTypeImages } = await import('@/data/initialData')
      
      const newObject: ObjectItem = {
        id: newId,
        name: data.name,
        image: data.referenceImage || objectTypeImages.prop,
        type: data.genMethod === 'model' ? 'AI生成' : '上传',
        status: 'draft',
        scene: '未关联场景',
        modified: '刚刚',
      }
      
      const updatedObjects = [newObject, ...objects]
      setStorageItems('objects', updatedObjects)
      
      return successResponse(newObject)
    } catch (error) {
      return errorResponse('创建物品失败', {} as ObjectItem)
    }
  },

  /** 更新物品 */
  async update(id: number, data: Partial<ObjectItem>): Promise<ApiResponse<ObjectItem | null>> {
    await delay(400)
    try {
      const objects = getStorageItems('objects')
      let updatedObject: ObjectItem | null = null
      
      const updatedObjects = objects.map(o => {
        if (o.id === id) {
          updatedObject = { ...o, ...data, modified: '刚刚' }
          return updatedObject
        }
        return o
      })
      
      setStorageItems('objects', updatedObjects)
      return successResponse(updatedObject)
    } catch (error) {
      return errorResponse('更新物品失败', null)
    }
  },

  /** 删除物品 */
  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const objects = getStorageItems('objects')
      const updatedObjects = objects.filter(o => o.id !== id)
      setStorageItems('objects', updatedObjects)
      return successResponse(true)
    } catch (error) {
      return errorResponse('删除物品失败', false)
    }
  },

  /** 复制物品 */
  async duplicate(id: number): Promise<ApiResponse<ObjectItem | null>> {
    await delay(500)
    try {
      const objects = getStorageItems('objects')
      const object = objects.find(o => o.id === id)
      if (!object) return successResponse(null)
      
      const newId = generateId(objects)
      const newObject: ObjectItem = {
        ...object,
        id: newId,
        name: `${object.name} (复制)`,
        modified: '刚刚',
      }
      
      const updatedObjects = [newObject, ...objects]
      setStorageItems('objects', updatedObjects)
      
      return successResponse(newObject)
    } catch (error) {
      return errorResponse('复制物品失败', null)
    }
  },
}

// ============ 统一导出 ============
export const projectApi = {
  episodes: episodesApi,
  scenes: scenesApi,
  characters: charactersApi,
  objects: objectsApi,
}

// 默认导出
export default projectApi
