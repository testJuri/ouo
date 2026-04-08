/**
 * Mock 模式开关
 * 通过环境变量 VITE_MOCK_MODE 控制是否使用 Mock 数据
 */

// 读取环境变量，默认为 false（使用真实接口）
export const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

// 导出所有 Mock API
export * from './api'
