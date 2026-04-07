import type { Episode, EpisodeCreateData } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useEpisodes() {
  return useApiQuery(() => projectApi.episodes.getAll(), {
    initialData: [] as Episode[],
  })
}

export function useEpisode(id: number | null) {
  return useApiQuery(() => projectApi.episodes.getById(id!), {
    initialData: null as Episode | null,
    immediate: id !== null,
    deps: [id],
  })
}

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
