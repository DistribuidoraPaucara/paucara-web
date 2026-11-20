import { Link, useForm, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import InputError from '@/presentation/components/input-error'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import AdvancedPermissionSelector from '@/presentation/components/roles/AdvancedPermissionSelector'
import { rolesService } from '@/infrastructure/services/roles.service'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/admin/permisos',
    },
    {
        title: 'Crear Rol',
        href: '/admin/permisos/roles/create',
    },
]

export default function Create() {
    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as number[],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post(rolesService.storeUrl(), {
            onSuccess: () => {
                reset()
                toast.success('Rol creado exitosamente.')
            },
            onError: () => {
                toast.error('Error al crear el rol.')
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Rol" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Crear Nuevo Rol</h1>
                        <p className="text-muted-foreground">
                            Crea un nuevo rol y asigna los permisos correspondientes.
                        </p>
                    </div>
                    {/* <Button variant="outline" asChild>
                        <Link href={rolesService.indexUrl()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button> */}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Rol</CardTitle>
                        <CardDescription>
                            Complete la información requerida para crear el rol.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Rol</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Administrador, Vendedor, etc."
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guard_name">Guard Name</Label>
                                    <Input
                                        id="guard_name"
                                        type="text"
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        placeholder="web"
                                        required
                                    />
                                    <InputError message={errors.guard_name} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <AdvancedPermissionSelector
                    selectedPermissions={data.permissions}
                    onChange={(permissions) => setData('permissions', permissions)}
                />
                <InputError message={errors.permissions} />

                <div className="sticky bottom-0 flex items-center justify-end gap-2 rounded-lg border bg-background p-3 shadow-sm">
                    <span className="mr-auto text-sm text-muted-foreground">
                        {data.permissions.length} permisos seleccionados
                    </span>
                    <Button type="button" variant="outline" asChild>
                        <Link href={rolesService.indexUrl()}>Cancelar</Link>
                    </Button>
                    <Button type="submit" form="role-form" disabled={processing || !isDirty}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Creando...' : 'Crear Rol'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    )
}
