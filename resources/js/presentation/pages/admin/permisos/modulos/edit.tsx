import { useForm, Head, router } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { ModuloForm } from '@/presentation/pages/ModulosSidebar/ModuloForm'
import toast from 'react-hot-toast'
import { type BreadcrumbItem } from '@/types'
import { type ModuloSidebar, type ModuloFormData } from '@/domain/entities/admin-permisos'
import { modulosService } from '@/infrastructure/services/modulos.service'
import { Folders, ChevronRight, Users, Lock } from 'lucide-react'

interface UsuarioAcceso {
    id: number
    name: string
    email: string
    directo: boolean
    roles: string[]
    tipoAcceso: string
}

interface PageProps {
    modulo: ModuloSidebar
    modulosPadre: ModuloSidebar[]
    submodulos?: ModuloSidebar[]
    usuariosConAcceso?: UsuarioAcceso[]
    totalUsuariosAcceso?: number
    permisoRequerido?: string
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/permisos',
    },
    {
        title: 'Editar Módulo',
        href: '/admin/permisos/modulos/edit',
    },
]

export default function Edit({
    modulo,
    modulosPadre,
    submodulos = [],
    usuariosConAcceso = [],
    totalUsuariosAcceso = 0,
    permisoRequerido = 'admin.config',
}: PageProps) {
    const { data, setData, put, processing, errors } = useForm<ModuloFormData>({
        titulo: modulo.titulo,
        ruta: modulo.ruta,
        icono: modulo.icono || 'Package',
        descripcion: modulo.descripcion || '',
        orden: modulo.orden,
        activo: modulo.activo,
        es_submenu: modulo.es_submenu,
        modulo_padre_id: modulo.modulo_padre_id?.toString() || '',
        categoria: modulo.categoria || '',
        visible_dashboard: modulo.visible_dashboard || false,
        permisos: modulo.permisos || [],
        color: modulo.color || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(modulosService.updateUrl(modulo.id), {
            onSuccess: () => {
                toast.success('Módulo actualizado exitosamente.')
                router.visit('/admin/permisos?tab=modulos')
            },
            onError: () => {
                toast.error('Error al actualizar el módulo.')
            },
        })
    }

    const handleChange = <K extends keyof ModuloFormData>(
        key: K,
        value: ModuloFormData[K]
    ) => {
        // @ts-expect-error - Inertia's setData has strict typing that doesn't accept optional field types
        // but in practice we never pass undefined values
        setData(key, value)
    }

    const handleCancel = () => {
        router.visit('/admin/permisos?tab=modulos')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Módulo: ${modulo.titulo}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Editar Módulo: {modulo.titulo}</h1>
                        <p className="text-muted-foreground">
                            Modifica la configuración y permisos del módulo del sidebar.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Formulario principal */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Módulo</CardTitle>
                                <CardDescription>
                                    Modifique la información del módulo según sea necesario.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ModuloForm
                                    data={data}
                                    errors={errors}
                                    processing={processing}
                                    onSubmit={handleSubmit}
                                    onChange={handleChange}
                                    onCancel={handleCancel}
                                    submitLabel="Actualizar Módulo"
                                    modulosPadre={modulosPadre}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel lateral con información contextual */}
                    <div className="space-y-6">
                        {/* Información del módulo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Folders className="h-4 w-4" />
                                    Información
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">ID</p>
                                    <p className="font-medium">{modulo.id}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Tipo</p>
                                    <Badge variant={modulo.es_submenu ? 'secondary' : 'default'}>
                                        {modulo.es_submenu ? 'Submódulo' : 'Módulo Principal'}
                                    </Badge>
                                </div>
                                {modulo.padre && (
                                    <div>
                                        <p className="text-muted-foreground">Módulo Padre</p>
                                        <p className="font-medium">{modulo.padre.titulo}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-muted-foreground">Creado</p>
                                    <p className="font-medium">
                                        {modulo.created_at ? new Date(modulo.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                {modulo.updated_at && (
                                    <div>
                                        <p className="text-muted-foreground">Última actualización</p>
                                        <p className="font-medium">
                                            {new Date(modulo.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Usuarios con Acceso */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Acceso a esta ruta
                                </CardTitle>
                                <CardDescription>
                                    Permiso requerido: <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded text-xs">{permisoRequerido}</code>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {usuariosConAcceso.length > 0 ? (
                                    <>
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                                                👥 {totalUsuariosAcceso} usuario{totalUsuariosAcceso !== 1 ? 's' : ''} con acceso
                                            </p>
                                        </div>

                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {usuariosConAcceso.map((usuario) => (
                                                <div
                                                    key={usuario.id}
                                                    className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {usuario.name}
                                                                </p>
                                                                {usuario.directo && (
                                                                    <Badge variant="outline" className="text-xs flex-shrink-0">
                                                                        <Lock className="h-2.5 w-2.5 mr-1" />
                                                                        Directo
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {usuario.email}
                                                            </p>
                                                            {usuario.roles.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {usuario.roles.map((rol) => (
                                                                        <Badge
                                                                            key={rol}
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            🔗 {rol}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-xs text-yellow-900 dark:text-yellow-300">
                                            ⚠️ No hay usuarios con acceso a esta ruta
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submódulos (solo si es módulo principal) */}
                        {!modulo.es_submenu && submodulos.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Submódulos</CardTitle>
                                    <CardDescription>
                                        {submodulos.length} submódulo{submodulos.length !== 1 ? 's' : ''} asociado{submodulos.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {submodulos.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{sub.titulo}</span>
                                                    {!sub.activo && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Inactivo
                                                        </Badge>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(`/modulos-sidebar/${sub.id}/edit`)}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Sugerencia para módulos principales sin submódulos */}
                        {!modulo.es_submenu && submodulos.length === 0 && (
                            <Card className="border-dashed">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground text-center">
                                        Este módulo principal aún no tiene submódulos asociados.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
