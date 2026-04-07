import type { Character, CharacterCreateData } from '@/types'
import {
  delay,
  errorResponse,
  generateId,
  getStorageItems,
  setStorageItems,
  successResponse,
} from './shared'
import type { ApiResponse } from './shared'

export const charactersApi = {
  async getAll(): Promise<ApiResponse<Character[]>> {
    await delay()
    try {
      const characters = getStorageItems('characters')
      return successResponse(characters)
    } catch {
      return errorResponse('获取角色列表失败', [])
    }
  },

  async getById(id: number): Promise<ApiResponse<Character | null>> {
    await delay()
    try {
      const characters = getStorageItems('characters')
      const character = characters.find((item) => item.id === id) || null
      return successResponse(character)
    } catch {
      return errorResponse('获取角色详情失败', null)
    }
  },

  async create(data: CharacterCreateData): Promise<ApiResponse<Character>> {
    await delay(500)
    try {
      const characters = getStorageItems('characters')
      const newId = generateId(characters)

      const newCharacter: Character = {
        id: newId,
        name: data.name,
        image:
          data.referenceImage ||
          'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop',
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
    } catch {
      return errorResponse('创建角色失败', {} as Character)
    }
  },

  async update(id: number, data: Partial<Character>): Promise<ApiResponse<Character | null>> {
    await delay(400)
    try {
      const characters = getStorageItems('characters')
      let updatedCharacter: Character | null = null

      const updatedCharacters = characters.map((character) => {
        if (character.id === id) {
          updatedCharacter = { ...character, ...data }
          return updatedCharacter
        }
        return character
      })

      setStorageItems('characters', updatedCharacters)
      return successResponse(updatedCharacter)
    } catch {
      return errorResponse('更新角色失败', null)
    }
  },

  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const characters = getStorageItems('characters')
      const updatedCharacters = characters.filter((character) => character.id !== id)
      setStorageItems('characters', updatedCharacters)
      return successResponse(true)
    } catch {
      return errorResponse('删除角色失败', false)
    }
  },

  async duplicate(id: number): Promise<ApiResponse<Character | null>> {
    await delay(500)
    try {
      const characters = getStorageItems('characters')
      const character = characters.find((item) => item.id === id)
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
    } catch {
      return errorResponse('复制角色失败', null)
    }
  },
}
