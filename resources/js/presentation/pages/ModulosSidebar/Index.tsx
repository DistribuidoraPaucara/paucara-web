import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { LayoutList, Grid3x3, List } from 'lucide-react';
// Domain imports
import type { ModuloSidebar, FiltrosModulo, VistaActual } from '@/domain/entities/admin-permisos';
import { useFiltrarModulos, useExtraerDatos, useModulosPadre } from '@/infrastructure/hooks/modulos.hooks';
import { modulosService } from '@/infrastructure/services/modulos.service';
// Component imports
import { MatrizAccesoRol } from '@/presentation/components/matriz-acceso-rol';
import { ModulosFiltros } from '@/presentation/components/modulos-filtros';
import { ModulosVistaAgrupada } from '@/presentation/components/modulos-vista-agrupada';
import { ModulosListaArrastrables } from '@/presentation/components/modulos-lista-arrastrables';
import { SidebarPreview } from '@/presentation/components/sidebar-preview';
import { ModuloForm } from './ModuloForm';

interface Props {
    modulos: ModuloSidebar[];
}

export default function Index({ modulos }: Props) {
    const [selectedModulo, setSelectedModulo] = useState<ModuloSidebar | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosModulo>({
        busqueda: '',
        tipo: 'todos',
        estado: 'todos',
        categoria: '',
        rolRequerido: '',
    });
    const [vistaActual, setVistaActual] = useState<VistaActual>('tabla');
    const [guardandoOrden, setGuardandoOrden] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        titulo: '',
        ruta: '',
        icono: '',
        descripcion: '',
        orden: 1,
        activo: true,
        es_submenu: false,
        modulo_padre_id: '',
        categoria: '',
        visible_dashboard: true,
        permisos: [] as string[],
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/modulos-sidebar', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModulo) return;

        put(`/modulos-sidebar/${selectedModulo.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedModulo(null);
                reset();
            },
        });
    };

    const handleDelete = (modulo: ModuloSidebar) => {
        if (confirm(`¿Está seguro de eliminar el módulo "${modulo.titulo}"?`)) {
            destroy(`/modulos-sidebar/${modulo.id}`, {
                onSuccess: () => {
                    // Módulo eliminado
                },
            });
        }
    };

    const toggleActivo = async (modulo: ModuloSidebar) => {
        try {
            await modulosService.toggleActivo(modulo.id);
        } catch (error) {
            console.error('Error:', error);
            alert(error instanceof Error ? error.message : 'Error al cambiar el estado del módulo');
        }
    };

    const handleGuardarOrden = async (orden: Array<{ id: number; orden: number }>) => {
        setGuardandoOrden(true);
        try {
            await modulosService.guardarOrden(orden);
        } catch (error) {
            console.error('Error:', error);
            alert(error instanceof Error ? error.message : 'Error al guardar el orden de los módulos');
        } finally {
            setGuardandoOrden(false);
        }
    };

    const openEditModal = (modulo: ModuloSidebar) => {
        setSelectedModulo(modulo);
        setData({
            titulo: modulo.titulo,
            ruta: modulo.ruta,
            icono: modulo.icono || '',
            descripcion: modulo.descripcion || '',
            orden: modulo.orden,
            activo: modulo.activo,
            es_submenu: modulo.es_submenu,
            modulo_padre_id: modulo.modulo_padre_id?.toString() || '',
            categoria: modulo.categoria || '',
            visible_dashboard: true,
            permisos: Array.isArray(modulo.permisos) ? modulo.permisos : [],
        });
        setIsEditModalOpen(true);
    };

    // Custom hooks para lógica de negocio
    const modulosPadre = useModulosPadre(modulos);
    const { categorias, rolesDisponibles } = useExtraerDatos(modulos);
    const modulosFiltrados = useFiltrarModulos(modulos, filtros);

    return (
        <AppLayout>
            <Head title="Gestión de Módulos del Sidebar" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Gestión de Módulos del Sidebar
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Administra los módulos y submódulos del sidebar de la aplicación
                        </p>
                    </div>

                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Módulo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Módulo</DialogTitle>
                                <DialogDescription>
                                    Ingresa los datos del nuevo módulo del sidebar
                                </DialogDescription>
                            </DialogHeader>
                            <ModuloForm
                                data={data}
                                errors={errors}
                                processing={processing}
                                onSubmit={handleCreate}
                                onChange={setData}
                                onCancel={() => setIsCreateModalOpen(false)}
                                submitLabel="Crear"
                                modulosPadre={modulosPadre}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Módulos Registrados</CardTitle>
                            <CardDescription>
                                Total de módulos: {modulos.length}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={vistaActual === 'tabla' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setVistaActual('tabla')}
                                title="Vista de tabla"
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={vistaActual === 'agrupada' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setVistaActual('agrupada')}
                                title="Vista agrupada por categoría"
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={vistaActual === 'lista' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setVistaActual('lista')}
                                title="Vista lista con arrastrable para reordenar"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ModulosFiltros
                            categorias={categorias}
                            rolesDisponibles={rolesDisponibles}
                            filtros={filtros}
                            onChange={setFiltros}
                            totalResultados={modulosFiltrados.length}
                            totalModulos={modulos.length}
                        />

                        {/* Vista Tabla */}
                        {vistaActual === 'tabla' && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Ruta</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Orden</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {modulosFiltrados.map((modulo) => (
                                        <TableRow key={modulo.id}>
                                            <TableCell className="font-medium">
                                                {modulo.es_submenu && modulo.padre && (
                                                    <span className="text-gray-500 mr-2">
                                                        └
                                                    </span>
                                                )}
                                                {modulo.titulo}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {modulo.ruta}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={modulo.es_submenu ? "secondary" : "default"}>
                                                    {modulo.es_submenu ? 'Submódulo' : 'Principal'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleActivo(modulo)}
                                                >
                                                    {modulo.activo ? (
                                                        <>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            <Badge className="bg-green-100 text-green-800">Activo</Badge>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-4 w-4 mr-1" />
                                                            <Badge variant="secondary">Inactivo</Badge>
                                                        </>
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell>{modulo.orden}</TableCell>
                                            <TableCell>
                                                {modulo.categoria && (
                                                    <Badge variant="outline">{modulo.categoria}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(modulo)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(modulo)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Vista Agrupada por Categoría */}
                        {vistaActual === 'agrupada' && (
                            <ModulosVistaAgrupada
                                modulos={modulosFiltrados}
                                categorias={categorias}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onToggleActivo={toggleActivo}
                                procesando={processing}
                            />
                        )}

                        {/* Vista Lista Arrastrables */}
                        {vistaActual === 'lista' && (
                            <ModulosListaArrastrables
                                modulos={modulosFiltrados}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onToggleActivo={toggleActivo}
                                onReordenar={handleGuardarOrden}
                                procesando={processing}
                                guardando={guardandoOrden}
                            />
                        )}

                        {/* Mensaje cuando no hay resultados */}
                        {modulosFiltrados.length === 0 && (
                            <div className="py-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400 mb-2">
                                    {modulos.length === 0
                                        ? 'No hay módulos registrados'
                                        : 'No se encontraron módulos que coincidan con los filtros'}
                                </p>
                                {modulos.length > 0 && (
                                    <button
                                        onClick={() =>
                                            setFiltros({
                                                busqueda: '',
                                                tipo: 'todos',
                                                estado: 'todos',
                                                categoria: '',
                                                rolRequerido: '',
                                            })
                                        }
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                    >
                                        Limpiar todos los filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Matriz de Acceso */}
                <MatrizAccesoRol />

                {/* Vista Previa del Sidebar */}
                <SidebarPreview modulosTotales={modulos.length} />

                {/* Modal de Edición */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Módulo</DialogTitle>
                            <DialogDescription>
                                Modifica los datos del módulo seleccionado
                            </DialogDescription>
                        </DialogHeader>
                        <ModuloForm
                            data={data}
                            errors={errors}
                            processing={processing}
                            onSubmit={handleEdit}
                            onChange={setData}
                            onCancel={() => setIsEditModalOpen(false)}
                            submitLabel="Actualizar"
                            modulosPadre={modulosPadre}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
