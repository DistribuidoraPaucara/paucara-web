/**
 * Página de Banners Publicitarios
 * Vista administrativa para gestionar banners publicitarios
 */

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    Image as ImageIcon,
    AlertCircle,
    ChevronRight,
    GripVertical,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';
import { cn } from '@/lib/utils';

interface BannerPublicitario {
    id: number;
    titulo: string;
    descripcion: string | null;
    imagen: string;
    nombre_archivo: string;
    url_imagen: string;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    activo: boolean;
    orden: number;
    estado_vigencia: 'vigente' | 'proximo' | 'vencido' | 'inactivo';
    esta_vigente: boolean;
    created_at: string;
    updated_at: string;
}

interface BannersPageProps {
    banners: {
        data: BannerPublicitario[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    estadisticas: {
        total: number;
        activos: number;
        inactivos: number;
        vigentes: number;
    };
    filters?: {
        search?: string;
        estado?: string;
        vigencia?: string;
    };
}

const estadoVigenciaConfig: Record<string, { color: string; label: string }> = {
    vigente: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        label: 'Vigente',
    },
    proximo: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        label: 'Próximo',
    },
    vencido: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        label: 'Vencido',
    },
    inactivo: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        label: 'Inactivo',
    },
};

export default function BannersPublicitariosPage({
    banners,
    estadisticas,
    filters = {},
}: BannersPageProps) {
    const [busqueda, setBusqueda] = useState(filters.search || '');
    const [estado, setEstado] = useState(filters.estado || '');
    const [vigencia, setVigencia] = useState(filters.vigencia || '');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [bannerEditar, setBannerEditar] = useState<BannerPublicitario | null>(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        imagen: null as File | null,
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
        orden: 0,
    });
    const [previewImagen, setPreviewImagen] = useState<string | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [bannerAEliminar, setBannerAEliminar] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Admin', href: '/admin' },
        { label: 'Banners Publicitarios', href: '/admin/banners-publicitarios' },
    ];

    const handleFiltrar = () => {
        const params = new URLSearchParams();
        if (busqueda) params.append('search', busqueda);
        if (estado) params.append('estado', estado);
        if (vigencia) params.append('vigencia', vigencia);

        const url = `/admin/banners-publicitarios${params.toString() ? '?' + params.toString() : ''}`;
        window.location.href = url;
    };

    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setEstado('');
        setVigencia('');
        window.location.href = '/admin/banners-publicitarios';
    };

    const handleAbrirFormulario = (banner?: BannerPublicitario) => {
        if (banner) {
            setBannerEditar(banner);
            setFormData({
                titulo: banner.titulo,
                descripcion: banner.descripcion || '',
                imagen: null,
                fecha_inicio: banner.fecha_inicio || '',
                fecha_fin: banner.fecha_fin || '',
                activo: banner.activo,
                orden: banner.orden,
            });
            setPreviewImagen(banner.url_imagen);
        } else {
            setBannerEditar(null);
            setFormData({
                titulo: '',
                descripcion: '',
                imagen: null,
                fecha_inicio: '',
                fecha_fin: '',
                activo: true,
                orden: 0,
            });
            setPreviewImagen(null);
        }
        setIsFormOpen(true);
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, imagen: file });
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImagen(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = async () => {
        if (!formData.titulo.trim()) {
            alert('El título es requerido');
            return;
        }

        try {
            const formDataMultipart = new FormData();
            formDataMultipart.append('titulo', formData.titulo);
            formDataMultipart.append('descripcion', formData.descripcion);
            if (formData.imagen) {
                formDataMultipart.append('imagen', formData.imagen);
            }
            formDataMultipart.append('fecha_inicio', formData.fecha_inicio);
            formDataMultipart.append('fecha_fin', formData.fecha_fin);
            formDataMultipart.append('activo', formData.activo ? '1' : '0');
            formDataMultipart.append('orden', String(formData.orden));

            if (bannerEditar) {
                const response = await axios.post(
                    `/admin/banners-publicitarios/${bannerEditar.id}`,
                    formDataMultipart,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.data.success) {
                    toast.success(response.data.message || 'Banner actualizado correctamente');
                    setIsFormOpen(false);
                    router.reload();
                } else {
                    toast.error(response.data.message || 'No se pudo actualizar el banner');
                }
            } else {
                const response = await axios.post(
                    '/admin/banners-publicitarios',
                    formDataMultipart,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.data.success) {
                    toast.success(response.data.message || 'Banner creado correctamente');
                    setIsFormOpen(false);
                    router.reload();
                } else {
                    toast.error(response.data.message || 'No se pudo crear el banner');
                }
            }
        } catch (error: any) {
            console.error('Error al guardar banner:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]]?.[0] ||
                error.message ||
                'Error desconocido';
            toast.error('Error al guardar: ' + errorMessage);
        }
    };

    const handleToggleActivo = async (banner: BannerPublicitario) => {
        try {
            const response = await axios.patch(
                `/admin/banners-publicitarios/${banner.id}/toggle`
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Estado actualizado');
                router.reload();
            } else {
                toast.error(response.data.message || 'No se pudo cambiar el estado');
            }
        } catch (error: any) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error al cambiar estado: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEliminar = (bannerId: number) => {
        setBannerAEliminar(bannerId);
        setIsConfirmDeleteOpen(true);
    };

    const handleConfirmarEliminar = async () => {
        if (bannerAEliminar === null) return;

        try {
            const response = await axios.delete(
                `/admin/banners-publicitarios/${bannerAEliminar}`
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Banner eliminado correctamente');
                setIsConfirmDeleteOpen(false);
                setBannerAEliminar(null);
                router.reload();
            } else {
                toast.error(response.data.message || 'No se pudo eliminar el banner');
            }
        } catch (error: any) {
            console.error('Error al eliminar banner:', error);
            toast.error('Error al eliminar: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const bannersFiltrados = banners.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banners Publicitarios" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Banners Publicitarios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gestiona los banners que se muestran a los clientes en la app móvil
                        </p>
                    </div>
                    <Button
                        onClick={() => handleAbrirFormulario()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Banner
                    </Button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Total"
                        value={estadisticas.total}
                        color="bg-gray-100 dark:bg-gray-800"
                    />
                    <StatCard
                        label="Activos"
                        value={estadisticas.activos}
                        color="bg-green-100 dark:bg-green-900"
                    />
                    <StatCard
                        label="Inactivos"
                        value={estadisticas.inactivos}
                        color="bg-red-100 dark:bg-red-900"
                    />
                    <StatCard
                        label="Vigentes"
                        value={estadisticas.vigentes}
                        color="bg-blue-100 dark:bg-blue-900"
                    />
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por título o descripción..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select value={estado || 'todos-estado'} onValueChange={(value) => setEstado(value === 'todos-estado' ? '' : value)}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos-estado">Todos</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={vigencia || 'todos-vigencia'} onValueChange={(value) => setVigencia(value === 'todos-vigencia' ? '' : value)}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Vigencia" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos-vigencia">Todos</SelectItem>
                                <SelectItem value="vigente">Vigente</SelectItem>
                                <SelectItem value="proximo">Próximo</SelectItem>
                                <SelectItem value="vencido">Vencido</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleFiltrar}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Filtrar
                        </Button>
                        <Button
                            onClick={handleLimpiarFiltros}
                            variant="outline"
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>

                {/* Lista de Banners */}
                <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
                    {bannersFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay banners que coincidan con los filtros
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {bannersFiltrados.map((banner) => {
                                const vigenciaConfig = estadoVigenciaConfig[banner.estado_vigencia];
                                return (
                                    <div
                                        key={banner.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Miniatura */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={banner.url_imagen}
                                                    alt={banner.titulo}
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            </div>

                                            {/* Contenido */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {banner.titulo}
                                                        </h3>
                                                        {banner.descripcion && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {banner.descripcion}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge className={cn(vigenciaConfig.color)}>
                                                            {vigenciaConfig.label}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Fechas */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {banner.fecha_inicio && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Inicia: {formatearFecha(banner.fecha_inicio)}</span>
                                                        </div>
                                                    )}
                                                    {banner.fecha_fin && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Vence: {formatearFecha(banner.fecha_fin)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Estado y Orden */}
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>Orden: {banner.orden}</span>
                                                    <span>Creado: {formatearFecha(banner.created_at)}</span>
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={banner.activo ? 'default' : 'outline'}
                                                    onClick={() => handleToggleActivo(banner)}
                                                    className={banner.activo ? 'bg-green-600 hover:bg-green-700' : ''}
                                                >
                                                    {banner.activo ? (
                                                        <Eye className="w-4 h-4" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAbrirFormulario(banner)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEliminar(banner.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog - Crear/Editar Banner */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {bannerEditar ? 'Editar Banner' : 'Nuevo Banner'}
                        </DialogTitle>
                        <DialogDescription>
                            {bannerEditar
                                ? 'Actualiza la información del banner'
                                : 'Crea un nuevo banner publicitario'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Título *
                            </label>
                            <Input
                                value={formData.titulo}
                                onChange={(e) =>
                                    setFormData({ ...formData, titulo: e.target.value })
                                }
                                placeholder="Ej: Promoción de Verano"
                                className="w-full"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                placeholder="Detalles adicionales del banner..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                rows={3}
                            />
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Imagen {!bannerEditar && '*'}
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                                    />
                                </div>
                                {previewImagen && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={previewImagen}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Fecha Inicio
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fecha_inicio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fecha_inicio: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Fecha Fin
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fecha_fin}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fecha_fin: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* Orden */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Orden
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.orden}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        orden: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full"
                            />
                        </div>

                        {/* Activo */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.activo}
                                onChange={(e) =>
                                    setFormData({ ...formData, activo: e.target.checked })
                                }
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                Banner Activo
                            </label>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleGuardar}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {bannerEditar ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog - Confirmar Eliminación */}
            <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar Banner</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmDeleteOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmarEliminar}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className={cn('p-4 rounded-lg', color)}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
    );
}
