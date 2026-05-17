import { Link, router, usePage, Head } from '@inertiajs/react'
import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import toast from 'react-hot-toast'
import { Trash2, Pencil, Plus, Search, Users, Shield } from 'lucide-react'
import Can from '@/presentation/components/auth/Can'
import { type BreadcrumbItem } from '@/types'
import type { Role } from '@/domain/entities/admin-permisos'
import { rolesService } from '@/infrastructure/services/roles.service'

interface PaginationLink {
    url: string | null
    label: string
    active: boolean
}

interface PaginationMeta {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
}

interface PageProps {
    roles: {
        data: Role[]
        links: PaginationLink[]
        meta: PaginationMeta
    }
    filters: {
        search?: string
    }
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/admin/permisos',
    },
    {
        title: 'Gestión de Roles',
        href: '/admin/permisos/roles',
    },
]

export default function Index() {
    const { roles, filters } = usePage<PageProps>().props
    const [searchTerm, setSearchTerm] = useState(filters.search || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(rolesService.indexUrl(), {
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleDelete = (role: Role) => {
        if ((role.users_count ?? 0) > 0) {
            toast.error(`No se puede eliminar el rol "${role.name}" porque tiene ${role.users_count} usuario(s) asignado(s).`)
            return
        }

        if (confirm(`¿Estás seguro de que quieres eliminar el rol "${role.name}"?`)) {
            router.delete(rolesService.destroyUrl(role.id), {
                onSuccess: () => {
                    toast.success('Rol eliminado exitosamente.')
                },
                onError: () => {
                    toast.error('Ocurrió un error al eliminar el rol.')
                }
            })
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        router.get(rolesService.indexUrl())
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Gestión de Roles
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra los roles del sistema
                            </p>
                        </div>
                        <Can permission="roles.create">
                            <Link href={rolesService.createUrl()}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Rol
                                </Button>
                            </Link>
                        </Can>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Roles</CardTitle>
                            <CardDescription>
                                Lista de todos los roles del sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Filtros */}
                            <form onSubmit={handleSearch} className="mb-6 space-y-4 lg:flex lg:space-x-4 lg:space-y-0">
                                <div className="flex-1">
                                    <Label htmlFor="search">Buscar</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="Buscar por nombre de rol..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-2 lg:items-end lg:pb-0.5">
                                    <Button type="submit">Buscar</Button>
                                    {searchTerm && (
                                        <Button type="button" variant="outline" onClick={clearFilters}>
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </form>

                            {/* Tabla de roles */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Rol
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Usuarios
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Permisos
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Fecha Creación
                                            </th>
                                            <th className="py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.data.map((role) => (
                                            <tr
                                                key={role.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {role.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                Guard: {role.guard_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            {role.users_count} usuario{role.users_count !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline">
                                                            {role.permissions_count} permiso{role.permissions_count !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(role.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end space-x-2">
                                                        <Can permission="roles.show">
                                                            <Link href={rolesService.showUrl(role.id)}>
                                                                <Button size="sm" variant="ghost">
                                                                    Ver
                                                                </Button>
                                                            </Link>
                                                        </Can>
                                                        <Can permission="roles.edit">
                                                            <Link href={rolesService.editUrl(role.id)}>
                                                                <Button size="sm" variant="ghost">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </Can>
                                                        <Can permission="roles.delete">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(role)}
                                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </Can>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mensaje si no hay roles */}
                            {roles.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No se encontraron roles.
                                    </p>
                                </div>
                            )}

                            {/* Paginación */}
                            {roles.links && roles.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {roles.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url)
                                                    }
                                                }}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    } rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
