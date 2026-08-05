import { Link, useForm, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import InputError from '@/presentation/components/input-error'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Lock, Shield } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

interface Empleado {
    id: number
    nombre: string
    codigo_empleado: string
    user_id?: number
    user?: {
        id: number
        name: string
        usernick: string
        email: string
        roles: Array<{
            id: number
            name: string
        }>
    }
}

interface Role {
    id: number
    name: string
}

interface Permission {
    id: number
    name: string
}

interface PageProps {
    empleado: Empleado
    roles: Role[]
    permissions: Record<string, Permission[]>
    userRoles: number[]
    userPermissions: number[]
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Empleados',
        href: '/empleados',
    },
    {
        title: 'Acceso al Sistema',
        href: '',
    },
]

export default function EmpleadoAccesoSistema({ empleado, roles, permissions, userRoles, userPermissions }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        usernick: empleado.user?.usernick || '',
        email: empleado.user?.email || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || [],
        permissions: userPermissions || [],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(`/empleados/${empleado.id}`, {
            onSuccess: () => {
                toast.success('Acceso del empleado actualizado exitosamente.')
            },
            onError: () => {
                toast.error('Ocurrió un error al actualizar el acceso del empleado.')
            }
        })
    }

    const handleRoleChange = (roleId: string) => {
        const id = parseInt(roleId)
        setData('roles', data.roles.includes(id)
            ? data.roles.filter(r => r !== id)
            : [...data.roles, id]
        )
    }

    const handlePermissionChange = (permissionId: string) => {
        const id = parseInt(permissionId)
        setData('permissions', data.permissions.includes(id)
            ? data.permissions.filter(p => p !== id)
            : [...data.permissions, id]
        )
    }

    // Permisos heredados por roles
    const inheritedPermissionIds = React.useMemo(() => {
        const ids: number[] = []
        empleado.user?.roles?.forEach((role) => {
            // Obtener permisos del rol del Object.values(permissions)
            Object.values(permissions).flat().forEach((perm) => {
                // Este es una simplificación - en producción necesitarías
                // que el backend envíe los permisos de cada rol
                ids.push(perm.id)
            })
        })
        return new Set<number>(ids)
    }, [empleado.user?.roles, permissions])

    if (!empleado.user_id) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Acceso del Empleado: ${empleado.nombre}`} />
                <div className="py-12">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                                            Sin Usuario Asociado
                                        </h3>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            Este empleado no tiene un usuario del sistema. Primero debe crear un usuario en la pantalla de edición.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Acceso del Empleado: ${empleado.nombre}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Acceso del Empleado: {empleado.nombre}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Código: {empleado.codigo_empleado} • Usuario: {empleado.user?.usernick}
                            </p>
                        </div>
                        <Link href={`/empleados/${empleado.id}/edit`}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Configuración de Acceso
                            </CardTitle>
                            <CardDescription>
                                Configure los roles y permisos de acceso al sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Credenciales */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="usernick">Nombre de usuario</Label>
                                        <Input
                                            id="usernick"
                                            type="text"
                                            value={data.usernick}
                                            onChange={(e) => setData('usernick', e.target.value)}
                                            placeholder="Nick de usuario"
                                            disabled
                                        />
                                        <InputError message={errors.usernick} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Correo"
                                            disabled
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Nueva contraseña (opcional)</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Dejar vacío para mantener la actual"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirmar nueva contraseña"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className="space-y-2">
                                    <Label>Roles Asignados</Label>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.id}`}
                                                    checked={data.roles.includes(role.id)}
                                                    onChange={() => handleRoleChange(role.id.toString())}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} />
                                </div>

                                {/* Permisos */}
                                <div className="space-y-2">
                                    <Label>Permisos Directos</Label>
                                    <div className="space-y-4">
                                        {Object.entries(permissions).map(([group, perms]) => (
                                            <div key={group}>
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {group.charAt(0).toUpperCase() + group.slice(1)}
                                                </h4>
                                                <div className="mt-2 grid gap-2 md:grid-cols-3">
                                                    {perms.map((perm: Permission) => {
                                                        const isInherited = inheritedPermissionIds.has(perm.id)
                                                        const isChecked = isInherited || data.permissions.includes(perm.id)
                                                        return (
                                                            <div key={perm.id} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`perm-${perm.id}`}
                                                                    checked={isChecked}
                                                                    onChange={() => handlePermissionChange(perm.id.toString())}
                                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    disabled={isInherited}
                                                                />
                                                                <label
                                                                    htmlFor={`perm-${perm.id}`}
                                                                    className={`text-sm ${isInherited ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                                                                >
                                                                    {perm.name}
                                                                    {isInherited && <span className="ml-2 text-xs text-gray-400">(heredado)</span>}
                                                                </label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.permissions} />
                                </div>

                                {/* Botón de guardar */}
                                <div className="flex justify-end gap-2">
                                    <Link href={`/empleados/${empleado.id}/edit`}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
