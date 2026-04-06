/**
 * 本地存储工具
 * 封装 localStorage 操作，提供类型安全的 CRUD 接口
 * 所有项目数据统一存储在 'jurilu_project_data' key 下
 */

import type { ProjectAssets } from '@/types'
import { initialEpisodes, initialScenes, initialCharacters, initialObjects } from '@/data/initialData'

const STORAGE_KEY = 'jurilu_project_data'

// 默认数据结构
const defaultData: ProjectAssets = {
  episodes: initialEpisodes,
  scenes: initialScenes,
  characters: initialCharacters,
  objects: initialObjects,
}

/**
 * 获取存储的完整数据
 */
export function getStorageData(): ProjectAssets {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      // 首次访问，初始化数据
      setStorageData(defaultData)
      return defaultData
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('读取本地存储失败:', error)
    return defaultData
  }
}

/**
 * 保存完整数据到存储
 */
export function setStorageData(data: ProjectAssets): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('写入本地存储失败:', error)
  }
}

/**
 * 获取指定类型的数据
 */
export function getStorageItems<K extends keyof ProjectAssets>(
  type: K
): ProjectAssets[K] {
  const data = getStorageData()
  return data[type]
}

/**
 * 更新指定类型的数据
 */
export function setStorageItems<K extends keyof ProjectAssets>(
  type: K,
  items: ProjectAssets[K]
): void {
  const data = getStorageData()
  data[type] = items
  setStorageData(data)
}

/**
 * 清空所有存储数据（重置为初始值）
 */
export function clearStorage(): void {
  setStorageData(defaultData)
}

/**
 * 导出所有数据为 JSON 文件
 */
export function exportStorageData(): string {
  return JSON.stringify(getStorageData(), null, 2)
}

/**
 * 从 JSON 文件导入数据
 */
export function importStorageData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)
    // 简单验证数据结构
    if (data.episodes && data.scenes && data.characters && data.objects) {
      setStorageData(data)
      return true
    }
    return false
  } catch {
    return false
  }
}
