import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { ListData, ProjectMemberDTO } from './types'
import { isMockMode, mockProjectMembersApi } from './mock'

export const projectMembersApi = {
  list(projectId: number) {
    if (isMockMode) {
      return mockProjectMembersApi.list(projectId)
    }
    return requestData<ListData<ProjectMemberDTO>>(appClient, {
      url: `/projects/${projectId}/members`,
      method: 'GET',
    })
  },

  add(projectId: number, payload: { userId: number; role: 'editor' | 'viewer' }) {
    if (isMockMode) {
      return mockProjectMembersApi.add(projectId, payload)
    }
    return requestData<ProjectMemberDTO>(appClient, {
      url: `/projects/${projectId}/members`,
      method: 'POST',
      data: payload,
    })
  },

  updateRole(projectId: number, userId: number, role: 'owner' | 'editor' | 'viewer') {
    if (isMockMode) {
      return mockProjectMembersApi.updateRole(projectId, userId, role)
    }
    return requestData<ProjectMemberDTO>(appClient, {
      url: `/projects/${projectId}/members/${userId}`,
      method: 'PATCH',
      data: { role },
    })
  },

  remove(projectId: number, userId: number) {
    if (isMockMode) {
      return mockProjectMembersApi.remove(projectId, userId)
    }
    return requestData<true>(appClient, {
      url: `/projects/${projectId}/members/${userId}`,
      method: 'DELETE',
    })
  },
}
