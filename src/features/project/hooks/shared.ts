import { useCallback, useEffect, useState } from 'react'
import type { ApiResponse } from '../api'

interface UseApiQueryOptions<T> {
  immediate?: boolean
  deps?: React.DependencyList
  initialData?: T
}

interface UseApiQueryResult<T> {
  data: T
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: (data: T) => void
}

interface UseMutationOptions<T, R> {
  onSuccess?: (result: R) => void
  onError?: (error: string) => void
  _inputType?: T
}

interface UseMutationResult<T, R> {
  mutate: (data: T) => Promise<R | null>
  loading: boolean
  error: string | null
}

export function useApiQuery<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
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
      void fetchData()
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

export function useMutation<T, R>(
  mutationFn: (data: T) => Promise<ApiResponse<R>>,
  options: UseMutationOptions<T, R> = {}
): UseMutationResult<T, R> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (data: T): Promise<R | null> => {
      setLoading(true)
      setError(null)
      try {
        const response = await mutationFn(data)
        if (response.success) {
          options.onSuccess?.(response.data)
          return response.data
        }

        const errorMsg = response.message || '操作失败'
        setError(errorMsg)
        options.onError?.(errorMsg)
        return null
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '未知错误'
        setError(errorMsg)
        options.onError?.(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, options]
  )

  return { mutate, loading, error }
}

export type { UseMutationOptions, UseMutationResult }
