import { Link, useForm, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import InputError from '@/presentation/components/input-error'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

interface Role {
    id: number
    name: string
}

interface PageProps {
    roles: Role[]
    permissions: Record<string, { id: number; name: string; description?: string }[]>
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Usuarios',
        href: '/usuarios',
    },
    {
        title: 'Crear Usuario',
        href: '/usuarios/create',
    },
]

export default function Create({ roles, permissions }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        usernick: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
        permissions: [] as number[],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post('/usuarios', {
            onSuccess: () => {
                reset()
                toast.success('Usuario creado exitosamente.')
            },
            onError: () => {
                toast.error('Ocurrió un error al crear el usuario.')
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Crear Usuario
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Crear un nuevo usuario en el sistema
                            </p>
                        </div>
                        <Link href="/usuarios">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                            <CardDescription>
                                Complete todos los campos requeridos para crear el usuario
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
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
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Ingrese el correo electrónico"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Ingrese la contraseña"
                                            required
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
                                            placeholder="Confirme la contraseña"
                                            required
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Roles</Label>
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

                                <div className="space-y-2">
                                    <Label>Permisos (opcionales)</Label>
                                    <div className="space-y-4">
                                        {Object.entries(permissions).map(([group, perms]) => (
                                            <div key={group}>
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{group}</h4>
                                                <div className="mt-2 grid gap-2 md:grid-cols-3">
                                                    {perms.map((perm) => (
                                                        <div key={perm.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`perm-${perm.id}`}
                                                                checked={data.permissions.includes(perm.id)}
                                                                onChange={() => handlePermissionChange(perm.id.toString())}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <label htmlFor={`perm-${perm.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                                                                {perm.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.permissions} />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Link href="/usuarios">
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Creando...' : 'Crear Usuario'}
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
