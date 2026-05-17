import { Link, useForm, Head, router } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { ModuloForm } from '@/presentation/pages/ModulosSidebar/ModuloForm'
import toast from 'react-hot-toast'
import { ArrowLeft, Info, Lightbulb } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import { type ModuloSidebar, type ModuloFormData } from '@/domain/entities/admin-permisos'
import { modulosService } from '@/infrastructure/services/modulos.service'

interface PageProps {
    modulosPadre: ModuloSidebar[]
    totalModulos?: number
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/permisos',
    },
    {
        title: 'Crear Módulo',
        href: '/admin/permisos/modulos/create',
    },
]

export default function Create({ modulosPadre, totalModulos = 0 }: PageProps) {
    const { data, setData, post, processing, errors } = useForm<ModuloFormData>({
        titulo: '',
        ruta: '',
        icono: 'Package',
        descripcion: '',
        orden: 1,
        activo: true,
        es_submenu: false,
        modulo_padre_id: '',
        categoria: '',
        visible_dashboard: false,
        permisos: [],
        color: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post(modulosService.storeUrl(), {
            onSuccess: () => {
                toast.success('Módulo creado exitosamente.')
                router.visit('/admin/permisos?tab=modulos')
            },
            onError: () => {
                toast.error('Error al crear el módulo.')
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
            <Head title="Crear Módulo" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Crear Nuevo Módulo</h1>
                        <p className="text-muted-foreground">
                            Crea un nuevo módulo del sidebar con su configuración y permisos.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/permisos?tab=modulos">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Formulario principal */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Módulo</CardTitle>
                                <CardDescription>
                                    Complete la información requerida para crear el módulo.
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
                                    submitLabel="Crear Módulo"
                                    modulosPadre={modulosPadre}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel lateral con ayuda y tips */}
                    <div className="space-y-6">
                        {/* Información general */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Información
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Total de módulos</p>
                                    <p className="font-medium text-lg">{totalModulos}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Módulos principales</p>
                                    <p className="font-medium">{modulosPadre.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips y mejores prácticas */}
                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <p className="font-semibold mb-2">Tips:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Usa nombres descriptivos para los módulos</li>
                                    <li>• El orden determina la posición en el sidebar</li>
                                    <li>• Los submódulos deben tener un módulo padre</li>
                                    <li>• Los permisos controlan quién ve el módulo</li>
                                    <li>• Marca como "Visible en dashboard" solo módulos importantes</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        {/* Ejemplos de rutas */}
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle className="text-sm">Ejemplos de rutas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Módulo principal:</p>
                                    <code className="bg-muted px-2 py-1 rounded">/inventario</code>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Submódulo:</p>
                                    <code className="bg-muted px-2 py-1 rounded">/inventario/productos</code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
