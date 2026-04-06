import { message } from 'antd'
import { createHttpClient } from '@/api/core'
import { getAppApiConfig } from '@/api/core'

export const appClient = createHttpClient({
  baseURL: '/v1',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
  resolveBaseURL: () => getAppApiConfig().baseURL,
  resolveHeaders: () => {
    const { apiKey } = getAppApiConfig()

    if (!apiKey) {
      return {}
    }

    return {
      Authorization: `Bearer ${apiKey}`,
    }
  },
  onError: (error) => {
    message.error(error.message)
  },
})
