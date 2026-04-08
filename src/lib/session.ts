const SESSION_STORAGE_KEY = 'mangacanvas-session'
const ACTIVE_PROJECT_ID_STORAGE_KEY = 'mangacanvas-active-project-id'
const UNAUTHORIZED_REDIRECT_FLAG = 'mangacanvas-unauthorized-redirecting'

export interface SessionRole {
  id: number
  code: string
  name: string
}

export interface SessionUser {
  id: number
  username: string
  email: string
  avatar: string | null
  roleId: number
  role?: SessionRole
  organizationIds?: number[]
  credits?: number
  createdAt?: string
  updatedAt?: string
}

export interface SessionState {
  token: string
  refreshToken?: string
  user: SessionUser
}

const canUseStorage = () => typeof window !== 'undefined'

export const getSession = (): SessionState | null => {
  if (!canUseStorage()) {
    return null
  }

  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SessionState
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export const saveSession = (session: SessionState) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export const updateSessionUser = (user: SessionUser) => {
  const current = getSession()
  if (!current) {
    return
  }

  saveSession({
    ...current,
    user,
  })
}

export const clearSession = () => {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export const getAuthToken = (): string => {
  return getSession()?.token || ''
}

export const getRefreshToken = (): string => {
  return getSession()?.refreshToken || ''
}

export const getCurrentUser = (): SessionUser | null => {
  return getSession()?.user || null
}

export const getActiveProjectId = (): number | null => {
  if (!canUseStorage()) {
    return null
  }

  const raw = localStorage.getItem(ACTIVE_PROJECT_ID_STORAGE_KEY)
  if (!raw) {
    return null
  }

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export const setActiveProjectId = (projectId: number) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(ACTIVE_PROJECT_ID_STORAGE_KEY, String(projectId))
}

export const redirectToLogin = (reason?: string) => {
  if (!canUseStorage()) {
    return
  }

  if (sessionStorage.getItem(UNAUTHORIZED_REDIRECT_FLAG) === '1') {
    return
  }

  sessionStorage.setItem(UNAUTHORIZED_REDIRECT_FLAG, '1')
  clearSession()

  const target = reason ? `/login?reason=${encodeURIComponent(reason)}` : '/login'
  if (window.location.pathname !== '/login') {
    window.location.assign(target)
    return
  }

  sessionStorage.removeItem(UNAUTHORIZED_REDIRECT_FLAG)
}

export const clearUnauthorizedRedirectFlag = () => {
  if (!canUseStorage()) {
    return
  }

  sessionStorage.removeItem(UNAUTHORIZED_REDIRECT_FLAG)
}
