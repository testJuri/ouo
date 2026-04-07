export const DEFAULT_APP_API_BASE_URL = 'http://124.156.186.82:8080/api/v1'

export const needBrowserAuthHeader = (): boolean => {
  return import.meta.env.DEV || window.location.protocol === 'https:'
}

export const getAppApiConfig = () => {
  const runtimeBaseURL = import.meta.env.VITE_APP_API_BASE_URL || DEFAULT_APP_API_BASE_URL

  return {
    apiKey: localStorage.getItem('apiKey') || '',
    baseURL: runtimeBaseURL,
  }
}

export const getDashScopeApiKey = (): string => {
  return localStorage.getItem('dashscopeApiKey') || ''
}

export const getDashScopeCompatibleConfig = () => {
  return {
    apiKey: getDashScopeApiKey(),
    baseURL: '/dashscope-compatible',
  }
}

export const buildBearerAuthHeader = (
  token: string,
  missingTokenMessage: string
): Record<string, string> => {
  if (!token) {
    throw new Error(missingTokenMessage)
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}
