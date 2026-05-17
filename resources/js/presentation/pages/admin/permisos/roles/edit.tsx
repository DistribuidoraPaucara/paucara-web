import { Link, useForm, Head, router } from '@inertiajs/react'
import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import InputError from '@/presentation/components/input-error'
import toast from 'react-hot-toast'
import { Save, Copy, Database, History } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import AdvancedPermissionSelector from '@/presentation/components/roles/AdvancedPermissionSelector'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select'
import axios from 'axios'
import type { Role, Permission, PermisoAudit } from '@/domain/entities/admin-permisos'
import { rolesService } from '@/infrastructure/services/roles.service'

interface PermissionGroup {
    [key: string]: Permission[]
}

interface RoleTemplate {
    id: number
    nombre: string
    descripcion?: string
}

interface RoleListItem {
    id: number
    name: string
    permissions_count: number
}

interface PageProps {
    role: Role
    permissions: PermissionGroup
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Centro de Permisos',
        href: '/admin/permisos',
    },
    {
        title: 'Editar Rol',
        href: '/admin/permisos/roles/edit',
    },
]

export default function Edit({ role }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        guard_name: role.guard_name,
        permissions: role.permissions?.map(p => Number(p.id)) || [],
    })

    const [showCopyDialog, setShowCopyDialog] = useState(false)
    const [showTemplateDialog, setShowTemplateDialog] = useState(false)
    const [showAuditDialog, setShowAuditDialog] = useState(false)
    const [sourceRoleId, setSourceRoleId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const [roles, setRoles] = useState<RoleListItem[]>([])
    const [templates, setTemplates] = useState<RoleTemplate[]>([])
    const [audits, setAudits] = useState<PermisoAudit[]>([])
    const [loading, setLoading] = useState(false)

    // Cargar roles para copiar
    const handleOpenCopyDialog = async () => {
        if (roles.length === 0) {
            try {
                const response = await axios.get(rolesService.indexUrl())
                setRoles(response.data.props.roles.data.filter((r: RoleListItem) => r.id !== role.id))
            } catch (error) {
                console.log(error)
                toast.error('Error cargando roles')
            }
        }
        setShowCopyDialog(true)
    }

    // Cargar plantillas
    const handleOpenTemplateDialog = async () => {
        if (templates.length === 0) {
            try {
                const response = await axios.get(rolesService.templatesUrl())
                setTemplates(response.data)
            } catch (error) {
                console.log(error)
                toast.error('Error cargando plantillas')
            }
        }
        setShowTemplateDialog(true)
    }

    // Cargar auditoría
    const handleOpenAuditDialog = async () => {
        try {
            setLoading(true)
            const response = await axios.get(rolesService.auditUrl(role.id))
            setAudits(response.data.data)
            setShowAuditDialog(true)
        } catch (error) {
            console.log(error)
            toast.error('Error cargando auditoría')
        } finally {
            setLoading(false)
        }
    }

    // Copiar desde rol
    const handleCopyRole = async () => {
        if (!sourceRoleId) {
            toast.error('Selecciona un rol para copiar')
            return
        }

        try {
            setLoading(true)
            await axios.post(rolesService.copyFromUrl(role.id), {
                source_role_id: parseInt(sourceRoleId),
            })
            toast.success('Permisos copiados exitosamente')
            setShowCopyDialog(false)
            router.reload()
        } catch (error) {
            console.log(error)
            toast.error('Error al copiar permisos')
        } finally {
            setLoading(false)
        }
    }

    // Aplicar plantilla
    const handleApplyTemplate = async () => {
        if (!templateId) {
            toast.error('Selecciona una plantilla')
            return
        }

        try {
            setLoading(true)
            await axios.post(rolesService.applyTemplateUrl(role.id), {
                template_id: parseInt(templateId),
            })
            toast.success('Plantilla aplicada exitosamente')
            setShowTemplateDialog(false)
            router.reload()
        } catch (error) {
            console.log(error)
            toast.error('Error al aplicar plantilla')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(rolesService.updateUrl(role.id), {
            onSuccess: () => {
                toast.success('Rol actualizado exitosamente.')
            },
            onError: () => {
                toast.error('Error al actualizar el rol.')
            },
        })
    }

    const handlePermissionChange = (permissions: number[]) => {
        setData('permissions', permissions)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Rol: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Editar Rol: {role.name}</h1>
                        <p className="text-muted-foreground">
                            Configura la información y permisos del rol.
                        </p>
                    </div>
                    {/* <Button variant="outline" asChild>
                        <Link href={rolesService.indexUrl()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button> */}
                </div>

                {/* Información básica */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Rol</CardTitle>
                        <CardDescription>
                            Modifique la información básica del rol.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Botones de acciones avanzadas */}
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenCopyDialog}
                                    className="text-xs"
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copiar desde
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenTemplateDialog}
                                    className="text-xs"
                                >
                                    <Database className="mr-2 h-4 w-4" />
                                    Aplicar plantilla
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenAuditDialog}
                                    className="text-xs"
                                >
                                    <History className="mr-2 h-4 w-4" />
                                    Auditoría
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="sm"
                                    className="text-xs"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Selector avanzado de permisos */}
                <AdvancedPermissionSelector
                    selectedPermissions={data.permissions}
                    onChange={handlePermissionChange}
                />

                {/* Botones de acción */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href={rolesService.indexUrl()}>Cancelar</Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Actualizando...' : 'Actualizar Rol'}
                    </Button>
                </div>

                {/* Dialog: Copiar desde rol */}
                <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Copiar desde Rol</DialogTitle>
                            <DialogDescription>
                                Selecciona un rol del cual copiar todos los permisos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Select value={sourceRoleId} onValueChange={setSourceRoleId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {r.name} ({r.permissions_count} permisos)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCopyRole} disabled={loading}>
                                    {loading ? 'Copiando...' : 'Copiar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog: Aplicar plantilla */}
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Aplicar Plantilla</DialogTitle>
                            <DialogDescription>
                                Selecciona una plantilla de permisos para aplicar a este rol.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Select value={templateId} onValueChange={setTemplateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una plantilla..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleApplyTemplate} disabled={loading}>
                                    {loading ? 'Aplicando...' : 'Aplicar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog: Auditoría */}
                <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Historial de Auditoría</DialogTitle>
                            <DialogDescription>
                                Cambios realizados en este rol.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {audits.length === 0 ? (
                                <p className="text-sm text-gray-500">No hay cambios registrados.</p>
                            ) : (
                                audits.map((audit) => (
                                    <div key={audit.id} className="border-l-4 border-blue-500 p-4 bg-gray-50 dark:bg-gray-900">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-sm">{audit.descripcion}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Por: {audit.admin?.name} ({audit.admin?.email})
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    Permisos cambiados: {audit.permisos_changed}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(audit.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
