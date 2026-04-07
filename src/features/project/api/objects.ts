import type { ObjectCreateData, ObjectItem } from '@/types'
import {
  delay,
  errorResponse,
  generateId,
  getStorageItems,
  setStorageItems,
  successResponse,
} from './shared'
import type { ApiResponse } from './shared'

export const objectsApi = {
  async getAll(): Promise<ApiResponse<ObjectItem[]>> {
    await delay()
    try {
      const objects = getStorageItems('objects')
      return successResponse(objects)
    } catch {
      return errorResponse('获取物品列表失败', [])
    }
  },

  async getById(id: number): Promise<ApiResponse<ObjectItem | null>> {
    await delay()
    try {
      const objects = getStorageItems('objects')
      const object = objects.find((item) => item.id === id) || null
      return successResponse(object)
    } catch {
      return errorResponse('获取物品详情失败', null)
    }
  },

  async create(data: ObjectCreateData): Promise<ApiResponse<ObjectItem>> {
    await delay(500)
    try {
      const objects = getStorageItems('objects')
      const newId = generateId(objects)
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
    } catch {
      return errorResponse('创建物品失败', {} as ObjectItem)
    }
  },

  async update(id: number, data: Partial<ObjectItem>): Promise<ApiResponse<ObjectItem | null>> {
    await delay(400)
    try {
      const objects = getStorageItems('objects')
      let updatedObject: ObjectItem | null = null

      const updatedObjects = objects.map((object) => {
        if (object.id === id) {
          updatedObject = { ...object, ...data, modified: '刚刚' }
          return updatedObject
        }
        return object
      })

      setStorageItems('objects', updatedObjects)
      return successResponse(updatedObject)
    } catch {
      return errorResponse('更新物品失败', null)
    }
  },

  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const objects = getStorageItems('objects')
      const updatedObjects = objects.filter((object) => object.id !== id)
      setStorageItems('objects', updatedObjects)
      return successResponse(true)
    } catch {
      return errorResponse('删除物品失败', false)
    }
  },

  async duplicate(id: number): Promise<ApiResponse<ObjectItem | null>> {
    await delay(500)
    try {
      const objects = getStorageItems('objects')
      const object = objects.find((item) => item.id === id)
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
    } catch {
      return errorResponse('复制物品失败', null)
    }
  },
}
