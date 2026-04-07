import { getStorageItems, setStorageItems } from '@/utils/storage'

const MOCK_DELAY = 300

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const delay = (ms: number = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms))

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
})

export const errorResponse = <T>(message: string, fallbackData: T): ApiResponse<T> => ({
  success: false,
  data: fallbackData,
  message,
})

export const generateId = (items: { id: number }[]): number => {
  if (items.length === 0) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

export const generateCode = (prefix: string, id: number): string => {
  return `${prefix}_${String(id).padStart(3, '0')}`
}

export { getStorageItems, setStorageItems }
