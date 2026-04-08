import type { Character, CharacterCreateData } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useCharacters(projectId: number | null) {
  return useApiQuery(() => projectId ? projectApi.characters.getAll(projectId) : Promise.resolve({ success: true, data: [] as Character[] }), {
    initialData: [] as Character[],
    immediate: projectId !== null,
    deps: [projectId],
  })
}

export function useCharacter(projectId: number | null, id: number | null) {
  return useApiQuery(() => (projectId !== null && id !== null) ? projectApi.characters.getById(projectId, id) : Promise.resolve({ success: true, data: null as Character | null }), {
    initialData: null as Character | null,
    immediate: projectId !== null && id !== null,
    deps: [projectId, id],
  })
}

export function useCreateCharacter(projectId: number, options?: UseMutationOptions<CharacterCreateData, Character>) {
  return useMutation((data) => projectApi.characters.create(projectId, data), options)
}

export function useUpdateCharacter(
  projectId: number,
  id: number,
  options?: UseMutationOptions<Partial<Character>, Character | null>
) {
  return useMutation((data) => projectApi.characters.update(projectId, id, data), options)
}

export function useDeleteCharacter(projectId: number, options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.characters.delete(projectId, id), options)
}

export function useDuplicateCharacter(projectId: number, options?: UseMutationOptions<number, Character | null>) {
  return useMutation((id) => projectApi.characters.duplicate(projectId, id), options)
}
