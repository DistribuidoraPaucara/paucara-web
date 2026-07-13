import { useEstadosEntregas } from '@/application/hooks';
import { useEntregas } from '@/application/hooks/use-entregas';
import { useQueryParam } from '@/application/hooks/use-query-param';
import type { Entrega } from '@/domain/entities/entregas';
import type { Pagination } from '@/domain/entities/shared';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import EstadoEntregaBadge from '@/presentation/components/logistica/EstadoEntregaBadge';
import { ModalOptimizacionRutas } from '@/presentation/components/logistica/modal-optimizacion-rutas';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Eye, FileText, MapPin, MoreVertical, Pencil, Truck, User, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Importar componente de filtros y modal
import { CancelarEntregaModal } from './CancelarEntregaModal';
import { EntregasFilters, type FiltrosEntregas } from './EntregasFilters';
import { UbicacionesMultiplesModal } from './UbicacionesMultiplesModal';

interface Props {
    entregas: Pagination<Entrega>;
    vehiculos?: Array<{ id: number; placa: string; marca: string; modelo: string; capacidad_kg: number }>;
    choferes?: Array<{ id: number; nombre: string }>;
    localidades?: Array<{ id: number; nombre: string; codigo: string }>;
    estadosLogisticos?: Array<{ id: number; codigo: string; nombre: string; color?: string; icono?: string }>;
}

/**
 * Vista simple: tabla de entregas con filtros avanzados y opciones de batch
 *
 * MEJORAS IMPLEMENTADAS:
 * ✅ Filtros separados en componente `EntregasFilters`
 * ✅ Búsqueda con debounce (300ms)
 * ✅ Filtros por chofer, vehículo, fecha
 * ✅ Persistencia de filtros en URL (?estado=...&chofer_id=...&q=...)
 * ✅ Indicador visual de filtros activos
 * ✅ Botón reset rápido
 */
