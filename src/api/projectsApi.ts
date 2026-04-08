import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { ListData, ProjectDTO, ProjectDetailDTO } from './types'
import { isMockMode, mockProjectsApi } from './mock'

export interface CreateProjectInput {
  organizationId: number
  name: string
  description?: string
  coverImage?: string | null
  isPublic?: boolean
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  coverImage?: string | null
  status?: ProjectDTO['status']
  isPublic?: boolean
}

export const projectsApi = {
  list(params?: { page?: number; size?: number; status?: ProjectDTO['status']; organizationId?: number }) {
    if (isMockMode) {
      return mockProjectsApi.list(params)
    }
    return requestData<ListData<ProjectDTO>>(appClient, {
      url: '/projects',
      method: 'GET',
      params,
    })
  },

  getById(projectId: number) {
    if (isMockMode) {
      return mockProjectsApi.getById(projectId)
    }
    return requestData<ProjectDetailDTO>(appClient, {
      url: `/projects/${projectId}`,
      method: 'GET',
    })
  },

  create(payload: CreateProjectInput) {
    if (isMockMode) {
      return mockProjectsApi.create(payload)
    }
    return requestData<ProjectDTO>(appClient, {
      url: '/projects',
      method: 'POST',
      data: payload,
    })
  },

  update(projectId: number, payload: UpdateProjectInput) {
    if (isMockMode) {
      return mockProjectsApi.update(projectId, payload)
    }
    return requestData<ProjectDTO>(appClient, {
      url: `/projects/${projectId}`,
      method: 'PUT',
      data: payload,
    })
  },

  remove(projectId: number) {
    if (isMockMode) {
      return mockProjectsApi.remove(projectId)
    }
    return requestData<true>(appClient, {
      url: `/projects/${projectId}`,
      method: 'DELETE',
    })
  },
}
