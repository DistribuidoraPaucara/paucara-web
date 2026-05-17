import { Link, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Label } from '@/presentation/components/ui/label'
import { Edit, Users, Shield } from 'lucide-react'
import Can from '@/presentation/components/auth/Can'
import { type BreadcrumbItem } from '@/types'
import type { Role } from '@/domain/entities/admin-permisos'
import { rolesService } from '@/infrastructure/services/roles.service'

interface PageProps {
    role: Role
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/admin/permisos',
    },
    {
        title: 'Detalles del Rol',
        href: '/admin/permisos/roles/show',
    },
]

export default function Show({ role }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rol: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Detalles del Rol</h1>
                        <p className="text-muted-foreground">
                            Información completa del rol y sus asignaciones.
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Can permission="roles.edit">
                            <Button variant="outline" asChild>
                                <Link href={rolesService.editUrl(role.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                            </Button>
                        </Can>
                        {/* <Button variant="outline" asChild>
                            <Link href={rolesService.indexUrl()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Información del Rol */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Información del Rol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                                <p className="text-lg font-semibold">{role.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Guard Name</Label>
                                <p>{role.guard_name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
                                <p>{new Date(role.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Usuarios Asignados</Label>
                                <p className="text-2xl font-bold text-primary">{role.users?.length ?? 0}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Permisos Asignados</Label>
                                <p className="text-2xl font-bold text-primary">{role.permissions?.length ?? 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permisos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permisos Asignados</CardTitle>
                            <CardDescription>
                                Lista de permisos que tiene este rol.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {(role.permissions?.length ?? 0) > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions?.map((permission) => (
                                        <Badge key={permission.id} variant="secondary">
                                            {permission.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No hay permisos asignados a este rol.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Usuarios Asignados */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Usuarios Asignados
                            </CardTitle>
                            <CardDescription>
                                Usuarios que tienen este rol asignado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {(role.users?.length ?? 0) > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {role.users?.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No hay usuarios asignados a este rol.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
