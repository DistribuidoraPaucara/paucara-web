import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import { toast } from 'react-toastify';
import {
    Plus,
    Search,
    Trash2,
    Edit,
    Send,
    Filter,
    Eye,
    Check,
    AlertCircle,
    Megaphone,
} from 'lucide-react';
import notificacionesService, {
    type NotificacionRecurrente,
    type Estadisticas,
    type FiltrosNotificaciones,
} from '@/infrastructure/services/notificaciones.service';

interface Props {
    estadisticas?: Estadisticas;
}

const DEFAULT_ESTADISTICAS: Estadisticas = {
    total: 0,
    activas: 0,
    inactivas: 0,
    proximas: 0,
};

export default function NotificacionesIndex({ estadisticas: initialStats }: Props) {
    const [notificaciones, setNotificaciones] = useState<NotificacionRecurrente[]>([]);
    const [estadisticas, setEstadisticas] = useState<Estadisticas>(
        initialStats ?? DEFAULT_ESTADISTICAS
    );
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosNotificaciones>({
        search: '',
        tipo: '',
        activo: undefined,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    // Cargar notificaciones
    const cargarNotificaciones = useCallback(async () => {
        setLoading(true);
        try {
            const resultado = await notificacionesService.obtener(filtros);
            setNotificaciones(resultado.notificaciones);
            setEstadisticas(resultado.estadisticas);
        } catch (error) {
            toast.error('Error al cargar notificaciones');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiltros({ ...filtros, search: e.target.value, page: 1 });
    };

    const handleFiltroTipo = (value: string) => {
        setFiltros({ ...filtros, tipo: value || '', page: 1 });
    };

    const handleFiltroActivo = (value: string) => {
        setFiltros({
            ...filtros,
            activo: value === '' ? undefined : value === 'true',
            page: 1,
        });
    };

    const eliminarNotificacion = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta notificación?')) return;

        setProcesandoId(id);
        try {
            await notificacionesService.eliminar(id);
            toast.success('Notificación eliminada exitosamente');
            cargarNotificaciones();
        } catch (error) {
            toast.error('Error al eliminar notificación');
            console.error(error);
        } finally {
            setProcesandoId(null);
        }
    };

    const enviarManual = async (notificacion: NotificacionRecurrente) => {
        setProcesandoId(notificacion.id);
        try {
            await notificacionesService.enviar(notificacion.id);
            toast.success('Notificación enviada exitosamente');
            cargarNotificaciones();
        } catch (error) {
            toast.error('Error al enviar notificación');
            console.error(error);
        } finally {
            setProcesandoId(null);
        }
    };

    const getTipoBadge = (tipo: string) => {
        const tipos: Record<string, { bg: string; text: string }> = {
            promocion: { bg: 'bg-blue-100', text: 'text-blue-800' },
            evento: { bg: 'bg-purple-100', text: 'text-purple-800' },
            informativo: { bg: 'bg-gray-100', text: 'text-gray-800' },
            oferta: { bg: 'bg-red-100', text: 'text-red-800' },
        };
        const style = tipos[tipo] || tipos.informativo;
        return <Badge className={`${style.bg} ${style.text}`}>{tipo}</Badge>;
    };

    const getFrecuenciaBadge = (frecuencia: string) => {
        const frecuencias: Record<string, string> = {
            una_vez: '🔄 Una vez',
            diario: '📅 Diario',
            semanal: '📆 Semanal',
            mensual: '📋 Mensual',
        };
        return frecuencias[frecuencia] || frecuencia;
    };

    return (
        <AppLayout>
            <Head title="Notificaciones Recurrentes" />

            <div className="space-y-6 p-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="w-8 h-8" />
                            Notificaciones Recurrentes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gestiona anuncios y promociones automáticas
                        </p>
                    </div>
                    <Link href="/notificaciones/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Notificación
                        </Button>
                    </Link>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{estadisticas.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Activas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{estadisticas.activas}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Inactivas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{estadisticas.inactivas}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Próximas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{estadisticas.proximas}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filtros
                            </CardTitle>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                {showFilters ? '↑ Ocultar' : '↓ Mostrar'}
                            </button>
                        </div>
                    </CardHeader>
                    {showFilters && (
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Búsqueda</label>
                                    <Input
                                        placeholder="Buscar por título..."
                                        value={filtros.search || ''}
                                        onChange={handleBuscar}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Tipo</label>
                                    <Select value={filtros.tipo || ''} onValueChange={handleFiltroTipo}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos</SelectItem>
                                            <SelectItem value="promocion">Promoción</SelectItem>
                                            <SelectItem value="evento">Evento</SelectItem>
                                            <SelectItem value="informativo">Informativo</SelectItem>
                                            <SelectItem value="oferta">Oferta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Estado</label>
                                    <Select
                                        value={filtros.activo === undefined ? '' : String(filtros.activo)}
                                        onValueChange={handleFiltroActivo}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos</SelectItem>
                                            <SelectItem value="true">Activas</SelectItem>
                                            <SelectItem value="false">Inactivas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Tabla */}
                <Card>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div className="text-center py-8 text-gray-600">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No hay notificaciones</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Frecuencia</TableHead>
                                            <TableHead>Hora</TableHead>
                                            <TableHead className="text-center">Enviadas</TableHead>
                                            <TableHead className="text-center">Estado</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Último envío</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {notificaciones.map((notif) => (
                                            <TableRow key={notif.id}>
                                                <TableCell className="font-medium truncate max-w-xs">
                                                    {notif.titulo}
                                                </TableCell>
                                                <TableCell>{getTipoBadge(notif.tipo)}</TableCell>
                                                <TableCell>{getFrecuenciaBadge(notif.frecuencia)}</TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {notif.hora_envio}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-sm">
                                                        {notif.total_enviadas}
                                                        <span className="text-gray-600 ml-1">
                                                            ({notif.vistas})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {notif.activo ? (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Activa
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800">
                                                            Inactiva
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {notif.roles && notif.roles.length > 0 ? (
                                                            notif.roles.map((role) => (
                                                                <Badge key={role.id} className="bg-blue-100 text-blue-800 text-xs">
                                                                    {role.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <Badge className="bg-gray-200 text-gray-700 text-xs">Todos</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {notif.ultimo_envio
                                                        ? new Date(notif.ultimo_envio).toLocaleDateString()
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => enviarManual(notif)}
                                                            disabled={procesandoId === notif.id}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                                                            title="Enviar ahora"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                        <Link href={`/notificaciones/${notif.id}/edit`}>
                                                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => eliminarNotificacion(notif.id)}
                                                            disabled={procesandoId === notif.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
