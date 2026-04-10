import type { ObjectCreateData, ObjectItem } from '@/types'
import type { ObjectDTO } from '@/api/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useObjects(projectId: number | null, type?: ObjectDTO['type']) {
  return useApiQuery(() => projectId ? projectApi.objects.getAll(projectId, type) : Promise.resolve({ success: true, data: [] as ObjectItem[] }), {
    initialData: [] as ObjectItem[],
    immediate: projectId !== null,
    deps: [projectId, type],
  })
}

// 获取武器列表的便捷 hook
export function useWeapons(projectId: number | null) {
  return useObjects(projectId, 'weapon')
}

export function useObject(projectId: number | null, id: number | null) {
  return useApiQuery(() => (projectId !== null && id !== null) ? projectApi.objects.getById(projectId, id) : Promise.resolve({ success: true, data: null as ObjectItem | null }), {
    initialData: null as ObjectItem | null,
    immediate: projectId !== null && id !== null,
    deps: [projectId, id],
  })
}

export function useCreateObject(projectId: number, options?: UseMutationOptions<ObjectCreateData, ObjectItem>) {
  return useMutation((data) => projectApi.objects.create(projectId, data), options)
}

export function useUpdateObject(
  projectId: number,
  id: number,
  options?: UseMutationOptions<Partial<ObjectItem>, ObjectItem | null>
) {
  return useMutation((data) => projectApi.objects.update(projectId, id, data), options)
}

export function useDeleteObject(projectId: number, options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.objects.delete(projectId, id), options)
}

export function useDuplicateObject(projectId: number, options?: UseMutationOptions<number, ObjectItem | null>) {
  return useMutation((id) => projectApi.objects.duplicate(projectId, id), options)
}
