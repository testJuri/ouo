import { appClient } from './clients/appClient'
import { requestData } from './core/response'
import type { AuthMe, AuthPayload } from './types'
import { isMockMode, mockAuthApi } from './mock'

export const authApi = {
  login(payload: { email: string; password: string }) {
    if (isMockMode) {
      return mockAuthApi.login(payload)
    }
    return requestData<AuthPayload>(appClient, {
      url: '/auth/login',
      method: 'POST',
      data: payload,
    })
  },

  register(payload: { username: string; email: string; password: string; avatar?: string }) {
    if (isMockMode) {
      return mockAuthApi.register(payload)
    }
    return requestData<AuthPayload>(appClient, {
      url: '/auth/register',
      method: 'POST',
      data: payload,
    })
  },

  refresh(refreshToken: string) {
    if (isMockMode) {
      return mockAuthApi.refresh(refreshToken)
    }
    return requestData<{ token: string; refreshToken: string }>(appClient, {
      url: '/auth/refresh',
      method: 'POST',
      data: { refreshToken },
    })
  },

  me() {
    if (isMockMode) {
      return mockAuthApi.me()
    }
    return requestData<AuthMe>(appClient, {
      url: '/auth/me',
      method: 'GET',
    })
  },
}
