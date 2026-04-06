export const needBrowserAuthHeader = (): boolean => {
  return import.meta.env.DEV || window.location.protocol === 'https:'
}

export const getAppApiConfig = () => {
  return {
    apiKey: localStorage.getItem('apiKey') || '',
    baseURL: localStorage.getItem('apiBaseUrl') || '/v1',
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
