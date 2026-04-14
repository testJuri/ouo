import { message } from 'antd'
import { createHttpClient } from '@/api/core'
import { getAuthToken } from '@/lib/session'

export const aiClient = createHttpClient({
  baseURL: '/api/v1',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
  resolveHeaders: () => {
    const token = getAuthToken()
    if (!token) {
      return {}
    }
    return {
      Authorization: `Bearer ${token}`,
    }
  },
  onError: (error) => {
    message.error(error.message)
  },
})
