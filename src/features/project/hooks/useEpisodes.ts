import type { Episode, EpisodeCreateData } from '@/types'
import { projectApi } from '../api'
import { useApiQuery, useMutation } from './shared'
import type { UseMutationOptions } from './shared'

export function useEpisodes(projectId: number | null) {
  return useApiQuery(() => projectId ? projectApi.episodes.getAll(projectId) : Promise.resolve({ success: true, data: [] as Episode[] }), {
    initialData: [] as Episode[],
    immediate: projectId !== null,
    deps: [projectId],
  })
}

export function useEpisode(projectId: number | null, id: number | null) {
  return useApiQuery(() => (projectId !== null && id !== null) ? projectApi.episodes.getById(projectId, id) : Promise.resolve({ success: true, data: null as Episode | null }), {
    initialData: null as Episode | null,
    immediate: projectId !== null && id !== null,
    deps: [projectId, id],
  })
}

export function useCreateEpisode(projectId: number, options?: UseMutationOptions<EpisodeCreateData, Episode>) {
  return useMutation((data) => projectApi.episodes.create(projectId, data), options)
}

export function useUpdateEpisode(
  projectId: number,
  id: number,
  options?: UseMutationOptions<Partial<Episode>, Episode | null>
) {
  return useMutation((data) => projectApi.episodes.update(projectId, id, data), options)
}

export function useDeleteEpisode(projectId: number, options?: UseMutationOptions<number, boolean>) {
  return useMutation((id) => projectApi.episodes.delete(projectId, id), options)
}

export function useDuplicateEpisode(projectId: number, options?: UseMutationOptions<number, Episode | null>) {
  return useMutation((id) => projectApi.episodes.duplicate(projectId, id), options)
}
