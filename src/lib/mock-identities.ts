export const IDENTITY_STORAGE_KEY = "manga-identity"
export const IDENTITY_CHANGE_EVENT = "manga-identity-change"

export const identityOptions = [
  { id: "creator", label: "创作者", hasProjects: true },
  { id: "admin", label: "管理员", hasProjects: true },
  { id: "coordinator", label: "项目统筹", hasProjects: true },
  { id: "newcomer", label: "新成员", hasProjects: false },
] as const

export type IdentityOption = (typeof identityOptions)[number]["id"]

export const getStoredIdentity = (): IdentityOption => {
  if (typeof window === "undefined") return "creator"
  const stored = localStorage.getItem(IDENTITY_STORAGE_KEY)
  if (stored && identityOptions.some((option) => option.id === stored)) {
    return stored as IdentityOption
  }
  return "creator"
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

export const canAccessProjectRoutes = (identity: IdentityOption): boolean => {
  return getIdentityMeta(identity).hasProjects
}
