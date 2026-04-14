import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { ListData, ProjectMemberDTO } from './types'

function mapMember(raw: Record<string, unknown>): ProjectMemberDTO {
  return {
    userId: Number(raw.userId) || 0,
    organizationId: Number(raw.organizationId) || 0,
    role: (raw.role as ProjectMemberDTO['role']) || 'viewer',
    assignedBy: raw.assignedBy != null ? Number(raw.assignedBy) : null,
    joinedAt:
      typeof raw.createdAt === 'number'
        ? new Date(raw.createdAt * 1000).toISOString()
        : (raw.joinedAt as string) || new Date().toISOString(),
    user: raw.username
      ? {
          id: Number(raw.userId) || 0,
          username: String(raw.username),
          avatar: (raw.avatar as string) || null,
          email: (raw.email as string) || undefined,
        }
      : undefined,
  }
}

export const projectMembersApi = {
  list(projectId: number) {
    return requestData<Record<string, unknown>[]>(appClient, {
      url: '/project/users',
      method: 'GET',
      params: { projectId },
    }).then((res) => ({
      list: res.map(mapMember),
      pagination: { total: res.length, page: 1, size: res.length },
    } as ListData<ProjectMemberDTO>))
  },

  add(projectId: number, payload: { userId: number; role: 'editor' | 'viewer' | 'owner' | string }) {
    return requestData<null>(appClient, {
      url: '/project/assign-user',
      method: 'POST',
      data: { userId: payload.userId, projectId, role: payload.role },
    })
  },

  remove(projectId: number, userId: number) {
    return requestData<null>(appClient, {
      url: '/project/remove-user',
      method: 'POST',
      data: { userId, projectId },
    })
  },
}
