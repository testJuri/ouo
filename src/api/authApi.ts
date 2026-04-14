import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { AuthMe, AuthPayload } from './types'
import { isMockMode, mockAuthApi } from './mock'

function mapRoleToRoleId(role: string): number {
  switch (role) {
    case 'SUPER_ADMIN':
      return 1
    case 'ADMIN':
      return 2
    case 'STAFF':
    default:
      return 3
  }
}

function mapBackendUserToAuthMe(raw: Record<string, unknown>): AuthMe {
  const id = ((raw.id as number) ?? (raw.user_id as number)) || 0
  const roleId = (raw.roleId as number) ?? mapRoleToRoleId((raw.role as string) || 'STAFF')
  const organizationIds = (raw.organizationIds as number[]) ??
    ((raw.organization_id as number) ? [raw.organization_id as number] : [])

  const createdAt =
    typeof raw.created_at === 'number'
      ? new Date(raw.created_at * 1000).toISOString()
      : (raw.createdAt as string) || undefined

  const updatedAt =
    typeof raw.updated_at === 'number'
      ? new Date(raw.updated_at * 1000).toISOString()
      : (raw.updatedAt as string) || undefined

  return {
    id,
    username: (raw.username as string) || '',
    email: (raw.email as string) || '',
    avatar: (raw.avatar as string) || null,
    roleId,
    role:
      (raw.role as AuthMe['role']) ||
      (roleId === 1
        ? { id: 1, code: 'SUPER_ADMIN', name: '超级管理员' }
        : roleId === 2
          ? { id: 2, code: 'ADMIN', name: '管理员' }
          : { id: 3, code: 'STAFF', name: '员工' }),
    organizationIds,
    credits: (raw.credits as number) ?? 0,
    createdAt,
    updatedAt,
  }
}

export const authApi = {
  login(payload: { email: string; password: string }) {
    if (isMockMode) {
      return mockAuthApi.login(payload)
    }
    return requestData<AuthPayload>(appClient, {
      url: '/auth/login',
      method: 'POST',
      data: payload,
    }).then((res) => ({
      ...res,
      user: mapBackendUserToAuthMe(res.user as unknown as Record<string, unknown>),
    }))
  },

  register(payload: { username: string; email: string; password: string; phone?: string; organization_code?: string }) {
    if (isMockMode) {
      return mockAuthApi.register(payload)
    }
    return requestData<Record<string, unknown>>(appClient, {
      url: '/auth/register',
      method: 'POST',
      data: payload,
    }).then((rawUser) => ({
      access_token: '',
      refresh_token: '',
      user: mapBackendUserToAuthMe(rawUser),
    } as AuthPayload))
  },

  refresh(refreshToken: string) {
    if (isMockMode) {
      return mockAuthApi.refresh(refreshToken)
    }
    return requestData<{ access_token: string; refresh_token: string; expires_in?: number }>(appClient, {
      url: '/auth/refresh',
      method: 'POST',
      data: { refresh_token: refreshToken },
    })
  },

  me() {
    if (isMockMode) {
      return mockAuthApi.me()
    }
    return requestData<Record<string, unknown>>(appClient, {
      url: '/auth/me',
      method: 'GET',
    }).then(mapBackendUserToAuthMe)
  },

  changePassword(payload: { old_password: string; new_password: string }) {
    if (isMockMode) {
      return mockAuthApi.changePassword(payload)
    }
    return requestData<null>(appClient, {
      url: '/auth/password',
      method: 'PUT',
      data: payload,
    })
  },

  logout(refreshToken: string) {
    if (isMockMode) {
      return mockAuthApi.logout(refreshToken)
    }
    return requestData<null>(appClient, {
      url: '/auth/logout',
      method: 'POST',
      data: { refresh_token: refreshToken },
    })
  },
}
