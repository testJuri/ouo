import { useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * 应用初始化 Hook
 * 在应用根组件中使用，自动初始化全局数据
 * 
 * @example
 * // 在 App.tsx 或 Layout 中使用
 * function App() {
 *   useInitApp()
 *   return <Router />
 * }
 */
export function useInitApp() {
  useEffect(() => {
    // 按需初始化模型列表，不默认加载所有
    // 各模块在使用时自行调用对应的 fetchModelsByModality
    // 例如：图片生成模块调用 fetchModelsByModality('image')
  }, [])
}

interface AppInitProps {
  children: ReactNode
}

/**
 * 全局数据初始化组件
 * 包装在应用根节点
 * 
 * @example
 * <AppInit>
 *   <YourApp />
 * </AppInit>
 */
export function AppInit({ children }: AppInitProps) {
  useInitApp()
  return children
}
