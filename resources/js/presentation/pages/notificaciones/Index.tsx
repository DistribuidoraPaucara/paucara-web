import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CardTitle } from '@/presentation/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { useDebouncedValue } from '@/application/hooks/use-debounce';
import { DEFAULT_IMAGE_PATH } from '@/presentation/components/notificaciones/ImagenNotificacionInput';
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
    Trash2,
    Edit,
    Send,
    Filter,
    Check,
    AlertCircle,
    Megaphone,
    ChevronLeft,
    ChevronRight,
    ImageOff,
} from 'lucide-react';
import notificacionesService, {
    type NotificacionRecurrente,
    type Estadisticas,
    type FiltrosNotificaciones,
    type Paginacion,
} from '@/infrastructure/services/notificaciones.service';
import {
    describirDias,
    formatearEnvio,
    motivoSinEnvios,
    proximosEnvios,
    type Programacion,
} from '@/presentation/components/notificaciones/programacion';

type AccionPendiente = { tipo: 'enviar' | 'eliminar'; notificacion: NotificacionRecurrente } | null;

const MAX_HORAS_VISIBLES = 4;

function MiniaturaImagen({ url, onAbrir }: { url?: string | null; onAbrir: (url: string) => void }) {
    const [fallo, setFallo] = useState(false);
    const porDefecto = !url || url.endsWith(DEFAULT_IMAGE_PATH);
    const src = url || DEFAULT_IMAGE_PATH;

    if (fallo) {
        return (
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded border bg-gray-50 text-gray-400 dark:bg-gray-800"
                title="No se pudo cargar la imagen"
            >
                <ImageOff className="h-4 w-4" />
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onAbrir(src)}
            title={porDefecto ? 'Imagen por defecto' : 'Ver imagen'}
            className="h-10 w-10 shrink-0 overflow-hidden rounded border transition hover:ring-2 hover:ring-blue-400"
        >
            <img
                src={src}
                alt=""
                loading="lazy"
                onError={() => setFallo(true)}
                className={`h-full w-full object-cover ${porDefecto ? 'opacity-50 grayscale' : ''}`}
            />
        </button>
    );
}

// Notificaciones antiguas solo tienen hora_envio, sin filas en horarios
const programacionDe = (notif: NotificacionRecurrente): Programacion => ({
    ...notif,
    horarios:
        notif.horarios && notif.horarios.length > 0
            ? notif.horarios
            : notif.hora_envio
              ? [{ hora: notif.hora_envio, activo: true }]
              : [],
});

function ProgramacionCelda({ notif }: { notif: NotificacionRecurrente }) {
    const programacion = programacionDe(notif);
    const horarios = [...(programacion.horarios ?? [])].sort((a, b) => a.hora.localeCompare(b.hora));
    const visibles = horarios.slice(0, MAX_HORAS_VISIBLES);
    const ocultos = horarios.length - visibles.length;

    return (
        <div>
            <div className="text-sm font-medium">{describirDias(programacion)}</div>
            <div className="mt-1 flex flex-wrap items-center gap-1" title={horarios.map((h) => h.hora.substring(0, 5)).join(', ')}>
                {visibles.map((h) => (
                    <span
                        key={h.id ?? h.hora}
                        className={`rounded px-1.5 py-0.5 font-mono text-xs ${
                            h.activo
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-gray-100 text-gray-500 line-through dark:bg-gray-800'
                        }`}
                    >
                        {h.hora.substring(0, 5)}
                    </span>
                ))}
                {ocultos > 0 && <span className="text-xs text-gray-500">+{ocultos}</span>}
                {horarios.length === 0 && <span className="text-xs text-gray-500">Sin horarios</span>}
            </div>
        </div>
    );
}

