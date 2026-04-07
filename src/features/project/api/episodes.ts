import type { Episode, EpisodeCreateData } from '@/types'
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

export const episodesApi = {
  async getAll(): Promise<ApiResponse<Episode[]>> {
    await delay()
    try {
      const episodes = getStorageItems('episodes')
      return successResponse(episodes)
    } catch {
      return errorResponse('获取片段列表失败', [])
    }
  },

  async getById(id: number): Promise<ApiResponse<Episode | null>> {
    await delay()
    try {
      const episodes = getStorageItems('episodes')
      const episode = episodes.find((item) => item.id === id) || null
      return successResponse(episode)
    } catch {
      return errorResponse('获取片段详情失败', null)
    }
  },

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
    } catch {
      return errorResponse('创建片段失败', {} as Episode)
    }
  },

  async update(id: number, data: Partial<Episode>): Promise<ApiResponse<Episode | null>> {
    await delay(400)
    try {
      const episodes = getStorageItems('episodes')
      let updatedEpisode: Episode | null = null

      const updatedEpisodes = episodes.map((episode) => {
        if (episode.id === id) {
          updatedEpisode = { ...episode, ...data, modified: '刚刚' }
          return updatedEpisode
        }
        return episode
      })

      setStorageItems('episodes', updatedEpisodes)
      return successResponse(updatedEpisode)
    } catch {
      return errorResponse('更新片段失败', null)
    }
  },

  async delete(id: number): Promise<ApiResponse<boolean>> {
    await delay(400)
    try {
      const episodes = getStorageItems('episodes')
      const updatedEpisodes = episodes.filter((episode) => episode.id !== id)
      setStorageItems('episodes', updatedEpisodes)
      return successResponse(true)
    } catch {
      return errorResponse('删除片段失败', false)
    }
  },

  async duplicate(id: number): Promise<ApiResponse<Episode | null>> {
    await delay(500)
    try {
      const episodes = getStorageItems('episodes')
      const episode = episodes.find((item) => item.id === id)
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
    } catch {
      return errorResponse('复制片段失败', null)
    }
  },
}
