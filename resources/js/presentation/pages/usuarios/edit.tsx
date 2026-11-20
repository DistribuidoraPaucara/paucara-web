import { Link, useForm, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import InputError from '@/presentation/components/input-error'
import toast from 'react-hot-toast'
import { ArrowLeft, ChevronDown, ChevronRight, Save, Search, X } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

interface Permission {
    id: number
    name: string
    description?: string | null
}

interface User {
    id: number
    name: string
    usernick: string
    email: string | null
    roles: Array<{
        id: number
        name: string
        permissions?: Array<{
            id: number
            name: string
        }>
    }>
}

interface Role {
    id: number
    name: string
    permissions?: Array<{ id: number }>
}

interface PageProps {
    user: User
    roles: Role[]
    userRoles: number[]
    permissions: Record<string, Permission[]>
    userPermissions: number[]
    [key: string]: unknown
}

type PermissionView = 'all' | 'selected' | 'unselected'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Usuarios',
        href: '/usuarios',
    },
    {
        title: 'Editar Usuario',
        href: '',
    },
]

const normalize = (value: string) =>
    value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Edit({ user, roles, userRoles, permissions, userPermissions }: PageProps) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        name: user.name || '',
        usernick: user.usernick || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || [],
        permissions: userPermissions || [],
    })

    const [search, setSearch] = React.useState('')
    const [view, setView] = React.useState<PermissionView>('all')
    const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set())

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(`/usuarios/${user.id}`, {
            onSuccess: () => {
                toast.success('Usuario actualizado exitosamente.')
            },
            onError: () => {
                toast.error('Ocurrió un error al actualizar el usuario.')
            }
        })
    }

    const handleRoleChange = (id: number) => {
        setData('roles', data.roles.includes(id)
            ? data.roles.filter(r => r !== id)
            : [...data.roles, id]
        )
    }

    const handlePermissionChange = (id: number) => {
        setData('permissions', data.permissions.includes(id)
            ? data.permissions.filter(p => p !== id)
            : [...data.permissions, id]
        )
    }

    // Permisos heredados según los roles marcados actualmente (se recalcula al cambiar roles).
    // Si el controller no envía roles[].permissions, se usa lo cargado en user.roles.
    const inheritedPermissionIds = React.useMemo(() => {
        const ids = new Set<number>()
        const fallback = new Map((user.roles || []).map((r) => [r.id, r.permissions || []]))
        roles
            .filter((r) => data.roles.includes(r.id))
            .forEach((r) => (r.permissions ?? fallback.get(r.id) ?? []).forEach((p) => ids.add(p.id)))
        return ids
    }, [roles, user.roles, data.roles])

    const selectedPermissionIds = React.useMemo(() => new Set(data.permissions), [data.permissions])

    const isEffective = React.useCallback(
        (id: number) => inheritedPermissionIds.has(id) || selectedPermissionIds.has(id),
        [inheritedPermissionIds, selectedPermissionIds]
    )

    // Grupos filtrados por búsqueda (grupo, nombre o descripción) y por vista
    const filteredGroups = React.useMemo(() => {
        const term = normalize(search.trim())
        return Object.entries(permissions)
            .map(([group, perms]) => {
                const groupMatches = term !== '' && normalize(group).includes(term)
                const items = perms.filter((perm) => {
                    if (view === 'selected' && !isEffective(perm.id)) return false
                    if (view === 'unselected' && isEffective(perm.id)) return false
                    if (term === '' || groupMatches) return true
                    return normalize(perm.name).includes(term) || normalize(perm.description ?? '').includes(term)
                })
                return [group, items] as const
            })
            .filter(([, items]) => items.length > 0)
    }, [permissions, search, view, isEffective])

    const allPermissions = React.useMemo(() => Object.values(permissions).flat(), [permissions])
    const totalEffective = allPermissions.filter((p) => isEffective(p.id)).length
    const visiblePermissions = filteredGroups.flatMap(([, items]) => items)
    const isFiltering = search.trim() !== '' || view !== 'all'

    // Marca/desmarca solo permisos editables (los heredados no se tocan)
    const setPermissionsChecked = (perms: Permission[], checked: boolean) => {
        const ids = perms.filter((p) => !inheritedPermissionIds.has(p.id)).map((p) => p.id)
        if (checked) {
            setData('permissions', Array.from(new Set([...data.permissions, ...ids])))
        } else {
            const remove = new Set(ids)
            setData('permissions', data.permissions.filter((id) => !remove.has(id)))
        }
    }

    const checkedState = (perms: Permission[]): boolean | 'indeterminate' => {
        const count = perms.filter((p) => isEffective(p.id)).length
        if (count === 0) return false
        return count === perms.length ? true : 'indeterminate'
    }

    const toggleGroup = (group: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev)
            if (next.has(group)) next.delete(group)
            else next.add(group)
            return next
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuario: ${user.name}`} />

            <div className="py-2">
                <div className="sm:px-2">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Editar Us.: {user.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Actualiza la información del usuario
                            </p>
                        </div>
                        {/* <Link href="/usuarios">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link> */}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                            <CardDescription>
                                Modifique los campos que desee actualizar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <div className="grid gap-6 md:grid-cols-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre completo</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ingrese el nombre completo"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="usernick">Nombre de usuario</Label>
                                        <Input
                                            id="usernick"
                                            type="text"
                                            value={data.usernick}
                                            onChange={(e) => setData('usernick', e.target.value)}
                                            placeholder="Ingrese el nombre de usuario"
                                            required
                                        />
                                        <InputError message={errors.usernick} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email (opcional)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Ingrese el correo electrónico"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">N. contraseña (opcional)</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Dejar vacío para mantener la actual"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmar n. contraseña</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirme la nueva contraseña"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Roles</Label>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={data.roles.includes(role.id)}
                                                    onCheckedChange={() => handleRoleChange(role.id)}
                                                />
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    {role.name}
                                                    {role.permissions && (
                                                        <span className="ml-1 text-xs text-gray-400">({role.permissions.length})</span>
                                                    )}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Label>Permisos directos</Label>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <Badge variant="secondary">{totalEffective} / {allPermissions.length} efectivos</Badge>
                                            <Badge variant="outline">{data.permissions.length} directos</Badge>
                                            <Badge variant="outline">{inheritedPermissionIds.size} heredados</Badge>
                                        </div>
                                    </div>

                                    {/* Barra de herramientas: búsqueda, vista y acciones masivas */}
                                    <div className="flex flex-col gap-2 rounded-md border p-3 md:flex-row md:items-center">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.preventDefault()
                                                    if (e.key === 'Escape') setSearch('')
                                                }}
                                                placeholder="Buscar por módulo, permiso o descripción..."
                                                className="pl-8 pr-8"
                                            />
                                            {search && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSearch('')}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    aria-label="Limpiar búsqueda"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <select
                                            value={view}
                                            onChange={(e) => setView(e.target.value as PermissionView)}
                                            className="h-9 rounded-md border border-input bg-input-background px-2 text-sm"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="selected">Solo asignados</option>
                                            <option value="unselected">Solo sin asignar</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPermissionsChecked(visiblePermissions, true)}
                                                disabled={visiblePermissions.length === 0}
                                            >
                                                {isFiltering ? 'Marcar visibles' : 'Marcar todos'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPermissionsChecked(visiblePermissions, false)}
                                                disabled={visiblePermissions.length === 0}
                                            >
                                                {isFiltering ? 'Desmarcar visibles' : 'Desmarcar todos'}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 text-xs">
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                            onClick={() => setCollapsed(new Set())}
                                        >
                                            Expandir todo
                                        </button>
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                            onClick={() => setCollapsed(new Set(Object.keys(permissions)))}
                                        >
                                            Colapsar todo
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {filteredGroups.length === 0 && (
                                            <p className="rounded-md border border-dashed p-6 text-center text-sm text-gray-500">
                                                No se encontraron permisos con los filtros actuales.
                                            </p>
                                        )}

                                        {filteredGroups.map(([group, items]) => {
                                            // Con búsqueda activa los grupos se muestran siempre abiertos
                                            const isOpen = search.trim() !== '' || !collapsed.has(group)
                                            const groupTotal = permissions[group]
                                            const groupCount = groupTotal.filter((p) => isEffective(p.id)).length
                                            const allInherited = items.every((p) => inheritedPermissionIds.has(p.id))
                                            const state = checkedState(items)

                                            return (
                                                <div key={group} className="rounded-md border">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                                                        <Checkbox
                                                            checked={state}
                                                            disabled={allInherited}
                                                            onCheckedChange={() => setPermissionsChecked(items, state !== true)}
                                                            aria-label={`Seleccionar todos los permisos de ${group}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleGroup(group)}
                                                            className="flex flex-1 items-center justify-between text-left"
                                                        >
                                                            <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                                                                {group}
                                                            </span>
                                                            <span className="flex items-center gap-2 text-xs text-gray-500">
                                                                {groupCount} / {groupTotal.length}
                                                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                            </span>
                                                        </button>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="grid gap-2 p-3 md:grid-cols-2 lg:grid-cols-3">
                                                            {items.map((perm) => {
                                                                const isInherited = inheritedPermissionIds.has(perm.id)
                                                                return (
                                                                    <div key={perm.id} className="flex items-start space-x-2" title={perm.description ?? perm.name}>
                                                                        <Checkbox
                                                                            id={`perm-${perm.id}`}
                                                                            className="mt-0.5"
                                                                            checked={isEffective(perm.id)}
                                                                            disabled={isInherited}
                                                                            onCheckedChange={() => handlePermissionChange(perm.id)}
                                                                        />
                                                                        <label
                                                                            htmlFor={`perm-${perm.id}`}
                                                                            className={`text-sm ${isInherited ? 'text-gray-400 dark:text-gray-500' : 'cursor-pointer text-gray-700 dark:text-gray-300'}`}
                                                                        >
                                                                            <span className="break-all">{perm.name}</span>
                                                                            {isInherited && <span className="ml-2 text-xs text-gray-400">(heredado)</span>}
                                                                            {perm.description && (
                                                                                <span className="block text-xs text-gray-500 dark:text-gray-400">{perm.description}</span>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <InputError message={errors.permissions} />
                                </div>

                                <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-4 border-t bg-white px-6 py-3 dark:bg-gray-950">
                                    {isDirty && (
                                        <span className="mr-auto text-xs text-amber-600 dark:text-amber-400">
                                            Hay cambios sin guardar
                                        </span>
                                    )}
                                    <Link href="/usuarios">
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing || !isDirty}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Actualizando...' : 'Actualizar Usuario'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
