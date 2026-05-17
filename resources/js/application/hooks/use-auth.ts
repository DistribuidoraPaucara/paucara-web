import { usePage } from '@inertiajs/react'

export type AuthUser = {
  id: number
  name: string
  email: string
  usernick?: string
} | null

export type AuthShared = {
  auth?: {
    user: AuthUser
    roles: string[]
    permissions: string[]
    sanctumToken?: string // ✅ Token Sanctum para autenticación WebSocket
  }
}

export function useAuth() {
  const { props } = usePage<AuthShared>()
  const auth = props?.auth ?? { user: null, roles: [], permissions: [] }

  const hasRole = (role: string): boolean => {
    return (auth.roles ?? []).includes(role)
  }

  const can = (permission: string): boolean => {
    return (auth.permissions ?? []).includes(permission)
  }

  return {
    user: auth.user,
    roles: auth.roles ?? [],
    permissions: auth.permissions ?? [],
    hasRole,
    can,
  }
}
