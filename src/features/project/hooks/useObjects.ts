import type { ObjectCreateData, ObjectItem } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useObjects() {
  return useApiQuery(() => projectApi.objects.getAll(), {
    initialData: [] as ObjectItem[],
  })
}

export function useObject(id: number | null) {
  return useApiQuery(() => projectApi.objects.getById(id!), {
    initialData: null as ObjectItem | null,
    immediate: id !== null,
    deps: [id],
  })
}

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
