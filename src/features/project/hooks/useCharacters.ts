import type { Character, CharacterCreateData } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useCharacters() {
  return useApiQuery(() => projectApi.characters.getAll(), {
    initialData: [] as Character[],
  })
}

export function useCharacter(id: number | null) {
  return useApiQuery(() => projectApi.characters.getById(id!), {
    initialData: null as Character | null,
    immediate: id !== null,
    deps: [id],
  })
}

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
