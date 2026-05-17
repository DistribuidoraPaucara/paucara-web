import { Link, router, usePage, Head } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Trash2, Pencil, Plus, Search } from 'lucide-react'
import Can from '@/presentation/components/auth/Can'
import { type BreadcrumbItem } from '@/types'
import { NotificationService } from '@/infrastructure/services/notification.service'
import type { Usuario, UsersIndexPageProps } from '@/domain/entities/usuarios'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Usuarios',
        href: '/usuarios',
    },
]

export default function Index() {
    const { users, roles, filters } = usePage<UsersIndexPageProps>().props
    const [searchTerm, setSearchTerm] = useState(filters.search || '')
    const [selectedRole, setSelectedRole] = useState(filters.role || '')

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.get('/usuarios', {
            search: searchTerm,
            role: selectedRole,
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleDelete = (user: Usuario) => {
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
            router.delete(`/usuarios/${user.id}`, {
                onSuccess: () => {
                    NotificationService.success('Usuario eliminado exitosamente.')
                },
                onError: () => {
                    NotificationService.error('Ocurrió un error al eliminar el usuario.')
                }
            })
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedRole('')
        router.get('/usuarios')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Gestión de Usuarios
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra los usuarios del sistema
                            </p>
                        </div>
                        <Can permission="usuarios.create">
                            <Link href="/usuarios/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Usuario
                                </Button>
                            </Link>
                        </Can>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Usuarios</CardTitle>
                            <CardDescription>
                                Lista de todos los usuarios registrados en el sistema
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
                                            placeholder="Buscar por nombre, email o usuario..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="lg:w-48">
                                    <Label htmlFor="role">Rol</Label>
                                    <select
                                        id="role"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                                    >
                                        <option value="">Todos los roles</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex space-x-2 lg:items-end lg:pb-0.5">
                                    <Button type="submit">Buscar</Button>
                                    {(searchTerm || selectedRole) && (
                                        <Button type="button" variant="outline" onClick={clearFilters}>
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </form>

                            {/* Tabla de usuarios */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Usuario
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Email
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Roles
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Fecha Registro
                                            </th>
                                            <th className="py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            @{user.usernick}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-600 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role) => (
                                                            <Badge key={role.id} variant="outline">
                                                                {role.name}
                                                            </Badge>
                                                        ))}
                                                        {user.roles.length === 0 && (
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                Sin roles
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end space-x-2">
                                                        <Can permission="usuarios.show">
                                                            <Link href={`/usuarios/${user.id}`}>
                                                                <Button size="sm" variant="ghost">
                                                                    Ver
                                                                </Button>
                                                            </Link>
                                                        </Can>
                                                        <Can permission="usuarios.edit">
                                                            <Link href={`/usuarios/${user.id}/edit`}>
                                                                <Button size="sm" variant="ghost">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </Can>
                                                        <Can permission="usuarios.delete">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(user)}
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

                            {/* Mensaje si no hay usuarios */}
                            {users.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No se encontraron usuarios.
                                    </p>
                                </div>
                            )}

                            {/* Paginación */}
                            {users.links && users.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {users.links.map((link, index) => (
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
