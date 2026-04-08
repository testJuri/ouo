/**
 * Mock API 实现
 * 模拟后端接口行为，支持 CRUD 操作
 */

import type {
  CreateProjectInput,
  UpdateProjectInput,
} from '../projectsApi'
import type {
  ProjectDTO,
  ProjectDetailDTO,
  ProjectMemberDTO,
  ProjectAssetDTO,
  CharacterDTO,
  EpisodeDTO,
  SceneDTO,
  ObjectDTO,
  ListData,
  AuthPayload,
  AuthMe,
} from '../types'
import {
  mockProjects,
  mockProjectDetail,
  mockMembers,
  mockProjectAssets,
  mockCharacters,
  mockEpisodes,
  mockScenes,
  mockObjects,
  mockAuthPayload,
  mockAuthMe,
  generateMockId,
  delay,
} from './data'

// ============ 项目 API ============
export const mockProjectsApi = {
  async list(params?: { page?: number; size?: number; status?: ProjectDTO['status']; organizationId?: number }): Promise<ListData<ProjectDTO>> {
    await delay(300)
    let list = [...mockProjects]
    if (params?.status) {
      list = list.filter((p) => p.status === params.status)
    }
    if (params?.organizationId) {
      list = list.filter((p) => p.organizationId === params.organizationId)
    }
    return {
      list,
      pagination: {
        total: list.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      },
    }
  },

  async getById(projectId: number): Promise<ProjectDetailDTO> {
    await delay(200)
    const project = mockProjects.find((p) => p.id === projectId)
    if (!project) throw new Error('项目不存在')
    return {
      ...mockProjectDetail,
      ...project,
      id: projectId,
    }
  },

  async create(payload: CreateProjectInput): Promise<ProjectDTO> {
    await delay(500)
    const newProject: ProjectDTO = {
      id: generateMockId(),
      organizationId: payload.organizationId,
      name: payload.name,
      description: payload.description ?? '',
      coverImage: payload.coverImage ?? '',
      status: 'draft',
      isPublic: payload.isPublic ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProjects.unshift(newProject)
    return newProject
  },

  async update(projectId: number, payload: UpdateProjectInput): Promise<ProjectDTO> {
    await delay(300)
    const index = mockProjects.findIndex((p) => p.id === projectId)
    if (index === -1) throw new Error('项目不存在')
    const updated = {
      ...mockProjects[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    mockProjects[index] = updated
    return updated
  },

  async remove(_projectId: number): Promise<true> {
    await delay(300)
    const index = mockProjects.findIndex((p) => p.id === _projectId)
    if (index !== -1) {
      mockProjects.splice(index, 1)
    }
    return true
  },
}

// ============ 成员 API ============
export const mockProjectMembersApi = {
  async list(_projectId: number): Promise<ListData<ProjectMemberDTO>> {
    await delay(200)
    return {
      list: mockMembers,
      pagination: {
        total: mockMembers.length,
        page: 1,
        size: 10,
      },
    }
  },

  async add(_projectId: number, payload: { userId: number; role: 'editor' | 'viewer' }): Promise<ProjectMemberDTO> {
    await delay(400)
    const newMember: ProjectMemberDTO = {
      userId: payload.userId,
      organizationId: 1,
      role: payload.role,
      joinedAt: new Date().toISOString(),
      user: {
        id: payload.userId,
        username: `用户${payload.userId}`,
        email: `user${payload.userId}@example.com`,
        avatar: '',
      },
    }
    mockMembers.push(newMember)
    return newMember
  },

  async updateRole(_projectId: number, userId: number, role: 'owner' | 'editor' | 'viewer'): Promise<ProjectMemberDTO> {
    await delay(300)
    const member = mockMembers.find((m) => m.userId === userId)
    if (!member) throw new Error('成员不存在')
    member.role = role
    return member
  },

  async remove(_projectId: number, userId: number): Promise<true> {
    await delay(300)
    const index = mockMembers.findIndex((m) => m.userId === userId)
    if (index !== -1) {
      mockMembers.splice(index, 1)
    }
    return true
  },
}

// ============ 资产 API ============
export const mockProjectAssetsApi = {
  async list(
    projectId: number,
    params?: { page?: number; size?: number; sourceType?: ProjectAssetDTO['sourceType'] }
  ): Promise<ListData<ProjectAssetDTO>> {
    await delay(200)
    let list = mockProjectAssets.filter((asset) => asset.projectId === projectId)
    if (params?.sourceType) {
      list = list.filter((asset) => asset.sourceType === params.sourceType)
    }
    return {
      list,
      pagination: {
        total: list.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      },
    }
  },
}

// ============ 角色 API ============
export const mockCharactersApi = {
  async getAll(projectId: number): Promise<ListData<CharacterDTO>> {
    await delay(300)
    const list = mockCharacters.filter((c) => c.projectId === projectId)
    return {
      list,
      pagination: {
        total: list.length,
        page: 1,
        size: 10,
      },
    }
  },

  async getById(projectId: number, id: number): Promise<CharacterDTO | null> {
    await delay(200)
    return mockCharacters.find((c) => c.projectId === projectId && c.id === id) ?? null
  },

  async create(projectId: number, data: Partial<CharacterDTO>): Promise<CharacterDTO> {
    await delay(500)
    const newCharacter: CharacterDTO = {
      id: generateMockId(),
      organizationId: 1,
      projectId,
      name: data.name ?? '未命名角色',
      role: (data.role as 'main' | 'support') ?? 'support',
      gender: (data.gender as 'male' | 'female' | 'other') ?? 'other',
      ageGroup: (data.ageGroup as 'child' | 'teen' | 'young' | 'middle' | 'old') ?? 'young',
      style: data.style ?? 'anime',
      description: data.description ?? '',
      avatar: data.avatar ?? '',
      referenceImages: data.referenceImages ?? [],
      modelId: data.modelId ?? 'xt45',
      seed: data.seed ?? '123456789',
      creationMode: (data.creationMode as 'quick' | 'workflow') ?? 'quick',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCharacters.push(newCharacter)
    return newCharacter
  },

  async update(projectId: number, id: number, data: Partial<CharacterDTO>): Promise<CharacterDTO | null> {
    await delay(300)
    const index = mockCharacters.findIndex((c) => c.projectId === projectId && c.id === id)
    if (index === -1) return null
    mockCharacters[index] = {
      ...mockCharacters[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockCharacters[index]
  },

  async delete(projectId: number, id: number): Promise<true> {
    await delay(300)
    const index = mockCharacters.findIndex((c) => c.projectId === projectId && c.id === id)
    if (index !== -1) {
      mockCharacters.splice(index, 1)
    }
    return true
  },

  async duplicate(projectId: number, id: number): Promise<CharacterDTO | null> {
    await delay(400)
    const character = mockCharacters.find((c) => c.projectId === projectId && c.id === id)
    if (!character) return null
    const duplicated: CharacterDTO = {
      ...character,
      id: generateMockId(),
      name: `${character.name} (复制)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCharacters.push(duplicated)
    return duplicated
  },
}

// ============ 片段 API ============
export const mockEpisodesApi = {
  async getAll(projectId: number): Promise<ListData<EpisodeDTO>> {
    await delay(300)
    const list = mockEpisodes.filter((e) => e.projectId === projectId)
    return {
      list,
      pagination: {
        total: list.length,
        page: 1,
        size: 10,
      },
    }
  },

  async getById(projectId: number, id: number): Promise<EpisodeDTO | null> {
    await delay(200)
    return mockEpisodes.find((e) => e.projectId === projectId && e.id === id) ?? null
  },

  async create(projectId: number, data: Partial<EpisodeDTO>): Promise<EpisodeDTO> {
    await delay(500)
    const newEpisode: EpisodeDTO = {
      id: generateMockId(),
      organizationId: 1,
      projectId,
      name: data.name ?? '未命名片段',
      code: data.code ?? `EP${String(mockEpisodes.length + 1).padStart(3, '0')}`,
      description: data.description ?? '',
      status: (data.status as 'draft' | 'in-progress' | 'completed') ?? 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockEpisodes.push(newEpisode)
    return newEpisode
  },

  async update(projectId: number, id: number, data: Partial<EpisodeDTO>): Promise<EpisodeDTO | null> {
    await delay(300)
    const index = mockEpisodes.findIndex((e) => e.projectId === projectId && e.id === id)
    if (index === -1) return null
    mockEpisodes[index] = {
      ...mockEpisodes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockEpisodes[index]
  },

  async delete(projectId: number, id: number): Promise<true> {
    await delay(300)
    const index = mockEpisodes.findIndex((e) => e.projectId === projectId && e.id === id)
    if (index !== -1) {
      mockEpisodes.splice(index, 1)
    }
    return true
  },

  async duplicate(projectId: number, id: number): Promise<EpisodeDTO | null> {
    await delay(400)
    const episode = mockEpisodes.find((e) => e.projectId === projectId && e.id === id)
    if (!episode) return null
    const duplicated: EpisodeDTO = {
      ...episode,
      id: generateMockId(),
      name: `${episode.name} (复制)`,
      code: `${episode.code}_copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockEpisodes.push(duplicated)
    return duplicated
  },
}

// ============ 场景 API ============
export const mockScenesApi = {
  async getAll(projectId: number): Promise<ListData<SceneDTO>> {
    await delay(300)
    const list = mockScenes.filter((s) => s.projectId === projectId)
    return {
      list,
      pagination: {
        total: list.length,
        page: 1,
        size: 10,
      },
    }
  },

  async getById(projectId: number, id: number): Promise<SceneDTO | null> {
    await delay(200)
    return mockScenes.find((s) => s.projectId === projectId && s.id === id) ?? null
  },

  async create(projectId: number, data: Partial<SceneDTO>): Promise<SceneDTO> {
    await delay(500)
    const newScene: SceneDTO = {
      id: generateMockId(),
      organizationId: 1,
      projectId,
      name: data.name ?? '未命名场景',
      description: data.description ?? '',
      status: 'draft',
      image: data.image ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockScenes.push(newScene)
    return newScene
  },

  async update(projectId: number, id: number, data: Partial<SceneDTO>): Promise<SceneDTO | null> {
    await delay(300)
    const index = mockScenes.findIndex((s) => s.projectId === projectId && s.id === id)
    if (index === -1) return null
    mockScenes[index] = {
      ...mockScenes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockScenes[index]
  },

  async delete(projectId: number, id: number): Promise<true> {
    await delay(300)
    const index = mockScenes.findIndex((s) => s.projectId === projectId && s.id === id)
    if (index !== -1) {
      mockScenes.splice(index, 1)
    }
    return true
  },

  async duplicate(projectId: number, id: number): Promise<SceneDTO | null> {
    await delay(400)
    const scene = mockScenes.find((s) => s.projectId === projectId && s.id === id)
    if (!scene) return null
    const duplicated: SceneDTO = {
      ...scene,
      id: generateMockId(),
      name: `${scene.name} (复制)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockScenes.push(duplicated)
    return duplicated
  },
}

// ============ 物品 API ============
export const mockObjectsApi = {
  async getAll(projectId: number): Promise<ListData<ObjectDTO>> {
    await delay(300)
    const list = mockObjects.filter((o) => o.projectId === projectId)
    return {
      list,
      pagination: {
        total: list.length,
        page: 1,
        size: 10,
      },
    }
  },

  async getById(projectId: number, id: number): Promise<ObjectDTO | null> {
    await delay(200)
    return mockObjects.find((o) => o.projectId === projectId && o.id === id) ?? null
  },

  async create(projectId: number, data: Partial<ObjectDTO>): Promise<ObjectDTO> {
    await delay(500)
    const newObject: ObjectDTO = {
      id: generateMockId(),
      organizationId: 1,
      projectId,
      name: data.name ?? '未命名物品',
      description: data.description ?? '',
      type: (data.type as 'weapon' | 'prop' | 'clothing' | 'decoration') ?? 'prop',
      image: data.image ?? '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockObjects.push(newObject)
    return newObject
  },

  async update(projectId: number, id: number, data: Partial<ObjectDTO>): Promise<ObjectDTO | null> {
    await delay(300)
    const index = mockObjects.findIndex((o) => o.projectId === projectId && o.id === id)
    if (index === -1) return null
    mockObjects[index] = {
      ...mockObjects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockObjects[index]
  },

  async delete(projectId: number, id: number): Promise<true> {
    await delay(300)
    const index = mockObjects.findIndex((o) => o.projectId === projectId && o.id === id)
    if (index !== -1) {
      mockObjects.splice(index, 1)
    }
    return true
  },

  async duplicate(projectId: number, id: number): Promise<ObjectDTO | null> {
    await delay(400)
    const object = mockObjects.find((o) => o.projectId === projectId && o.id === id)
    if (!object) return null
    const duplicated: ObjectDTO = {
      ...object,
      id: generateMockId(),
      name: `${object.name} (复制)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockObjects.push(duplicated)
    return duplicated
  },
}

// ============ 认证 API ============
export const mockAuthApi = {
  async login(_payload: { email: string; password: string }): Promise<AuthPayload> {
    await delay(500)
    return mockAuthPayload
  },

  async register(payload: { username: string; email: string; password: string; avatar?: string }): Promise<AuthPayload> {
    await delay(500)
    return {
      ...mockAuthPayload,
      user: {
        ...mockAuthPayload.user,
        username: payload.username,
        email: payload.email,
        avatar: payload.avatar ?? mockAuthPayload.user.avatar,
      },
    }
  },

  async refresh(_refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    await delay(300)
    return {
      token: 'mock_new_token_' + Date.now(),
      refreshToken: 'mock_new_refresh_token_' + Date.now(),
    }
  },

  async me(): Promise<AuthMe> {
    await delay(200)
    return mockAuthMe
  },
}
