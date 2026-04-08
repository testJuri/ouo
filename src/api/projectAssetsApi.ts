import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { ListData, ProjectAssetDTO } from './types'
import { isMockMode, mockProjectAssetsApi } from './mock'

export const projectAssetsApi = {
  list(projectId: number, params?: { page?: number; size?: number; sourceType?: ProjectAssetDTO['sourceType'] }) {
    if (isMockMode) {
      return mockProjectAssetsApi.list(projectId, params)
    }
    return requestData<ListData<ProjectAssetDTO>>(appClient, {
      url: `/projects/${projectId}/assets`,
      method: 'GET',
      params,
    })
  },
}
