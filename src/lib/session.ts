const SESSION_STORAGE_KEY = 'mangacanvas-session'
const ACTIVE_PROJECT_ID_STORAGE_KEY = 'mangacanvas-active-project-id'
const UNAUTHORIZED_REDIRECT_FLAG = 'mangacanvas-unauthorized-redirecting'

// 用户字段拆分存储的 key
const USER_KEYS = {
  id: 'mangacanvas-user-id',
  username: 'mangacanvas-user-username',
  email: 'mangacanvas-user-email',
  avatar: 'mangacanvas-user-avatar',
  roleId: 'mangacanvas-user-roleId',
  credits: 'mangacanvas-user-credits',
  organizationIds: 'mangacanvas-user-organizationIds',
  createdAt: 'mangacanvas-user-createdAt',
  updatedAt: 'mangacanvas-user-updatedAt',
} as const

// 角色映射
export const ROLE_MAP: Record<number, { name: string; code: string }> = {
  1: { name: '超级管理员', code: 'superadmin' },
  2: { name: '管理员', code: 'admin' },
  3: { name: '员工', code: 'employee' },
}

export const getRoleName = (roleId: number): string => {
  return ROLE_MAP[roleId]?.name || '未知角色'
}

export const getRoleCode = (roleId: number): string => {
  return ROLE_MAP[roleId]?.code || 'unknown'
}

export const isAdmin = (roleId?: number): boolean => {
  return roleId === 1 || roleId === 2
}

export const isSuperAdmin = (roleId?: number): boolean => {
  return roleId === 1
}

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

  // 保存完整 session 对象（兼容现有逻辑）
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))

  // 拆分存储 user 字段，方便单独读取
  const { user } = session
  localStorage.setItem(USER_KEYS.id, String(user.id))
  localStorage.setItem(USER_KEYS.username, user.username)
  localStorage.setItem(USER_KEYS.email, user.email)
  localStorage.setItem(USER_KEYS.avatar, user.avatar || '')
  localStorage.setItem(USER_KEYS.roleId, String(user.roleId))
  localStorage.setItem(USER_KEYS.credits, String(user.credits ?? 0))
  localStorage.setItem(USER_KEYS.organizationIds, JSON.stringify(user.organizationIds ?? []))
  localStorage.setItem(USER_KEYS.createdAt, user.createdAt || '')
  localStorage.setItem(USER_KEYS.updatedAt, user.updatedAt || '')
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

  // 清除完整 session
  localStorage.removeItem(SESSION_STORAGE_KEY)

  // 清除拆分存储的 user 字段
  Object.values(USER_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })

  // 清除可能遗留的 token key
  localStorage.removeItem('token')

  // 清除 unauthorized redirect flag
  sessionStorage.removeItem(UNAUTHORIZED_REDIRECT_FLAG)
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

// 从拆分存储中获取单个字段（性能更好，无需解析整个 JSON）
export const getUserId = (): number | null => {
  if (!canUseStorage()) return null
  const raw = localStorage.getItem(USER_KEYS.id)
  return raw ? Number(raw) : null
}

export const getUserName = (): string | null => {
  if (!canUseStorage()) return null
  return localStorage.getItem(USER_KEYS.username)
}

export const getUserEmail = (): string | null => {
  if (!canUseStorage()) return null
  return localStorage.getItem(USER_KEYS.email)
}

export const getUserAvatar = (): string | null => {
  if (!canUseStorage()) return null
  const raw = localStorage.getItem(USER_KEYS.avatar)
  return raw || null
}

export const getUserRoleId = (): number | null => {
  if (!canUseStorage()) return null
  const raw = localStorage.getItem(USER_KEYS.roleId)
  return raw ? Number(raw) : null
}

export const getUserCredits = (): number => {
  if (!canUseStorage()) return 0
  const raw = localStorage.getItem(USER_KEYS.credits)
  return raw ? Number(raw) : 0
}

export const getUserOrganizationIds = (): number[] => {
  if (!canUseStorage()) return []
  const raw = localStorage.getItem(USER_KEYS.organizationIds)
  if (!raw) return []
  try {
    return JSON.parse(raw) as number[]
  } catch {
    return []
  }
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

// 清除当前项目 ID（退出登录时调用）
export const clearActiveProjectId = () => {
  if (!canUseStorage()) {
    return
  }
  localStorage.removeItem(ACTIVE_PROJECT_ID_STORAGE_KEY)
}
