/**
 * Página de Notificaciones Recurrentes
 * Vista administrativa para gestionar notificaciones recurrentes a clientes
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
    Clock,
    AlertCircle,
    Send,
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

interface NotificacionRecurrente {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: 'promocion' | 'informativo' | 'evento' | 'oferta' | 'otro';
    frecuencia: 'una_vez' | 'diario' | 'semanal' | 'mensual';
    hora_envio: string;
    dias_semana: number[] | null;
    dia_mes: number | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    ultimo_envio: string | null;
    activo: boolean;
    total_enviadas: number;
    vistas: number;
    usuario_id: number;
    usuario: { id: number; name: string };
    created_at: string;
    updated_at: string;
}

interface NotificacionesPageProps {
    notificaciones: {
        data: NotificacionRecurrente[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    estadisticas: {
        total: number;
        activas: number;
        inactivas: number;
        proximas: number;
    };
    filters?: {
        search?: string;
        tipo?: string;
        frecuencia?: string;
        estado?: string;
    };
}

const tiposNotificacion = [
    { value: 'promocion', label: '🎁 Promoción' },
    { value: 'informativo', label: 'ℹ️ Informativo' },
    { value: 'evento', label: '🎉 Evento' },
    { value: 'oferta', label: '💰 Oferta' },
    { value: 'otro', label: '📢 Otro' },
];

const frecuencias = [
    { value: 'una_vez', label: '1️⃣ Una Sola Vez' },
    { value: 'diario', label: '📅 Diario' },
    { value: 'semanal', label: '📆 Semanal' },
    { value: 'mensual', label: '🗓️ Mensual' },
];

export default function NotificacionesRecurrentes({
    notificaciones,
    estadisticas,
    filters,
}: NotificacionesPageProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [tipoFilter, setTipoFilter] = useState(filters?.tipo || '');
    const [frecuenciaFilter, setFrecuenciaFilter] = useState(filters?.frecuencia || '');
    const [estadoFilter, setEstadoFilter] = useState(filters?.estado || '');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'informativo' as const,
        frecuencia: 'diario' as const,
        hora_envio: '08:00',
        dias_semana: [] as number[],
        dia_mes: null as number | null,
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
    });

    const handleSearch = () => {
        router.get(
            route('notificaciones.recurrentes.index'),
            {
                search: searchTerm,
                tipo: tipoFilter,
                frecuencia: frecuenciaFilter,
                estado: estadoFilter,
            },
            { preserveScroll: true }
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setTipoFilter('');
        setFrecuenciaFilter('');
        setEstadoFilter('');
        router.get(route('notificaciones.recurrentes.index'), {}, { preserveScroll: true });
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                route('notificaciones.recurrentes.store'),
                formData
            );

            if (response.data.success) {
                toast.success('✅ Notificación creada exitosamente');
                setShowCreateDialog(false);
                setFormData({
                    titulo: '',
                    descripcion: '',
                    tipo: 'informativo',
                    frecuencia: 'diario',
                    hora_envio: '08:00',
                    dias_semana: [],
                    dia_mes: null,
                    fecha_inicio: '',
                    fecha_fin: '',
                    activo: true,
                });
                router.reload();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al crear notificación');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta notificación?')) return;

        try {
            const response = await axios.delete(
                route('notificaciones.recurrentes.destroy', id)
            );

            if (response.data.success) {
                toast.success('✅ Notificación eliminada exitosamente');
                router.reload();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al eliminar notificación');
        }
    };

    const handleEnviar = async (id: number) => {
        if (!confirm('¿Deseas enviar esta notificación ahora?')) return;

        setLoading(true);
        try {
            const response = await axios.post(
                route('notificaciones.recurrentes.enviar', id)
            );

            if (response.data.success) {
                toast.success('✅ Notificación enviada exitosamente');
                router.reload();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al enviar notificación');
        } finally {
            setLoading(false);
        }
    };

    const getTipoLabel = (tipo: string) => {
        return tiposNotificacion.find((t) => t.value === tipo)?.label || tipo;
    };

    const getFrecuenciaLabel = (freq: string) => {
        return frecuencias.find((f) => f.value === freq)?.label || freq;
    };

    return (
        <AppLayout>
            <Head title="Notificaciones Recurrentes" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Encabezado */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    📢 Notificaciones Recurrentes
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Gestiona notificaciones automáticas para tus clientes
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="gap-2"
                            >
                                <Plus size={20} />
                                Nueva Notificación
                            </Button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {estadisticas.total}
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300">Activas</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {estadisticas.activas}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Inactivas</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {estadisticas.inactivas}
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">Próximas</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {estadisticas.proximas}
                            </p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <Input
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={tipoFilter} onValueChange={setTipoFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos</SelectItem>
                                    {tiposNotificacion.map((tipo) => (
                                        <SelectItem key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={frecuenciaFilter} onValueChange={setFrecuenciaFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Frecuencia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos</SelectItem>
                                    {frecuencias.map((freq) => (
                                        <SelectItem key={freq.value} value={freq.value}>
                                            {freq.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos</SelectItem>
                                    <SelectItem value="activo">✓ Activo</SelectItem>
                                    <SelectItem value="inactivo">✗ Inactivo</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} size="sm">
                                    Buscar
                                </Button>
                                <Button
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    size="sm"
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {notificaciones.data.length === 0 ? (
                            <div className="p-8 text-center">
                                <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600 dark:text-gray-400">
                                    No hay notificaciones creadas
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Título
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Frecuencia
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Horario
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Enviadas
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {notificaciones.data.map((notif) => (
                                            <tr
                                                key={notif.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {notif.titulo}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                                            {notif.descripcion}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline">
                                                        {getTipoLabel(notif.tipo)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {getFrecuenciaLabel(notif.frecuencia)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={16} className="text-gray-400" />
                                                        {notif.hora_envio}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="text-gray-900 dark:text-white">
                                                        {notif.total_enviadas}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        👁️ {notif.vistas} vistas
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={
                                                            notif.activo ? 'default' : 'secondary'
                                                        }
                                                    >
                                                        {notif.activo ? '✓ Activa' : '✗ Inactiva'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEnviar(notif.id)
                                                            }
                                                            title="Enviar ahora"
                                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition"
                                                            disabled={loading}
                                                        >
                                                            <Send
                                                                size={16}
                                                                className="text-blue-600 dark:text-blue-400"
                                                            />
                                                        </button>
                                                        <button
                                                            title="Editar"
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                                                        >
                                                            <Edit2
                                                                size={16}
                                                                className="text-gray-600 dark:text-gray-400"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(notif.id)
                                                            }
                                                            title="Eliminar"
                                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                                className="text-red-600 dark:text-red-400"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {notificaciones.last_page > 1 && (
                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Página {notificaciones.current_page} de {notificaciones.last_page}
                            </p>
                            <div className="flex gap-2">
                                {notificaciones.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            router.get(
                                                route('notificaciones.recurrentes.index'),
                                                {
                                                    page: notificaciones.current_page - 1,
                                                    ...filters,
                                                }
                                            )
                                        }
                                    >
                                        Anterior
                                    </Button>
                                )}
                                {notificaciones.current_page < notificaciones.last_page && (
                                    <Button
                                        onClick={() =>
                                            router.get(
                                                route('notificaciones.recurrentes.index'),
                                                {
                                                    page: notificaciones.current_page + 1,
                                                    ...filters,
                                                }
                                            )
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog: Crear Notificación */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Crear Notificación Recurrente</DialogTitle>
                        <DialogDescription>
                            Configura una notificación automática para tus clientes
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Título */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Título *
                            </label>
                            <Input
                                placeholder="Ej: Black Friday 2026"
                                value={formData.titulo}
                                onChange={(e) =>
                                    setFormData({ ...formData, titulo: e.target.value })
                                }
                                className="mt-1"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Descripción *
                            </label>
                            <textarea
                                placeholder="Mensaje completo de la notificación..."
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Tipo */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo *
                                </label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, tipo: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposNotificacion.map((tipo) => (
                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Frecuencia */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Frecuencia *
                                </label>
                                <Select
                                    value={formData.frecuencia}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, frecuencia: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {frecuencias.map((freq) => (
                                            <SelectItem key={freq.value} value={freq.value}>
                                                {freq.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Hora */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Hora de Envío
                                </label>
                                <Input
                                    type="time"
                                    value={formData.hora_envio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hora_envio: e.target.value })
                                    }
                                    className="mt-1"
                                />
                            </div>

                            {/* Activo */}
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) =>
                                            setFormData({ ...formData, activo: e.target.checked })
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Activa
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Fecha Inicio */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha Inicio
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fecha_inicio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fecha_inicio: e.target.value })
                                    }
                                    className="mt-1"
                                />
                            </div>

                            {/* Fecha Fin */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha Fin
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fecha_fin}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fecha_fin: e.target.value })
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleCreate} disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Notificación'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
