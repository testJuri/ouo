/**
 * API Hooks
 * 
 * 提供 React Hooks 封装，用于在组件中方便地使用 API
 * 包含加载状态、错误处理、自动刷新等功能
 */

import { useState, useEffect, useCallback } from 'react'
import { projectApi } from './projectApi'
import type { 
  Episode, EpisodeCreateData,
  Scene, SceneCreateData,
  Character, CharacterCreateData,
  ObjectItem, ObjectCreateData,
} from '@/types'

// ============ 通用数据加载 Hook ============

interface UseApiQueryOptions<T> {
  /** 是否立即执行 */
  immediate?: boolean
  /** 依赖项数组，变化时重新加载 */
  deps?: React.DependencyList
  /** 初始数据 */
  initialData?: T
}

interface UseApiQueryResult<T> {
  data: T
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: (data: T) => void
}

/**
 * 通用数据查询 Hook
 */
function useApiQuery<T>(
  fetchFn: () => Promise<{ success: boolean; data: T; message?: string }>,
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const { immediate = true, deps = [], initialData } = options
  const [data, setData] = useState<T>(initialData!)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.message || '请求失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, deps)

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  }
}

// ============ Episodes Hooks ============

export function useEpisodes() {
  return useApiQuery(() => projectApi.episodes.getAll(), {
    initialData: [] as Episode[],
  })
}

export function useEpisode(id: number | null) {
  return useApiQuery(
    () => projectApi.episodes.getById(id!),
    {
      initialData: null as Episode | null,
      immediate: id !== null,
      deps: [id],
    }
  )
}

// ============ Scenes Hooks ============

export function useScenes() {
  return useApiQuery(() => projectApi.scenes.getAll(), {
    initialData: [] as Scene[],
  })
}

export function useScene(id: number | null) {
  return useApiQuery(
    () => projectApi.scenes.getById(id!),
    {
      initialData: null as Scene | null,
      immediate: id !== null,
      deps: [id],
    }
  )
}

// ============ Characters Hooks ============

export function useCharacters() {
  return useApiQuery(() => projectApi.characters.getAll(), {
    initialData: [] as Character[],
  })
}

export function useCharacter(id: number | null) {
  return useApiQuery(
    () => projectApi.characters.getById(id!),
    {
      initialData: null as Character | null,
      immediate: id !== null,
      deps: [id],
    }
  )
}

// ============ Objects Hooks ============

export function useObjects() {
  return useApiQuery(() => projectApi.objects.getAll(), {
    initialData: [] as ObjectItem[],
  })
}

export function useObject(id: number | null) {
  return useApiQuery(
    () => projectApi.objects.getById(id!),
    {
      initialData: null as ObjectItem | null,
      immediate: id !== null,
      deps: [id],
    }
  )
}

// ============ 修改操作 Hooks ============

interface UseMutationOptions<T, R> {
  onSuccess?: (result: R) => void
  onError?: (error: string) => void
  // T 用于类型推断，确保 mutate 函数的输入类型安全
  _inputType?: T
}

interface UseMutationResult<T, R> {
  mutate: (data: T) => Promise<R | null>
  loading: boolean
  error: string | null
}

/**
 * 通用修改操作 Hook
 */
function useMutation<T, R>(
  mutationFn: (data: T) => Promise<{ success: boolean; data: R; message?: string }>,
  options: UseMutationOptions<T, R> = {}
): UseMutationResult<T, R> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (data: T): Promise<R | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await mutationFn(data)
      if (response.success) {
        options.onSuccess?.(response.data)
        return response.data
      } else {
        const errorMsg = response.message || '操作失败'
        setError(errorMsg)
        options.onError?.(errorMsg)
        return null
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误'
      setError(errorMsg)
      options.onError?.(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [mutationFn, options])

  return { mutate, loading, error }
}

// ============ Episodes Mutations ============

export function useCreateEpisode(options?: UseMutationOptions<EpisodeCreateData, Episode>) {
  return useMutation((data) => projectApi.episodes.create(data), options)
}

export function useUpdateEpisode(
  id: number,
  options?: UseMutationOptions<Partial<Episode>, Episode | null>
) {
  return useMutation((data) => projectApi.episodes.update(id, data), options)
}

export function useDeleteEpisode(options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.episodes.delete(id), options)
}

export function useDuplicateEpisode(options?: UseMutationOptions<number, Episode | null>) {
  return useMutation((id) => projectApi.episodes.duplicate(id), options)
}

// ============ Scenes Mutations ============

export function useCreateScene(options?: UseMutationOptions<SceneCreateData, Scene>) {
  return useMutation((data) => projectApi.scenes.create(data), options)
}

export function useUpdateScene(
  id: number,
  options?: UseMutationOptions<Partial<Scene>, Scene | null>
) {
  return useMutation((data) => projectApi.scenes.update(id, data), options)
}

export function useDeleteScene(options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.scenes.delete(id), options)
}

export function useDuplicateScene(options?: UseMutationOptions<number, Scene | null>) {
  return useMutation((id) => projectApi.scenes.duplicate(id), options)
}

// ============ Characters Mutations ============

export function useCreateCharacter(options?: UseMutationOptions<CharacterCreateData, Character>) {
  return useMutation((data) => projectApi.characters.create(data), options)
}

export function useUpdateCharacter(
  id: number,
  options?: UseMutationOptions<Partial<Character>, Character | null>
) {
  return useMutation((data) => projectApi.characters.update(id, data), options)
}

export function useDeleteCharacter(options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.characters.delete(id), options)
}

export function useDuplicateCharacter(options?: UseMutationOptions<number, Character | null>) {
  return useMutation((id) => projectApi.characters.duplicate(id), options)
}

// ============ Objects Mutations ============

export function useCreateObject(options?: UseMutationOptions<ObjectCreateData, ObjectItem>) {
  return useMutation((data) => projectApi.objects.create(data), options)
}

export function useUpdateObject(
  id: number,
  options?: UseMutationOptions<Partial<ObjectItem>, ObjectItem | null>
) {
  return useMutation((data) => projectApi.objects.update(id, data), options)
}

export function useDeleteObject(options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.objects.delete(id), options)
}

export function useDuplicateObject(options?: UseMutationOptions<number, ObjectItem | null>) {
  return useMutation((id) => projectApi.objects.duplicate(id), options)
}