export function EntregasTableView({ entregas, vehiculos = [], choferes = [], localidades = [], estadosLogisticos = [] }: Props) {
    console.log('Renderizando EntregasTableView con entregas:', entregas);
    const { handleVerEntrega, handlePaginaAnterior, handlePaginaSiguiente } = useEntregas();

    // Usar hook de estados centralizados para obtener datos dinámicamente
    const { estados: estadosAPI, isLoading: estadosLoading } = useEstadosEntregas();

    // ✅ URL PERSISTENCE: Leer filtros desde URL y guardar cuando cambien
    const [estadoURL, setEstadoURL] = useQueryParam('estado', 'TODOS');
    const [busquedaEntregaURL, setBusquedaEntregaURL] = useQueryParam('search_entrega', '');
    const [busquedaVentasURL, setBusquedaVentasURL] = useQueryParam('search_ventas', '');
    const [choferURL, setChoferURL] = useQueryParam('chofer_id', '');
    const [vehiculoURL, setVehiculoURL] = useQueryParam('vehiculo_id', '');
    const [localidadURL, setLocalidadURL] = useQueryParam('localidad_id', '');
    const [estadoLogisticaURL, setEstadoLogisticaURL] = useQueryParam('estado_logistica_id', '');
    const [fechaDesdeURL, setFechaDesdeURL] = useQueryParam('fecha_desde', '');
    const [fechaHastaURL, setFechaHastaURL] = useQueryParam('fecha_hasta', '');
    const [tipoFechaURL, setTipoFechaURL] = useQueryParam('tipo_fecha', 'fecha_programada'); // ✅ NUEVO
    const [turnoURL, setTurnoURL] = useQueryParam('turno', ''); // ✅ NUEVO
    const [mostrarTodasLasFechas, setMostrarTodasLasFechas] = useState(false); // ✅ NUEVO: Estado local para mostrar todas las fechas (default: solo hoy)

    // Estado de filtros
    const [filtros, setFiltros] = useState<FiltrosEntregas>({
        estado: estadoURL,
        busqueda_entrega: busquedaEntregaURL,
        busqueda_ventas: busquedaVentasURL,
        chofer_id: choferURL,
        vehiculo_id: vehiculoURL,
        localidad_id: localidadURL,
        estado_logistica_id: estadoLogisticaURL,
        fecha_desde: fechaDesdeURL,
        fecha_hasta: fechaHastaURL,
        tipo_fecha: tipoFechaURL as 'created_at' | 'fecha_programada', // ✅ NUEVO
        turno: turnoURL as 'manana' | 'tarde' | '', // ✅ NUEVO
    });

    // Estados para selección y modal
    const [entregasSeleccionadas, setEntregasSeleccionadas] = useState<number[]>([]);
    const [mostrarOptimizacion, setMostrarOptimizacion] = useState(false);
    const [mostrarCancelarModal, setMostrarCancelarModal] = useState(false);
    const [entregaSeleccionadaParaCancelar, setEntregaSeleccionadaParaCancelar] = useState<{
        id: number;
        numero_entrega: string;
        estado: string;
    } | null>(null);
    const [mostrarOutputSelection, setMostrarOutputSelection] = useState(false);
    const [entregaSeleccionadaParaOutput, setEntregaSeleccionadaParaOutput] = useState<number | null>(null);
    // ✅ NUEVO: Estado para filas expandidas (mostrar ventas)
    const [entregasExpandidas, setEntregasExpandidas] = useState<Set<number>>(new Set());

    // ✅ NUEVO (2026-06-11): Estado para modal de ubicaciones múltiples
    const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
    const [entregaSeleccionadaParaUbicaciones, setEntregaSeleccionadaParaUbicaciones] = useState<Entrega | null>(null);

    // Handler para cambiar filtros (SOLO ESTADO LOCAL, sin refetch)
    const handleFilterChange = useCallback(
        (key: keyof FiltrosEntregas, value: string) => {
            setFiltros((prev) => ({ ...prev, [key]: value }));
            // ✅ Actualizar también los hooks de URL sincronizadamente para que handleAplicarFiltros use valores actualizados
            if (key === 'estado') setEstadoURL(value);
            else if (key === 'busqueda_entrega') setBusquedaEntregaURL(value);
            else if (key === 'busqueda_ventas') setBusquedaVentasURL(value);
            else if (key === 'chofer_id') setChoferURL(value);
            else if (key === 'vehiculo_id') setVehiculoURL(value);
            else if (key === 'localidad_id') setLocalidadURL(value);
            else if (key === 'estado_logistica_id') setEstadoLogisticaURL(value);
            else if (key === 'fecha_desde') setFechaDesdeURL(value);
            else if (key === 'fecha_hasta') setFechaHastaURL(value);
            else if (key === 'tipo_fecha')
                setTipoFechaURL(value); // ✅ NUEVO
            else if (key === 'turno') setTurnoURL(value); // ✅ NUEVO
        },
        [
            setEstadoURL,
            setBusquedaEntregaURL,
            setBusquedaVentasURL,
            setChoferURL,
            setVehiculoURL,
            setLocalidadURL,
            setEstadoLogisticaURL,
            setFechaDesdeURL,
            setFechaHastaURL,
            setTipoFechaURL,
            setTurnoURL,
        ],
    );

    // Handler para APLICAR filtros (manual - ENTER o botón Buscar)
    // ✅ Acepta los valores de filtros como parámetros para evitar issues de timing con state asíncrono
    const handleAplicarFiltros = useCallback(
        (filtrosDirectos?: Partial<FiltrosEntregas>) => {
            // Usar valores pasados directamente O los del state
            const busquedaEntregaFinal = filtrosDirectos?.busqueda_entrega !== undefined ? filtrosDirectos.busqueda_entrega : busquedaEntregaURL;
            const busquedaVentasFinal = filtrosDirectos?.busqueda_ventas !== undefined ? filtrosDirectos.busqueda_ventas : busquedaVentasURL;
            const estadoFinal = filtrosDirectos?.estado !== undefined ? filtrosDirectos.estado : estadoURL;
            const choferFinal = filtrosDirectos?.chofer_id !== undefined ? filtrosDirectos.chofer_id : choferURL;
            const vehiculoFinal = filtrosDirectos?.vehiculo_id !== undefined ? filtrosDirectos.vehiculo_id : vehiculoURL;
            const localidadFinal = filtrosDirectos?.localidad_id !== undefined ? filtrosDirectos.localidad_id : localidadURL;
            const estadoLogisticaFinal =
                filtrosDirectos?.estado_logistica_id !== undefined ? filtrosDirectos.estado_logistica_id : estadoLogisticaURL;
            const fechaDesdeFinal = filtrosDirectos?.fecha_desde !== undefined ? filtrosDirectos.fecha_desde : fechaDesdeURL;
            const fechaHastaFinal = filtrosDirectos?.fecha_hasta !== undefined ? filtrosDirectos.fecha_hasta : fechaHastaURL;
            const tipoFechaFinal = filtrosDirectos?.tipo_fecha !== undefined ? filtrosDirectos.tipo_fecha : tipoFechaURL; // ✅ NUEVO
            const turnoFinal = filtrosDirectos?.turno !== undefined ? filtrosDirectos.turno : turnoURL; // ✅ NUEVO

            // Construir URL con parámetros
            const params = new URLSearchParams();
            if (estadoFinal && estadoFinal !== 'TODOS') params.append('estado', estadoFinal);
            if (busquedaEntregaFinal) params.append('search_entrega', busquedaEntregaFinal);
            if (busquedaVentasFinal) params.append('search_ventas', busquedaVentasFinal);
            if (choferFinal) params.append('chofer_id', choferFinal);
            if (vehiculoFinal) params.append('vehiculo_id', vehiculoFinal);
            if (localidadFinal) params.append('localidad_id', localidadFinal);
            if (estadoLogisticaFinal) params.append('estado_logistica_id', estadoLogisticaFinal);
            if (fechaDesdeFinal) params.append('fecha_desde', fechaDesdeFinal);
            if (fechaHastaFinal) params.append('fecha_hasta', fechaHastaFinal);
            if (tipoFechaFinal && tipoFechaFinal !== 'fecha_programada') params.append('tipo_fecha', tipoFechaFinal); // ✅ NUEVO
            if (turnoFinal) params.append('turno', turnoFinal); // ✅ NUEVO

            // Navegar con nuevos filtros
            const url = `/logistica/entregas${params.toString() ? '?' + params.toString() : ''}`;
            window.location.href = url; // Recarga simple
        },
        [
            estadoURL,
            busquedaEntregaURL,
            busquedaVentasURL,
            choferURL,
            vehiculoURL,
            localidadURL,
            estadoLogisticaURL,
            fechaDesdeURL,
            fechaHastaURL,
            tipoFechaURL,
            turnoURL,
        ],
    );

    // Handler para resetear todos los filtros
    const handleResetFiltros = useCallback(() => {
        setFiltros({
            estado: 'TODOS',
            busqueda_entrega: '',
            busqueda_ventas: '',
            chofer_id: '',
            vehiculo_id: '',
            localidad_id: '',
            estado_logistica_id: '',
            fecha_desde: '',
            fecha_hasta: '',
            tipo_fecha: 'fecha_programada', // ✅ NUEVO
            turno: '', // ✅ NUEVO
        });
        setEstadoURL('TODOS');
        setBusquedaEntregaURL('');
        setBusquedaVentasURL('');
        setChoferURL('');
        setVehiculoURL('');
        setLocalidadURL('');
        setEstadoLogisticaURL('');
        setFechaDesdeURL('');
        setFechaHastaURL('');
        setTipoFechaURL('fecha_programada'); // ✅ NUEVO
        setTurnoURL(''); // ✅ NUEVO
        setMostrarTodasLasFechas(false);

        // Recargar página sin filtros
        window.location.href = '/logistica/entregas';
    }, [
        setEstadoURL,
        setBusquedaEntregaURL,
        setBusquedaVentasURL,
        setChoferURL,
        setVehiculoURL,
        setLocalidadURL,
        setEstadoLogisticaURL,
        setFechaDesdeURL,
        setFechaHastaURL,
        setTipoFechaURL,
        setTurnoURL,
    ]);

    // Handler para abrir modal de cancelación
    const handleAbrirCancelarModal = useCallback((entrega: Entrega) => {
        // Validar que la entrega puede ser cancelada
        const estadosCancelables = ['PROGRAMADO', 'PENDIENTE', 'EN_TRANSITO', 'PREPARACION_CARGA'];
        if (!estadosCancelables.includes(entrega.estado)) {
            console.warn(`No se puede cancelar entrega en estado: ${entrega.estado}`);
            return;
        }

        setEntregaSeleccionadaParaCancelar({
            id: entrega.id,
            numero_entrega: entrega.numero_entrega,
            estado: entrega.estado,
        });
        setMostrarCancelarModal(true);
    }, []);

    // Handler para abrir modal de output selection
    const handleAbrirOutputSelection = useCallback((entregaId: number) => {
        setEntregaSeleccionadaParaOutput(entregaId);
        setMostrarOutputSelection(true);
    }, []);

    // ✅ NUEVO (2026-06-11): Handler para abrir modal de ubicaciones múltiples
    const handleAbrirUbicaciones = useCallback((entrega: Entrega) => {
        setEntregaSeleccionadaParaUbicaciones(entrega);
        setMostrarUbicaciones(true);
    }, []);

    // ✅ NUEVO: Auto-activar "Todas las fechas" si hay parámetros de fecha en URL
    useEffect(() => {
        if (fechaDesdeURL || fechaHastaURL) {
            setMostrarTodasLasFechas(true); // Activar automáticamente si hay fechas en URL
        }
    }, [fechaDesdeURL, fechaHastaURL]);

    // ✅ SIMPLIFICADO: El backend ya filtra TODO, aquí solo usamos los datos ya filtrados
    const entregasFiltradas = useMemo(() => {
        // El backend ya aplicó todos los filtros (estado, fechas, chofer, vehículo, localidad, estado_logística, búsqueda)
        // Solo filtrar localmente si es necesario mostrar "Solo Hoy" Y NO hay parámetros específicos
        if (
            !mostrarTodasLasFechas &&
            !filtros.fecha_desde &&
            !filtros.fecha_hasta &&
            !filtros.busqueda_entrega &&
            !filtros.busqueda_ventas &&
            !filtros.estado_logistica_id
        ) {
            // Si está en "Solo Hoy" y no hay parámetros de fecha, búsqueda o filtros específicos, filtrar por created_at
            return entregas.data.filter((entrega) => entrega.created_at && new Date(entrega.created_at).toDateString() === new Date().toDateString());
        }
        // Si hay parámetros de fecha, búsqueda o filtros específicos, el backend ya filtró - devolver datos tal cual
        return entregas.data;
    }, [entregas.data, filtros, mostrarTodasLasFechas]);

    // ✅ NUEVO: Toglear expansión de fila
    const toggleExpandirEntrega = (entregaId: number) => {
        setEntregasExpandidas((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(entregaId)) {
                newSet.delete(entregaId);
            } else {
                newSet.add(entregaId);
            }
            return newSet;
        });
    };

    // ✅ Función para calcular el total de una entrega (suma de subtotales de todas las ventas)
    const calcularTotalEntrega = (entrega: Entrega): number => {
        return (
            entrega.ventas?.reduce((total, venta) => {
                const subtotal = typeof venta.subtotal === 'string' ? parseFloat(venta.subtotal) : venta.subtotal || 0;
                return total + subtotal;
            }, 0) ?? 0
        );
    };

    return (
        <div className="space-y-6">
            {/* ✅ COMPONENTE DE FILTROS MEJORADO */}
            <EntregasFilters
                filtros={filtros}
                onFilterChange={handleFilterChange}
                onReset={handleResetFiltros}
                onApply={handleAplicarFiltros}
                estadosAPI={estadosAPI}
                vehiculos={vehiculos}
                choferes={choferes}
                localidades={localidades}
                estadosLogisticos={estadosLogisticos}
                isLoading={estadosLoading}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Lista de Entregas
                        <Badge variant="outline" className="ml-2">
                            {entregasFiltradas.length} / {entregas.data.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {entregas.data.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground">No se encontraron entregas.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>#ID</TableHead>
                                        <TableHead>Logistica</TableHead>
                                        <TableHead>Vehículo / Chofer</TableHead>
                                        <TableHead>Ventas Asignadas</TableHead>
                                        <TableHead>Peso</TableHead>
                                        <TableHead>🕐 Creada</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entregasFiltradas.map((entrega) => {
                                        const estaExpandida = entregasExpandidas.has(Number(entrega.id));
                                        return (
                                            <React.Fragment key={entrega.id}>
                                                <TableRow
                                                    className={
                                                        entregasSeleccionadas.includes(Number(entrega.id)) ? 'bg-blue-50 dark:bg-blue-950' : ''
                                                    }
                                                >
                                                    {/* ✅ NUEVO: Botón para expandir */}
                                                    <TableCell
                                                        className="cursor-pointer text-left"
                                                        onClick={() => toggleExpandirEntrega(Number(entrega.id))}
                                                    >
                                                        {entrega.ventas && entrega.ventas.length > 0 ? (
                                                            estaExpandida ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell>
                                                        Folio: {entrega.id} <br /> {entrega.numero_entrega || entrega.numero_envio}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <EstadoEntregaBadge estado={entrega.estado} tamaño="sm" conIcono={true} mostrarLabel={true} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {entrega.vehiculo ? (
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4 text-muted-foreground" />
                                                                <div>
                                                                    <div className="font-medium">{entrega.vehiculo.placa}</div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {entrega.vehiculo.marca} {entrega.vehiculo.modelo}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                        {entrega.chofer ? (
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                {entrega.chofer.name || entrega.chofer.nombre}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    {/* ✅ NUEVO: Columna de Ventas Asignadas con Rango Compacto */}
                                                    <TableCell>
                                                        {entrega.ventas && entrega.ventas.length > 0 ? (
                                                            <div className="space-y-1">
                                                                <div>
                                                                    {/* 📊 Mostrar rango de IDs de ventas como vista rápida */}
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Folio: {Math.min(...entrega.ventas.map((v) => v.id))}
                                                                        {entrega.ventas.length > 1
                                                                            ? ` a ${Math.max(...entrega.ventas.map((v) => v.id))} \n`
                                                                            : ''} / {entrega.ventas.length} venta{entrega.ventas.length !== 1 ? 's' : ''}
                                                                    </Badge>
                                                                </div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Bs. {calcularTotalEntrega(entrega).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">Sin ventas</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-md font-bold">
                                                            {entrega.peso_kg ? (
                                                                <span className="font-medium">{entrega.peso_kg} kg</span>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    {/* ✅ NUEVO: Columna Fecha de Creación */}
                                                    <TableCell>
                                                        <div className="text-xs">
                                                            {entrega.created_at ? (
                                                                <>
                                                                    <div className="font-medium">
                                                                        {new Date(entrega.created_at).toLocaleDateString('es-BO', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                        })}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {new Date(entrega.created_at).toLocaleTimeString('es-BO', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button size="sm" variant="outline" onClick={() => handleVerEntrega(entrega.id)}>
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            Ver
                                                        </Button>
                                                        {/* ✅ NUEVO: Menú desplegable con acciones */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Acciones">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">Abrir menú</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent align="end">
                                                                {/* Ver entrega */}
                                                                <DropdownMenuItem onClick={() => handleVerEntrega(entrega.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Ver Entrega
                                                                </DropdownMenuItem>

                                                                {/* Ver ubicaciones */}
                                                                {entrega.ventas && entrega.ventas.length > 0 && (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => handleAbrirUbicaciones(entrega)}>
                                                                            <MapPin className="mr-2 h-4 w-4" />
                                                                            Ver Ubicaciones ({entrega.ventas.length})
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                    </>
                                                                )}

                                                                {/* Editar */}
                                                                <Link href={`/logistica/entregas/${entrega.id}/edit`}>
                                                                    <DropdownMenuItem>
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        Editar
                                                                    </DropdownMenuItem>
                                                                </Link>

                                                                {/* Imprimir */}
                                                                <DropdownMenuItem onClick={() => handleAbrirOutputSelection(entrega.id)}>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    Imprimir
                                                                </DropdownMenuItem>

                                                                {/* Cancelar - solo si estado permite */}
                                                                {['PROGRAMADO', 'PENDIENTE', 'EN_TRANSITO', 'PREPARACION_CARGA'].includes(
                                                                    entrega.estado,
                                                                ) && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleAbrirCancelarModal(entrega)}
                                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950/30 dark:focus:text-red-400"
                                                                        >
                                                                            <XCircle className="mr-2 h-4 w-4" />
                                                                            Cancelar
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                                {/* ✅ NUEVO: Fila expandible con detalles de ventas */}
                                                {estaExpandida && entrega.ventas && entrega.ventas.length > 0 && (
                                                    <TableRow className="bg-slate-50 dark:bg-slate-900">
                                                        <TableCell colSpan={8} className="p-4">
                                                            <div className="space-y-3">
                                                                <h4 className="mb-3 text-sm font-semibold">
                                                                    📦 Ventas en esta entrega ({entrega.ventas.length}):
                                                                </h4>

                                                                {/* ✅ TABLA NESTED DE VENTAS */}
                                                                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                                                                    <table className="w-full text-sm">
                                                                        {/* Encabezados */}
                                                                        <thead>
                                                                            <tr className="border-b border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800">
                                                                                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Folio
                                                                                </th>
                                                                                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Cliente
                                                                                </th>
                                                                                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Tipo de Pago
                                                                                </th>
                                                                                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Monto
                                                                                </th>
                                                                                {/* <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Tipo Entrega
                                                                                </th> */}
                                                                                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Confirmación
                                                                                </th>
                                                                                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Estado Logístico
                                                                                </th>
                                                                                
                                                                                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Peso
                                                                                </th>
                                                                                
                                                                            </tr>
                                                                        </thead>

                                                                        {/* Cuerpo de la tabla */}
                                                                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                                                            {entrega.ventas.map((venta) => {
                                                                                // ✅ DEBUG: Mostrar datos que llegan del backend
                                                                                console.log('🔍 Venta completa:', {
                                                                                    venta_id: venta.id,
                                                                                    venta_numero: venta.numero,
                                                                                    confirmacion_entrega: venta.confirmacion_entrega,
                                                                                    tipo_entrega: venta.confirmacion_entrega?.tipo_entrega,
                                                                                    tipo_confirmacion: venta.confirmacion_entrega?.tipo_confirmacion,
                                                                                });

                                                                                const montoTotal =
                                                                                    typeof venta.total === 'string'
                                                                                        ? parseFloat(venta.total)
                                                                                        : venta.total || 0;

                                                                                return (
                                                                                    <tr
                                                                                        key={venta.id}
                                                                                        className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                                    >
                                                                                        {/* Folio */}
                                                                                        <td className="px-3 py-3">
                                                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                                                #{venta.id}
                                                                                            </div>
                                                                                            {venta.numero && (
                                                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                                    {venta.numero}
                                                                                                </div>
                                                                                            )}
                                                                                        </td>

                                                                                        {/* Cliente */}
                                                                                        <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                                                                                            {venta.cliente?.nombre || '-'}
                                                                                        </td>

                                                                                        {/* Tipo de Pago */}
                                                                                        <td className="px-3 py-3">
                                                                                            {venta.tipo_pago ? (
                                                                                                <Badge
                                                                                                    className={
                                                                                                        venta.tipo_pago?.codigo?.includes('CREDITO')
                                                                                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                                                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                                                    }
                                                                                                >
                                                                                                    💳 {venta.tipo_pago.nombre}
                                                                                                </Badge>
                                                                                            ) : (
                                                                                                <span className="text-gray-400 dark:text-gray-600">
                                                                                                    -
                                                                                                </span>
                                                                                            )}
                                                                                        </td>
                                                                                        {/* Monto */}
                                                                                        <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                                                                                            Bs. {montoTotal.toFixed(2)}
                                                                                        </td>

                                                                                        {/* Tipo Entrega */}
                                                                                        {/* <td className="px-3 py-3">
                                                                                            {venta.confirmacion_entrega?.tipo_entrega ? (
                                                                                                <Badge
                                                                                                    className={
                                                                                                        venta.confirmacion_entrega.tipo_entrega ===
                                                                                                        'COMPLETA'
                                                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                                                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                                                                                    }
                                                                                                >
                                                                                                    {venta.confirmacion_entrega.tipo_entrega ===
                                                                                                    'COMPLETA'
                                                                                                        ? '✅'
                                                                                                        : '⚠️'}{' '}
                                                                                                    {venta.confirmacion_entrega.tipo_entrega}
                                                                                                </Badge>
                                                                                            ) : (
                                                                                                <span className="text-gray-400 dark:text-gray-600">
                                                                                                    -
                                                                                                </span>
                                                                                            )}
                                                                                        </td> */}

                                                                                        {/* Confirmación */}
                                                                                        <td className="px-3 py-3">
                                                                                            {venta.confirmacion_entrega?.tipo_confirmacion ? (
                                                                                                <Badge
                                                                                                    className={
                                                                                                        venta.confirmacion_entrega
                                                                                                            .tipo_confirmacion === 'COMPLETA'
                                                                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                                                                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                                                                                    }
                                                                                                >
                                                                                                    {venta.confirmacion_entrega.tipo_confirmacion ===
                                                                                                    'COMPLETA'
                                                                                                        ? '✓'
                                                                                                        : '✗'}{' '}
                                                                                                    {venta.confirmacion_entrega.tipo_confirmacion}
                                                                                                </Badge>
                                                                                            ) : (
                                                                                                <span className="text-gray-400 dark:text-gray-600">
                                                                                                    -
                                                                                                </span>
                                                                                            )}
                                                                                        </td>

                                                                                        {/* Estado Logístico */}
                                                                                        <td className="px-3 py-3">
                                                                                            {venta.estado_logistica ? (
                                                                                                <Badge
                                                                                                    style={{
                                                                                                        backgroundColor: venta.estado_logistica.color
                                                                                                            ? `${venta.estado_logistica.color}20`
                                                                                                            : '#f3f4f6',
                                                                                                        color: venta.estado_logistica.color
                                                                                                            ? venta.estado_logistica.color
                                                                                                            : '#6b7280',
                                                                                                        borderColor: venta.estado_logistica.color,
                                                                                                        borderWidth: '1px',
                                                                                                    }}
                                                                                                    className="font-medium"
                                                                                                >
                                                                                                    {venta.estado_logistica.icono && (
                                                                                                        <span className="mr-1">
                                                                                                            {venta.estado_logistica.icono}
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {venta.estado_logistica.nombre}
                                                                                                </Badge>
                                                                                            ) : (
                                                                                                <span className="text-gray-400 dark:text-gray-600">
                                                                                                    -
                                                                                                </span>
                                                                                            )}
                                                                                        </td>

                                                                                        

                                                                                        {/* Peso */}
                                                                                        <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">
                                                                                            {venta.peso_total_estimado
                                                                                                ? `${venta.peso_total_estimado} kg`
                                                                                                : '-'}
                                                                                        </td>

                                                                                        
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {/* Paginación simple */}
                            {entregas.last_page > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Página {entregas.current_page} de {entregas.last_page}({entregas.total} total)
                                    </div>
                                    <div className="flex gap-2">
                                        {entregas.current_page > 1 && (
                                            <Button variant="outline" size="sm" onClick={() => handlePaginaAnterior(entregas.current_page)}>
                                                Anterior
                                            </Button>
                                        )}
                                        {entregas.current_page < entregas.last_page && (
                                            <Button variant="outline" size="sm" onClick={() => handlePaginaSiguiente(entregas.current_page)}>
                                                Siguiente
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de cancelación de entrega */}
            <CancelarEntregaModal
                isOpen={mostrarCancelarModal}
                onClose={() => {
                    setMostrarCancelarModal(false);
                    setEntregaSeleccionadaParaCancelar(null);
                }}
                entrega={entregaSeleccionadaParaCancelar}
            />

            {/* Modal de selección de output (imprimir/descargar) */}
            {entregaSeleccionadaParaOutput && (
                <OutputSelectionModal
                    isOpen={mostrarOutputSelection}
                    onClose={() => {
                        setMostrarOutputSelection(false);
                        setEntregaSeleccionadaParaOutput(null);
                    }}
                    documentoId={entregaSeleccionadaParaOutput}
                    tipoDocumento="entrega"
                />
            )}

            {/* Modal de optimización */}
            <ModalOptimizacionRutas
                open={mostrarOptimizacion}
                onClose={() => setMostrarOptimizacion(false)}
                entregasIds={entregasSeleccionadas}
                vehiculos={vehiculos}
                choferes={choferes}
            />

            {/* ✅ NUEVO (2026-06-11): Modal de ubicaciones múltiples */}
            {entregaSeleccionadaParaUbicaciones && (
                <UbicacionesMultiplesModal
                    isOpen={mostrarUbicaciones}
                    onClose={() => {
                        setMostrarUbicaciones(false);
                        setEntregaSeleccionadaParaUbicaciones(null);
                    }}
                    ubicaciones={
                        entregaSeleccionadaParaUbicaciones.ventas?.map((venta) => ({
                            id: venta.direccion_cliente?.id || venta.id,
                            venta_id: venta.id,
                            venta_numero: venta.numero,
                            cliente_nombre: venta.cliente?.nombre || 'Cliente desconocido',
                            cliente_telefono: venta.cliente?.telefono,
                            cliente_foto: venta.cliente?.foto_perfil ? `/storage/${venta.cliente.foto_perfil}` : undefined,
                            direccion: venta.direccion_cliente?.direccion || 'Sin dirección',
                            observaciones: venta.direccion_cliente?.observaciones,
                            latitud: venta.direccion_cliente?.latitud,
                            longitud: venta.direccion_cliente?.longitud,
                            estado: entregaSeleccionadaParaUbicaciones.estado_entrega?.nombre,
                            tipo_entrega: venta.confirmacion_entrega?.tipo_entrega || 'COMPLETA',
                            confirmacion_entrega: venta.confirmacion_entrega ? {
                                tipo_confirmacion: venta.confirmacion_entrega.tipo_confirmacion,
                                total_dinero_recibido: venta.confirmacion_entrega.total_dinero_recibido,
                                monto_pendiente: venta.confirmacion_entrega.monto_pendiente,
                                confirmado_en: venta.confirmacion_entrega.confirmado_en,
                            } : undefined,
                        })) || []
                    }
                    titulo={`Ubicaciones de Entrega ${entregaSeleccionadaParaUbicaciones.numero_entrega || ''}`}
                />
            )}
        </div>
    );
}
