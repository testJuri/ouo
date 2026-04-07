import type { Scene, SceneCreateData } from '@/types'
import {
  delay,
  errorResponse,
  generateCode,
  generateId,
  getStorageItems,
  setStorageItems,
  successResponse,
} from './shared'
import type { ApiResponse } from './shared'

export const scenesApi = {
  async getAll(): Promise<ApiResponse<Scene[]>> {
    await delay()
    try {
      const scenes = getStorageItems('scenes')
      return successResponse(scenes)
    } catch {
      return errorResponse('获取场景列表失败', [])
    }
  },

  async getById(id: number): Promise<ApiResponse<Scene | null>> {
    await delay()
    try {
      const scenes = getStorageItems('scenes')
      const scene = scenes.find((item) => item.id === id) || null
      return successResponse(scene)
    } catch {
      return errorResponse('获取场景详情失败', null)
    }
  },

  async create(data: SceneCreateData): Promise<ApiResponse<Scene>> {
    await delay(500)
    try {
      const scenes = getStorageItems('scenes')
      const newId = generateId(scenes)
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
    } catch {
      return errorResponse('创建场景失败', {} as Scene)
    }
  },

  async update(id: number, data: Partial<Scene>): Promise<ApiResponse<Scene | null>> {
    await delay(400)
    try {
      const scenes = getStorageItems('scenes')
      let updatedScene: Scene | null = null

      const updatedScenes = scenes.map((scene) => {
        if (scene.id === id) {
          updatedScene = { ...scene, ...data, modified: '刚刚' }
          return updatedScene
        }
        return scene
      })

      setStorageItems('scenes', updatedScenes)
      return successResponse(updatedScene)
    } catch {
      return errorResponse('更新场景失败', null)
    }
  },

  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const scenes = getStorageItems('scenes')
      const updatedScenes = scenes.filter((scene) => scene.id !== id)
      setStorageItems('scenes', updatedScenes)
      return successResponse(true)
    } catch {
      return errorResponse('删除场景失败', false)
    }
  },

  async duplicate(id: number): Promise<ApiResponse<Scene | null>> {
    await delay(500)
    try {
      const scenes = getStorageItems('scenes')
      const scene = scenes.find((item) => item.id === id)
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
    } catch {
      return errorResponse('复制场景失败', null)
    }
  },
}
