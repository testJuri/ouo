import type { Scene, SceneCreateData } from '@/types'
import type { SceneDTO } from '@/api/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useScenes(projectId: number | null, status?: SceneDTO['status']) {
  return useApiQuery(() => projectId ? projectApi.scenes.getAll(projectId, status) : Promise.resolve({ success: true, data: [] as Scene[] }), {
    initialData: [] as Scene[],
    immediate: projectId !== null,
    deps: [projectId, status],
  })
}

// 获取使用中场景列表的便捷 hook
export function useActiveScenes(projectId: number | null) {
  return useScenes(projectId, 'in-use')
}

export function useScene(projectId: number | null, id: number | null) {
  return useApiQuery(() => (projectId !== null && id !== null) ? projectApi.scenes.getById(projectId, id) : Promise.resolve({ success: true, data: null as Scene | null }), {
    initialData: null as Scene | null,
    immediate: projectId !== null && id !== null,
    deps: [projectId, id],
  })
}

export function useCreateScene(projectId: number, options?: UseMutationOptions<SceneCreateData, Scene>) {
  return useMutation((data) => projectApi.scenes.create(projectId, data), options)
}

export function useUpdateScene(
  projectId: number,
  id: number,
  options?: UseMutationOptions<Partial<Scene>, Scene | null>
) {
  return useMutation((data) => projectApi.scenes.update(projectId, id, data), options)
}

export function useDeleteScene(projectId: number, options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.scenes.delete(projectId, id), options)
}

export function useDuplicateScene(projectId: number, options?: UseMutationOptions<number, Scene | null>) {
  return useMutation((id) => projectApi.scenes.duplicate(projectId, id), options)
}
