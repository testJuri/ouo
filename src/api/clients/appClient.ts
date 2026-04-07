import { message } from 'antd'
import { createHttpClient } from '@/api/core'
import { DEFAULT_APP_API_BASE_URL, getAppApiConfig } from '@/api/core'

export const appClient = createHttpClient({
  baseURL: DEFAULT_APP_API_BASE_URL,
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
