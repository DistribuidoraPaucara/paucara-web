import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Eye, Truck, User, Plus, Route, XCircle, FileText, Pencil, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { Entrega } from '@/domain/entities/entregas';
import type { Pagination } from '@/domain/entities/shared';
import { getEstadoBadgeVariant, getEstadoLabel, formatearFecha } from '@/lib/entregas.utils';
import { useEntregas } from '@/application/hooks/use-entregas';
import { useEstadosEntregas } from '@/application/hooks';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ModalOptimizacionRutas } from '@/presentation/components/logistica/modal-optimizacion-rutas';
import { useQueryParam } from '@/application/hooks/use-query-param';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import EstadoEntregaBadge from '@/presentation/components/logistica/EstadoEntregaBadge';

// Importar componente de filtros
import { EntregasFilters, type FiltrosEntregas } from './EntregasFilters';
import { CancelarEntregaModal } from './CancelarEntregaModal';

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

    // Handler para cambiar filtros (SOLO ESTADO LOCAL, sin refetch)
    const handleFilterChange = useCallback((key: keyof FiltrosEntregas, value: string) => {
        setFiltros(prev => ({ ...prev, [key]: value }));
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
        else if (key === 'tipo_fecha') setTipoFechaURL(value); // ✅ NUEVO
        else if (key === 'turno') setTurnoURL(value); // ✅ NUEVO
    }, [setEstadoURL, setBusquedaEntregaURL, setBusquedaVentasURL, setChoferURL, setVehiculoURL, setLocalidadURL, setEstadoLogisticaURL, setFechaDesdeURL, setFechaHastaURL, setTipoFechaURL, setTurnoURL]);

    // Handler para APLICAR filtros (manual - ENTER o botón Buscar)
    // ✅ Acepta los valores de filtros como parámetros para evitar issues de timing con state asíncrono
    const handleAplicarFiltros = useCallback((filtrosDirectos?: Partial<FiltrosEntregas>) => {
        // Usar valores pasados directamente O los del state
        const busquedaEntregaFinal = filtrosDirectos?.busqueda_entrega !== undefined ? filtrosDirectos.busqueda_entrega : busquedaEntregaURL;
        const busquedaVentasFinal = filtrosDirectos?.busqueda_ventas !== undefined ? filtrosDirectos.busqueda_ventas : busquedaVentasURL;
        const estadoFinal = filtrosDirectos?.estado !== undefined ? filtrosDirectos.estado : estadoURL;
        const choferFinal = filtrosDirectos?.chofer_id !== undefined ? filtrosDirectos.chofer_id : choferURL;
        const vehiculoFinal = filtrosDirectos?.vehiculo_id !== undefined ? filtrosDirectos.vehiculo_id : vehiculoURL;
        const localidadFinal = filtrosDirectos?.localidad_id !== undefined ? filtrosDirectos.localidad_id : localidadURL;
        const estadoLogisticaFinal = filtrosDirectos?.estado_logistica_id !== undefined ? filtrosDirectos.estado_logistica_id : estadoLogisticaURL;
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
    }, [estadoURL, busquedaEntregaURL, busquedaVentasURL, choferURL, vehiculoURL, localidadURL, estadoLogisticaURL, fechaDesdeURL, fechaHastaURL, tipoFechaURL, turnoURL]);

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
    }, [setEstadoURL, setBusquedaEntregaURL, setBusquedaVentasURL, setChoferURL, setVehiculoURL, setLocalidadURL, setEstadoLogisticaURL, setFechaDesdeURL, setFechaHastaURL, setTipoFechaURL, setTurnoURL]);

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

    // ✅ NUEVO: Auto-activar "Todas las fechas" si hay parámetros de fecha en URL
    useEffect(() => {
        if (fechaDesdeURL || fechaHastaURL) {
            setMostrarTodasLasFechas(true);  // Activar automáticamente si hay fechas en URL
        }
    }, [fechaDesdeURL, fechaHastaURL]);

    // ✅ SIMPLIFICADO: El backend ya filtra TODO, aquí solo usamos los datos ya filtrados
    const entregasFiltradas = useMemo(() => {
        // El backend ya aplicó todos los filtros (estado, fechas, chofer, vehículo, localidad, estado_logística, búsqueda)
        // Solo filtrar localmente si es necesario mostrar "Solo Hoy" Y NO hay búsqueda específica
        if (!mostrarTodasLasFechas && !filtros.fecha_desde && !filtros.fecha_hasta && !filtros.busqueda_entrega && !filtros.busqueda_ventas) {
            // Si está en "Solo Hoy" y no hay parámetros de fecha ni búsqueda, filtrar por created_at
            return entregas.data.filter(entrega =>
                entrega.created_at &&
                new Date(entrega.created_at).toDateString() === new Date().toDateString()
            );
        }
        // Si hay parámetros de fecha o búsqueda, el backend ya filtró - devolver datos tal cual
        return entregas.data;
    }, [entregas.data, filtros, mostrarTodasLasFechas]);

    // Selección múltiple
    const toggleSeleccion = (id: number) => {
        setEntregasSeleccionadas(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // ✅ NUEVO: Toglear expansión de fila
    const toggleExpandirEntrega = (entregaId: number) => {
        setEntregasExpandidas(prev => {
            const newSet = new Set(prev);
            if (newSet.has(entregaId)) {
                newSet.delete(entregaId);
            } else {
                newSet.add(entregaId);
            }
            return newSet;
        });
    };

    const toggleSeleccionTodos = () => {
        if (entregasSeleccionadas.length === entregasFiltradas.length) {
            setEntregasSeleccionadas([]);
        } else {
            setEntregasSeleccionadas(entregasFiltradas.map(e => Number(e.id)));
        }
    };

    // ✅ Función para calcular el total de una entrega (suma de subtotales de todas las ventas)
    const calcularTotalEntrega = (entrega: Entrega): number => {
        return entrega.ventas?.reduce((total, venta) => {
            const subtotal = typeof venta.subtotal === 'string' ? parseFloat(venta.subtotal) : venta.subtotal || 0;
            return total + subtotal;
        }, 0) ?? 0;
    };

    const entregasProgramadas = entregasFiltradas.filter(e => e.estado === 'PROGRAMADO' || e.estado === 'PENDIENTE');
    const puedeOptimizar = entregasSeleccionadas.length >= 2 &&
        entregasSeleccionadas.every(id => {
            const entrega = entregas.data.find(e => Number(e.id) === id);
            return entrega && (entrega.estado === 'PROGRAMADO' || entrega.estado === 'PENDIENTE');
        });

    return (
        <div className="space-y-6">
            {/* Acciones rápidas */}
            <div className="flex gap-2">
                {entregasSeleccionadas.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={() => setEntregasSeleccionadas([])}
                    >
                        Limpiar selección ({entregasSeleccionadas.length})
                    </Button>
                )}
                {puedeOptimizar && (
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setMostrarOptimizacion(true)}
                    >
                        <Route className="h-4 w-4 mr-2" />
                        Optimizar Rutas ({entregasSeleccionadas.length})
                    </Button>
                )}
                <Link href="/logistica/entregas/create" className="ml-auto">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Entrega
                    </Button>
                </Link>
            </div>

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

            {/* ✅ NUEVO: Toggle para ver "Todas las fechas" */}
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant={mostrarTodasLasFechas ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMostrarTodasLasFechas(!mostrarTodasLasFechas)}
                    className="gap-2"
                >
                    <Calendar className="h-4 w-4" />
                    {mostrarTodasLasFechas ? '📅 Todas las Fechas' : '📅 Solo Hoy'}
                </Button>
            </div>

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
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No se encontraron entregas.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[5%]"></TableHead>
                                        <TableHead className="w-[15%]">#ID</TableHead>
                                        <TableHead className="w-[20%]">Vehículo / Chofer</TableHead>
                                        <TableHead className="w-[20%]">Ventas Asignadas</TableHead>
                                        <TableHead className="w-[15%]">Total</TableHead>
                                        <TableHead className="w-[15%]">🕐 Creada</TableHead>
                                        <TableHead className="w-[10%]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entregasFiltradas.map((entrega) => {
                                        const estaExpandida = entregasExpandidas.has(Number(entrega.id));
                                        return (
                                            <React.Fragment key={entrega.id}>
                                                <TableRow
                                                    className={entregasSeleccionadas.includes(Number(entrega.id)) ? 'bg-blue-50 dark:bg-blue-950' : ''}
                                                >
                                                    {/* ✅ NUEVO: Botón para expandir */}
                                                    <TableCell className="w-[5%] text-center cursor-pointer" onClick={() => toggleExpandirEntrega(Number(entrega.id))}>
                                                        {entrega.ventas && entrega.ventas.length > 0 ? (
                                                            estaExpandida ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell className="w-[15%]">
                                                        Folio: {entrega.id} <br /> {entrega.numero_entrega || entrega.numero_envio}
                                                        <br />
                                                        <EstadoEntregaBadge
                                                            estado={entrega.estado}
                                                            tamaño="sm"
                                                            conIcono={true}
                                                            mostrarLabel={true}
                                                        />
                                                        <br />
                                                    </TableCell>
                                                    <TableCell className="w-[20%]">
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
                                                    <TableCell className="w-[20%]">
                                                        {entrega.ventas && entrega.ventas.length > 0 ? (
                                                            <div className="space-y-1">
                                                                <div>
                                                                    {/* 📊 Mostrar rango de IDs de ventas como vista rápida */}
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Folio: {Math.min(...entrega.ventas.map(v => v.id))}
                                                                        {entrega.ventas.length > 1
                                                                            ? ` a ${Math.max(...entrega.ventas.map(v => v.id))}`
                                                                            : ''
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {entrega.ventas.length} venta{entrega.ventas.length !== 1 ? 's' : ''}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">Sin ventas</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="w-[15%]">
                                                        <span className="font-bold text-lg">
                                                            {entrega.peso_kg ? (
                                                                <span className="font-medium">{entrega.peso_kg} kg</span>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                            <br />
                                                            {calcularTotalEntrega(entrega).toLocaleString('es-BO', {
                                                                style: 'currency',
                                                                currency: 'BOB',
                                                                minimumFractionDigits: 2
                                                            })}
                                                        </span>
                                                        <br />
                                                        <span className="text-sm text-muted-foreground">
                                                            {entrega.ventas?.length || 0} venta{(entrega.ventas?.length || 0) !== 1 ? 's' : ''}
                                                        </span>
                                                    </TableCell>
                                                    {/* ✅ NUEVO: Columna Fecha de Creación */}
                                                    <TableCell className="w-[15%]">
                                                        <div className="text-sm">
                                                            {entrega.created_at ? (
                                                                <>
                                                                    <div className="font-medium">
                                                                        {new Date(entrega.created_at).toLocaleDateString('es-BO', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {new Date(entrega.created_at).toLocaleTimeString('es-BO', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="w-[10%]">
                                                        <div className="flex gap-2 flex-wrap">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleVerEntrega(entrega.id)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Ver
                                                            </Button>
                                                            <Link href={`/logistica/entregas/${entrega.id}/edit`}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    title="Editar entrega"
                                                                >
                                                                    <Pencil className="h-4 w-4 mr-1" />
                                                                    Editar
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleAbrirOutputSelection(entrega.id)}
                                                                title="Descargar o imprimir entrega"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                            {/* Botón de cancelación - solo si el estado permite */}
                                                            {['PROGRAMADO', 'PENDIENTE', 'EN_TRANSITO', 'PREPARACION_CARGA'].includes(entrega.estado) && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleAbrirCancelarModal(entrega)}
                                                                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                    title="Cancelar entrega"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {/* ✅ NUEVO: Fila expandible con detalles de ventas */}
                                                {estaExpandida && entrega.ventas && entrega.ventas.length > 0 && (
                                                    <TableRow className="bg-slate-50 dark:bg-slate-900">
                                                        <TableCell colSpan={7} className="p-4">
                                                            <div className="space-y-3">
                                                                <h4 className="font-semibold text-sm">Ventas en esta entrega:</h4>
                                                                <div className="space-y-2">
                                                                    {entrega.ventas.map((venta) => (
                                                                        <div key={venta.id} className="border-l-2 border-blue-400 pl-3 py-2">
                                                                            <div className="flex items-start justify-between">
                                                                                <div>
                                                                                    <div className="font-medium">Folio: {venta.id}</div>
                                                                                    <div className="text-sm text-muted-foreground">{venta.cliente?.nombre || '-'}</div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <div className="font-semibold">
                                                                                        {(typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total || 0).toLocaleString('es-BO', {
                                                                                            style: 'currency',
                                                                                            currency: 'BOB',
                                                                                            minimumFractionDigits: 2
                                                                                        })}
                                                                                    </div>
                                                                                    {venta.peso_total_estimado && (
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            {venta.peso_total_estimado} kg
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {venta.detalles && venta.detalles.length > 0 && (
                                                                                <div className="mt-2 text-xs">
                                                                                    <div className="text-muted-foreground">
                                                                                        {venta.detalles.length} producto{venta.detalles.length !== 1 ? 's' : ''}:
                                                                                    </div>
                                                                                    {venta.detalles.map((detalle) => (
                                                                                        <div key={detalle.id} className="ml-2">
                                                                                            • {detalle.producto?.nombre || 'Producto'} x{detalle.cantidad}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
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
                                        Página {entregas.current_page} de {entregas.last_page}
                                        ({entregas.total} total)
                                    </div>
                                    <div className="flex gap-2">
                                        {entregas.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePaginaAnterior(entregas.current_page)}
                                            >
                                                Anterior
                                            </Button>
                                        )}
                                        {entregas.current_page < entregas.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePaginaSiguiente(entregas.current_page)}
                                            >
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
        </div>
    );
}
