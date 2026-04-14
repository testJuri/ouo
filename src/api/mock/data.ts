/**
 * API Mock 数据
 * 当 MOCK_MODE=true 时，所有 API 返回此文件中的数据
 */

import type {
  ProjectDTO,
  ProjectDetailDTO,
  ProjectMemberDTO,
  ProjectAssetDTO,
  CharacterDTO,
  EpisodeDTO,
  SceneDTO,
  ObjectDTO,
  AuthPayload,
  AuthMe,
} from '../types'

// ============ 项目数据 ============
export const mockProjects: ProjectDTO[] = [
  {
    id: 1,
    organizationId: 1,
    name: '武侠江湖传',
    description: '一个关于江湖恩怨的武侠漫画项目',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop',
    status: 'in-progress',
    isPublic: false,
    ownerId: 1,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-20T10:30:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    name: '未来都市',
    description: '科幻题材的未来城市冒险故事',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=600&fit=crop',
    status: 'in-progress',
    isPublic: true,
    ownerId: 1,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-18T14:20:00Z',
  },
  {
    id: 3,
    organizationId: 1,
    name: '校园日常',
    description: '青春校园题材的轻松喜剧',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
    status: 'draft',
    isPublic: false,
    ownerId: 2,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
]

export const mockProjectDetail: ProjectDetailDTO = {
  id: 1,
  organizationId: 1,
  name: '武侠江湖传',
  description: '一个关于江湖恩怨的武侠漫画项目',
  coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop',
  status: 'in-progress',
  isPublic: false,
  ownerId: 1,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-03-20T10:30:00Z',
  owner: {
    id: 1,
    username: '张三',
    avatar: '',
  },
  members: [
    { userId: 1, role: 'owner', joinedAt: '2024-01-15T08:00:00Z' },
    { userId: 2, role: 'editor', joinedAt: '2024-02-01T09:30:00Z' },
  ],
  stats: {
    episodeCount: 12,
    characterCount: 8,
    sceneCount: 24,
    objectCount: 15,
  },
}

// ============ 成员数据 ============
export const mockMembers: ProjectMemberDTO[] = [
  {
    userId: 1,
    organizationId: 1,
    role: 'owner',
    joinedAt: '2024-01-15T08:00:00Z',
    user: {
      id: 1,
      username: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    },
  },
  {
    userId: 2,
    organizationId: 1,
    role: 'editor',
    joinedAt: '2024-02-01T09:30:00Z',
    user: {
      id: 2,
      username: '李四',
      email: 'lisi@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  },
  {
    userId: 3,
    organizationId: 1,
    role: 'viewer',
    joinedAt: '2024-03-01T11:00:00Z',
    user: {
      id: 3,
      username: '王五',
      email: 'wangwu@example.com',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    },
  },
]

// ============ 角色数据 ============
export const mockCharacters: CharacterDTO[] = [
  {
    id: 1,
    organizationId: 1,
    projectId: 1,
    name: '李逍遥',
    role: 'main',
    gender: 'male',
    ageGroup: 'young',
    style: 'anime',
    description: '江湖侠客，性格豪爽，擅长剑法',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop',
    referenceImages: [],
    modelId: 'xt45',
    seed: '123456789012345678',
    creationMode: 'quick',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    projectId: 1,
    name: '赵灵儿',
    role: 'main',
    gender: 'female',
    ageGroup: 'young',
    style: 'anime',
    description: '仙灵岛仙子，温柔善良，精通法术',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    referenceImages: [],
    modelId: 'xt45',
    seed: '987654321098765432',
    creationMode: 'quick',
    createdAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
  },
  {
    id: 3,
    organizationId: 1,
    projectId: 1,
    name: '林月如',
    role: 'support',
    gender: 'female',
    ageGroup: 'young',
    style: 'realistic',
    description: '武林盟主之女，性格刚烈，使鞭',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    referenceImages: [],
    modelId: 'xt40',
    seed: '456789012345678901',
    creationMode: 'workflow',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
]

// ============ 片段数据 ============
export const mockEpisodes: EpisodeDTO[] = [
  {
    id: 1,
    organizationId: 1,
    projectId: 1,
    name: '第一回：初入江湖',
    code: 'EP001',
    description: '主角初次踏入江湖，结识第一个伙伴',
    status: 'completed',
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    projectId: 1,
    name: '第二回：仙灵奇缘',
    code: 'EP002',
    description: '偶遇仙灵岛，开启神秘冒险',
    status: 'in-progress',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-03-20T09:30:00Z',
  },
  {
    id: 3,
    organizationId: 1,
    projectId: 1,
    name: '第三回：比武招亲',
    code: 'EP003',
    description: '武林大会比武招亲，各路英雄汇聚',
    status: 'draft',
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
  },
]

// ============ 场景数据 ============
export const mockScenes: SceneDTO[] = [
  {
    id: 1,
    organizationId: 1,
    projectId: 1,
    name: '仙灵岛',
    description: '桃花盛开的仙岛，灵气充沛',
    status: 'in-use',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop',
    createdAt: '2024-01-28T09:00:00Z',
    updatedAt: '2024-03-10T15:00:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    projectId: 1,
    name: '武林大会会场',
    description: '武林盟主举办的比武场地',
    status: 'in-use',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-03-12T10:30:00Z',
  },
  {
    id: 3,
    organizationId: 1,
    projectId: 1,
    name: '客栈',
    description: '江湖人士歇脚的客栈',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
  },
]

// ============ 物品数据 ============
export const mockObjects: ObjectDTO[] = [
  {
    id: 1,
    organizationId: 1,
    projectId: 1,
    name: '七星剑',
    description: '传说中的神兵利器',
    type: 'weapon',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=200&h=200&fit=crop',
    status: 'in-use',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    projectId: 1,
    name: '玉佩',
    description: '家传宝玉，温润如水',
    type: 'prop',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop',
    status: 'draft',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z',
  },
]

// ============ 资产数据 ============
export const mockProjectAssets: ProjectAssetDTO[] = [
  {
    id: 101,
    organizationId: 1,
    projectId: 1,
    name: '主角立绘定稿',
    sourceType: 'character',
    sourceId: '1',
    prompt: '国风侠客，白衣长剑，站姿立绘',
    url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200&h=900&fit=crop',
    metadata: { type: 'image' },
    createdBy: 1,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 102,
    organizationId: 1,
    projectId: 1,
    name: '仙灵岛场景设定',
    sourceType: 'scene',
    sourceId: '1',
    prompt: '春日仙岛，薄雾，桃花，远山湖面',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop',
    metadata: { type: 'image' },
    createdBy: 2,
    createdAt: '2024-03-12T08:30:00Z',
    updatedAt: '2024-03-22T12:00:00Z',
  },
  {
    id: 103,
    organizationId: 1,
    projectId: 1,
    name: '镜头动效预览.mp4',
    sourceType: 'workflow',
    sourceId: 'demo-video-1',
    prompt: '角色转身，镜头缓慢推进',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    metadata: { type: 'video' },
    createdBy: 1,
    createdAt: '2024-03-14T10:00:00Z',
    updatedAt: '2024-03-24T16:00:00Z',
  },
]

// ============ 认证数据 ============
export const mockAuthPayload: AuthPayload = {
  access_token: 'mock_token_123456789',
  refresh_token: 'mock_refresh_token_987654321',
  user: {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    roleId: 1,
  },
}

export const mockAuthMe: AuthMe = {
  id: 1,
  username: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  roleId: 1,
  organizationIds: [1],
}

// ============ 辅助函数 ============
let mockIdCounter = 1000

export function generateMockId(): number {
  return ++mockIdCounter
}

export function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
