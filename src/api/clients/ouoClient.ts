import { message } from 'antd'
import { createHttpClient } from '@/api/core'

const OUO_AUTH_TOKEN_KEY = 'ouo-auth-token'
const OUO_USER_ID_KEY = 'ouo-user-id'

export const getOuoAuthToken = (): string => {
  return localStorage.getItem(OUO_AUTH_TOKEN_KEY) || '2973003c-0bb5-498f-b908-f52422dc53ac'
}

export const setOuoAuthToken = (token: string) => {
  localStorage.setItem(OUO_AUTH_TOKEN_KEY, token)
}

export const getOuoUserId = (): string => {
  return localStorage.getItem(OUO_USER_ID_KEY) || 'f8ce94ef-e790-196d-98fa-386f2a91c630'
}

export const setOuoUserId = (userId: string) => {
  localStorage.setItem(OUO_USER_ID_KEY, userId)
}

const DEFAULT_OUO_BASE_URL = import.meta.env.DEV
  ? '/ouo-api'
  : 'https://ouo.xuanyeai.com/dynamic-pro/api/v1.0'

export const ouoClient = createHttpClient({
  baseURL: DEFAULT_OUO_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
    'x-project-code': 'DYNAMIC_PRO',
  },
  resolveHeaders: () => {
    const token = getOuoAuthToken()
    return {
      authorization: token,
    }
  },
  onError: (error) => {
    message.error(error.message)
  },
})
