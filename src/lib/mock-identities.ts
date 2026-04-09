export const IDENTITY_STORAGE_KEY = "manga-identity"
export const IDENTITY_CHANGE_EVENT = "manga-identity-change"

// 与后端 roleId 对齐：1=超级管理员, 2=管理员, 3=员工
export const identityOptions = [
  { id: "superadmin", label: "超级管理员", roleId: 1, hasProjects: true },
  { id: "admin", label: "管理员", roleId: 2, hasProjects: true },
  { id: "employee", label: "员工", roleId: 3, hasProjects: true },
] as const

export type IdentityOption = (typeof identityOptions)[number]["id"]

export const getStoredIdentity = (): IdentityOption => {
  if (typeof window === "undefined") return "superadmin"
  const stored = localStorage.getItem(IDENTITY_STORAGE_KEY)
  if (stored && identityOptions.some((option) => option.id === stored)) {
    return stored as IdentityOption
  }
  return "superadmin"
}

export const setStoredIdentity = (identity: IdentityOption) => {
  if (typeof window === "undefined") return
  localStorage.setItem(IDENTITY_STORAGE_KEY, identity)
  window.dispatchEvent(new CustomEvent(IDENTITY_CHANGE_EVENT, { detail: identity }))
}

export const getIdentityMeta = (identity: IdentityOption) => {
  return identityOptions.find((option) => option.id === identity) ?? identityOptions[0]
}

export const getIdentityHomePath = (identity: IdentityOption): string => {
  const meta = getIdentityMeta(identity)
  return meta.hasProjects ? "/dashboard" : "/projects"
}

// 根据 roleId 获取身份 ID
export const getIdentityByRoleId = (roleId: number): IdentityOption => {
  const option = identityOptions.find((opt) => opt.roleId === roleId)
  return option?.id ?? "employee"
}

export const canAccessProjectRoutes = (identity: IdentityOption): boolean => {
  return getIdentityMeta(identity).hasProjects
}
