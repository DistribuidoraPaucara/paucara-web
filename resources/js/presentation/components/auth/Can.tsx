import { PropsWithChildren } from 'react'
import { useAuth } from '@/application/hooks/use-auth'

type Props = PropsWithChildren<{
  permission?: string | string[]
  role?: string | string[]
  not?: boolean
  fallback?: React.ReactNode
}>

export default function Can({ permission, role, not = false, fallback = null, children }: Props) {
  const { can, hasRole } = useAuth()

  const check = (): boolean => {
    const permOk = permission === undefined
      ? true
      : Array.isArray(permission)
        ? permission.every(p => can(p))
        : can(permission)

    const roleOk = role === undefined
      ? true
      : Array.isArray(role)
        ? role.some(r => hasRole(r))
        : hasRole(role)

    return permOk && roleOk
  }

  const allowed = check()
  const show = not ? !allowed : allowed

  return <>{show ? children : fallback}</>
}
