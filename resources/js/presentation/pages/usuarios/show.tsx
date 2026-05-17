import { Link, Head } from '@inertiajs/react'
import { type ReactNode } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { ArrowLeft, Edit, Mail, User, Calendar, Shield } from 'lucide-react'
import Can from '@/presentation/components/auth/Can'
import { type BreadcrumbItem } from '@/types'
import type { UsersShowPageProps } from '@/domain/entities/usuarios'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Usuarios',
        href: '/usuarios',
    },
    {
        title: 'Ver Usuario',
        href: '',
    },
]

export default function Show({ user }: UsersShowPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuario: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Detalles del Usuario
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Información completa del usuario
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Link href="/usuarios">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                            </Link>
                            <Can permission="usuarios.edit">
                                <Link href={`/usuarios/${user.id}/edit`}>
                                    <Button>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                </Link>
                            </Can>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Información básica */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription>
                                    Datos básicos del usuario
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre completo
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {user.name}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre de usuario
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        @{user.usernick}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Correo electrónico
                                        </Label>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Fecha de registro
                                        </Label>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Última actualización
                                        </Label>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Roles y permisos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Roles y Permisos
                                </CardTitle>
                                <CardDescription>
                                    Roles asignados y permisos del usuario
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Roles asignados
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge key={role.id} variant="default">
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No tiene roles asignados
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Permisos directos
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {user.permissions.length > 0 ? (
                                            user.permissions.map((permission) => (
                                                <Badge key={permission.id} variant="outline">
                                                    {permission.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No tiene permisos directos asignados
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {user.roles.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Permisos por roles
                                        </Label>
                                        <div className="mt-2 space-y-3">
                                            {user.roles.map((role) => (
                                                <div key={role.id} className="rounded-lg border p-3">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {role.name}
                                                    </h4>
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {role.permissions.length > 0 ? (
                                                            role.permissions.map((permission) => (
                                                                <Badge key={permission.id} variant="secondary" className="text-xs">
                                                                    {permission.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Este rol no tiene permisos asignados
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`text-sm font-medium ${className}`}>
            {children}
        </div>
    )
}
