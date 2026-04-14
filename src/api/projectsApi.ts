import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { ListData, ProjectDTO } from './types'

export interface CreateProjectInput {
  name: string
  code?: string
  description?: string
  organizationCode?: string
}

function mapProject(raw: Record<string, unknown>): ProjectDTO {
  const createdAt =
    typeof raw.created_at === 'number'
      ? new Date(raw.created_at * 1000).toISOString()
      : undefined
  const updatedAt =
    typeof raw.updated_at === 'number'
      ? new Date(raw.updated_at * 1000).toISOString()
      : undefined

  return {
    id: (raw.project_id as number) ?? 0,
    organizationId: (raw.organization_id as number) ?? 0,
    name: (raw.name as string) ?? '',
    description: (raw.description as string) ?? null,
    coverImage: null,
    status: raw.status === 1 ? 'draft' : 'completed',
    ownerId: (raw.owner_id as number) ?? undefined,
    createdAt,
    updatedAt,
  } as ProjectDTO
}

export const projectsApi = {
  list(params?: { page?: number; pageSize?: number }) {
    return requestData<{ list: Record<string, unknown>[]; total: number; page: number; pageSize: number }>(appClient, {
      url: '/project/list',
      method: 'GET',
      params,
    }).then((res) => ({
      list: res.list.map(mapProject),
      pagination: {
        total: res.total,
        page: res.page,
        size: res.pageSize,
      },
    } as ListData<ProjectDTO>))
  },

  detail(projectId: number) {
    return requestData<Record<string, unknown>>(appClient, {
      url: '/project/detail',
      method: 'GET',
      params: { projectId },
    }).then(mapProject)
  },

  create(payload: CreateProjectInput) {
    return requestData<number>(appClient, {
      url: '/project/create',
      method: 'POST',
      data: payload,
    })
  },

  assignUser(payload: { userId: number; projectId: number; role: string }) {
    return requestData<null>(appClient, {
      url: '/project/assign-user',
      method: 'POST',
      data: payload,
    })
  },

  removeUser(payload: { userId: number; projectId: number }) {
    return requestData<null>(appClient, {
      url: '/project/remove-user',
      method: 'POST',
      data: payload,
    })
  },

  users(projectId: number) {
    return requestData<unknown[]>(appClient, {
      url: '/project/users',
      method: 'GET',
      params: { projectId },
    })
  },
}