function ProximoEnvioCelda({ notif, ahora }: { notif: NotificacionRecurrente; ahora: Date }) {
    if (!notif.activo) {
        return <Badge className="bg-gray-100 text-gray-600">Desactivada</Badge>;
    }
    const programacion = programacionDe(notif);
    const [proximo] = proximosEnvios(programacion, 1, ahora);
    if (!proximo) {
        return (
            <Badge className="bg-amber-100 text-amber-800" title={motivoSinEnvios(programacion, ahora) ?? undefined}>
                Sin envíos pendientes
            </Badge>
        );
    }
    return <span className="font-mono text-sm">{formatearEnvio(proximo, ahora)}</span>;
}

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
        page: 1,
    });
    const [busqueda, setBusqueda] = useState('');
    const busquedaDebounced = useDebouncedValue(busqueda, 400);
    const [paginacion, setPaginacion] = useState<Paginacion | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [procesandoId, setProcesandoId] = useState<number | null>(null);
    const [accionPendiente, setAccionPendiente] = useState<AccionPendiente>(null);
    const [imagenAmpliada, setImagenAmpliada] = useState<{ url: string; titulo: string } | null>(null);

    // La búsqueda solo dispara la petición cuando el usuario deja de escribir
    useEffect(() => {
        setFiltros((prev) => (prev.search === busquedaDebounced ? prev : { ...prev, search: busquedaDebounced, page: 1 }));
    }, [busquedaDebounced]);

    // Cargar notificaciones
    const cargarNotificaciones = useCallback(async () => {
        setLoading(true);
        try {
            const resultado = await notificacionesService.obtener(filtros);
            setNotificaciones(resultado.notificaciones);
            setEstadisticas(resultado.estadisticas);
            setPaginacion(resultado.pagination ?? null);
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

    const handleFiltroTipo = (value: string) => {
        setFiltros({ ...filtros, tipo: value === 'all' ? '' : value, page: 1 });
    };

    const handleFiltroActivo = (value: string) => {
        setFiltros({
            ...filtros,
            activo: value === 'all' ? undefined : value === 'true',
            page: 1,
        });
    };

    const irAPagina = (page: number) => {
        setFiltros((prev) => ({ ...prev, page }));
    };

    const eliminarNotificacion = async (id: number) => {
        setProcesandoId(id);
        try {
            await notificacionesService.eliminar(id);
            toast.success('Notificación eliminada exitosamente');
            // Si era el último registro de la página, retroceder una página
            const pagina = filtros.page ?? 1;
            if (notificaciones.length === 1 && pagina > 1) {
                irAPagina(pagina - 1);
            } else {
                cargarNotificaciones();
            }
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

    const confirmarAccion = () => {
        if (!accionPendiente) return;
        const { tipo, notificacion } = accionPendiente;
        setAccionPendiente(null);
        if (tipo === 'enviar') enviarManual(notificacion);
        else eliminarNotificacion(notificacion.id);
    };

    const destinatarios = (notif: NotificacionRecurrente) =>
        notif.roles && notif.roles.length > 0
            ? notif.roles.map((r) => r.display_name || r.name).join(', ')
            : 'todos los usuarios';

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

    // Referencia de "ahora" para las columnas de envíos; se renueva con cada carga
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ahora = useMemo(() => new Date(), [notificaciones]);

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
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
                        <div>
                            <div className="text-sm font-medium text-gray-600">Total</div>
                            <div className="text-2xl font-bold">{estadisticas.total}</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
                        <div>
                            <div className="text-sm font-medium text-green-600">Activas</div>
                            <div className="text-2xl font-bold">{estadisticas.activas}</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
                        <div>
                            <div className="text-sm font-medium text-gray-600">Inactivas</div>
                            <div className="text-2xl font-bold">{estadisticas.inactivas}</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2">
                        <div>
                            <div className="text-sm font-medium text-blue-600">Próximas</div>
                            <div className="text-2xl font-bold">{estadisticas.proximas}</div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="space-y-2">
                    <div className="bg-white dark:bg-gray-800 shadow p-2 rounded-lg">
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
                    </div>
                    {showFilters && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 shadow rounded-lg p-2">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Búsqueda</label>
                                    <Input
                                        placeholder="Buscar por título o descripción..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Tipo</label>
                                    <Select value={filtros.tipo || 'all'} onValueChange={handleFiltroTipo}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
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
                                        value={filtros.activo === undefined ? 'all' : String(filtros.activo)}
                                        onValueChange={handleFiltroActivo}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="true">Activas</SelectItem>
                                            <SelectItem value="false">Inactivas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla */}
                <div>
                    <div className="pt-2">
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
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 dark:bg-gray-700">
                                            <TableHead className="w-4">-</TableHead>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Programación</TableHead>
                                            <TableHead>Próximo envío</TableHead>
                                            <TableHead className="text-center">Enviadas</TableHead>
                                            {/* <TableHead className="text-center">Estado</TableHead> */}
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Último envío</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {notificaciones.map((notif) => (
                                            <TableRow key={notif.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {notif.activo ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                <Check className="w-3 h-3" />
                                                                #{notif.id}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-100 text-gray-800">
                                                                <span className="text-xs">X</span>
                                                                #{notif.id}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div className="flex items-center gap-3">
                                                        <MiniaturaImagen
                                                            key={notif.imagen_url ?? 'default'}
                                                            url={notif.imagen_url}
                                                            onAbrir={(url) => setImagenAmpliada({ url, titulo: notif.titulo })}
                                                        />
                                                        <span className="truncate font-medium" title={notif.titulo}>
                                                            {notif.titulo}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getTipoBadge(notif.tipo)}</TableCell>
                                                <TableCell className="min-w-44">
                                                    <ProgramacionCelda notif={notif} />
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <ProximoEnvioCelda notif={notif} ahora={ahora} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="text-sm">
                                                        {notif.total_enviadas}
                                                        <span className="text-gray-600 ml-1">
                                                            ({notif.vistas})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell className="text-center">
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
                                                </TableCell> */}
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
                                                <TableCell className="whitespace-nowrap text-sm text-gray-600">
                                                    {notif.ultimo_envio
                                                        ? formatearEnvio(new Date(notif.ultimo_envio), ahora)
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setAccionPendiente({ tipo: 'enviar', notificacion: notif })}
                                                            disabled={procesandoId === notif.id}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                                                            title="Enviar ahora"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                        <Link
                                                            href={`/notificaciones/${notif.id}/edit`}
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setAccionPendiente({ tipo: 'eliminar', notificacion: notif })}
                                                            disabled={procesandoId === notif.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                            title="Eliminar"
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

                        {/* Paginación */}
                        {paginacion && paginacion.total > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    Mostrando{' '}
                                    <strong>{(paginacion.current_page - 1) * paginacion.per_page + 1}</strong>–
                                    <strong>
                                        {Math.min(paginacion.current_page * paginacion.per_page, paginacion.total)}
                                    </strong>{' '}
                                    de <strong>{paginacion.total}</strong>
                                </span>
                                {paginacion.last_page > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={loading || paginacion.current_page <= 1}
                                            onClick={() => irAPagina(paginacion.current_page - 1)}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Anterior
                                        </Button>
                                        <span>
                                            Página {paginacion.current_page} de {paginacion.last_page}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={loading || paginacion.current_page >= paginacion.last_page}
                                            onClick={() => irAPagina(paginacion.current_page + 1)}
                                        >
                                            Siguiente
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Imagen ampliada */}
            <Dialog open={imagenAmpliada !== null} onOpenChange={(open) => !open && setImagenAmpliada(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="truncate pr-6">{imagenAmpliada?.titulo}</DialogTitle>
                    </DialogHeader>
                    {imagenAmpliada && (
                        <img
                            src={imagenAmpliada.url}
                            alt={`Imagen de ${imagenAmpliada.titulo}`}
                            className="max-h-[70vh] w-full rounded-lg object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmación de enviar / eliminar */}
            <AlertDialog open={accionPendiente !== null} onOpenChange={(open) => !open && setAccionPendiente(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {accionPendiente?.tipo === 'enviar' ? '¿Enviar notificación ahora?' : '¿Eliminar notificación?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {accionPendiente?.tipo === 'enviar' ? (
                                <>
                                    Se enviará <strong>"{accionPendiente.notificacion.titulo}"</strong> de inmediato a{' '}
                                    <strong>{destinatarios(accionPendiente.notificacion)}</strong>. Este envío no
                                    reemplaza a los horarios programados.
                                </>
                            ) : (
                                <>
                                    Se eliminará <strong>"{accionPendiente?.notificacion.titulo}"</strong> junto con
                                    todos sus horarios. Esta acción no se puede deshacer.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmarAccion}
                            className={accionPendiente?.tipo === 'eliminar' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                        >
                            {accionPendiente?.tipo === 'enviar' ? 'Enviar ahora' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
