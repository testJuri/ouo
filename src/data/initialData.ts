/**
 * Mock 数据分离
 * 所有初始数据集中管理，便于后续替换为 API 调用
 */

import type { Episode, Scene, Character, ObjectItem } from '@/types'

// ==================== 片段数据 ====================

export const initialEpisodes: Episode[] = [
  {
    id: 1,
    name: '序章：觉醒',
    count: 12,
    status: 'completed',
    modified: '2 小时前',
    code: 'EP_001',
  },
  {
    id: 2,
    name: '第一话：初入学园',
    count: 24,
    status: 'in-progress',
    modified: '1 天前',
    code: 'EP_002',
  },
  {
    id: 3,
    name: '第二话：黄昏对决',
    count: 18,
    status: 'draft',
    modified: '3 小时前',
    code: 'EP_003',
  },
]

// ==================== 场景数据 ====================

export const initialScenes: Scene[] = [
  {
    id: 1,
    name: '赛博街区 7 号扇区',
    image: 'https://images.unsplash.com/photo-1614726365723-49cfae927846?w=600&h=450&fit=crop',
    status: 'in-use',
    modified: '2 小时前',
    code: 'BG_042',
  },
  {
    id: 2,
    name: '黄昏教室 2B',
    image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&h=450&fit=crop',
    status: 'draft',
    modified: '1 天前',
    code: 'INT_011',
  },
  {
    id: 3,
    name: '薄雾寺院庭院',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=450&fit=crop',
    status: 'in-use',
    modified: '3 小时前',
    code: 'EXT_088',
  },
  {
    id: 4,
    name: '观测甲板欧米茄',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=450&fit=crop',
    status: 'draft',
    modified: '5 天前',
    code: 'SCI_003',
  },
  {
    id: 5,
    name: '低语森林',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=450&fit=crop',
    status: 'in-use',
    modified: '12 小时前',
    code: 'FNT_072',
  },
]

// ==================== 角色数据 ====================

export const initialCharacters: Character[] = [
  {
    id: 1,
    name: '龙崎真治',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=400&fit=crop',
    role: '主角',
    style: '赛博朋克',
    scenes: 12,
  },
  {
    id: 2,
    name: '月城雪兔',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop',
    role: '配角',
    style: '传统水墨',
    scenes: 8,
  },
  {
    id: 3,
    name: '神乐千鹤',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop',
    role: '主角',
    style: '现代写实',
    scenes: 15,
  },
  {
    id: 4,
    name: '黑崎一护',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
    role: '配角',
    style: '热血少年',
    scenes: 6,
  },
  {
    id: 5,
    name: '春野樱',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop',
    role: '主角',
    style: '治愈系',
    scenes: 10,
  },
  {
    id: 6,
    name: '佐藤健',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    role: '配角',
    style: '科幻风',
    scenes: 7,
  },
  {
    id: 7,
    name: '林小北',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop',
    role: '主角',
    style: '青春校园',
    scenes: 18,
  },
  {
    id: 8,
    name: '陈默',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop',
    role: '配角',
    style: '悬疑暗黑',
    scenes: 9,
  },
  {
    id: 9,
    name: '白浅',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
    role: '主角',
    style: '古风仙侠',
    scenes: 20,
  },
  {
    id: 10,
    name: '韩立',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
    role: '配角',
    style: '修仙玄幻',
    scenes: 5,
  },
  {
    id: 11,
    name: '苏沐橙',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop',
    role: '主角',
    style: '电竞少女',
    scenes: 14,
  },
  {
    id: 12,
    name: '叶修',
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=400&fit=crop',
    role: '配角',
    style: '成熟稳重',
    scenes: 11,
  },
]

// ==================== 物品数据 ====================

export const initialObjects: ObjectItem[] = [
  {
    id: 1,
    name: '光子武士刀',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop',
    type: '武器',
    status: 'in-use',
    scene: '赛博街区 7 号扇区',
    modified: '2 小时前',
  },
  {
    id: 2,
    name: '古董怀表',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=300&h=300&fit=crop',
    type: '道具',
    status: 'draft',
    scene: '黄昏教室 2B',
    modified: '1 天前',
  },
  {
    id: 3,
    name: '魔法卷轴',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop',
    type: '道具',
    status: 'in-use',
    scene: '薄雾寺院庭院',
    modified: '3 小时前',
  },
  {
    id: 4,
    name: '战术背包',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    type: '服装',
    status: 'draft',
    scene: '观测甲板欧米茄',
    modified: '5 天前',
  },
  {
    id: 5,
    name: '霓虹灯笼',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=300&fit=crop',
    type: '场景装饰',
    status: 'in-use',
    scene: '赛博街区 7 号扇区',
    modified: '1 小时前',
  },
  {
    id: 6,
    name: '能量手枪',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop',
    type: '武器',
    status: 'draft',
    scene: '未关联场景',
    modified: '2 天前',
  },
  {
    id: 7,
    name: '和服',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=300&h=300&fit=crop',
    type: '服装',
    status: 'in-use',
    scene: '薄雾寺院庭院',
    modified: '4 小时前',
  },
  {
    id: 8,
    name: '古籍',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=300&fit=crop',
    type: '道具',
    status: 'draft',
    scene: '黄昏教室 2B',
    modified: '1 周前',
  },
]

// ==================== 模型映射配置 ====================

export const modelImages: Record<string, string> = {
  classic: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?w=600&h=450&fit=crop',
  cyber: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop',
  ink: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=450&fit=crop',
}

export const objectTypeImages: Record<string, string> = {
  weapon: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop',
  prop: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=300&h=300&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  decoration: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop',
}

import type { ObjectType } from '@/types'

export const objectTypeLabels: Record<string, ObjectType> = {
  weapon: '武器',
  prop: '道具',
  clothing: '服装',
  decoration: '场景装饰',
}
