import type { Scene, SceneCreateData } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useScenes() {
  return useApiQuery(() => projectApi.scenes.getAll(), {
    initialData: [] as Scene[],
  })
}

export function useScene(id: number | null) {
  return useApiQuery(() => projectApi.scenes.getById(id!), {
    initialData: null as Scene | null,
    immediate: id !== null,
    deps: [id],
  })
}

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
