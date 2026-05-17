/**
 * Component: MovimientosDelDiaTable
 *
 * Responsabilidades:
 * ✅ Renderizar tabla de movimientos de caja del día
 * ✅ Mostrar columnas: Hora, Tipo, Descripción, Documento, Monto
 * ✅ Indicadores visuales de ingresos/egresos
 * ✅ Agrupar movimientos por tipo
 * ✅ Resumen de totales por tipo
 */

import { useState } from 'react';
import type { AperturaCaja, MovimientoCaja } from '@/domain/entities/cajas';
import { formatCurrency, formatDateTime, getMovimientoIcon, getMovimientoColor, toNumber } from '@/lib/cajas.utils';
import { ComprobantesMovimiento } from '@/presentation/components/ComprobantesMovimiento';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { Loader2, Trash2, Eye } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';

interface Props {
    cajaAbiertaHoy: AperturaCaja | null;
    movimientosHoy: MovimientoCaja[];
    efectivoEsperado?: {
        apertura: number
        ventas_efectivo: number
        pagos_credito: number
        gastos: number
        pagos_sueldo?: number  // ✅ NUEVO
        anticipos?: number  // ✅ NUEVO
        anulaciones?: number  // ✅ NUEVO
        total_egresos?: number  // ✅ NUEVO: Total de todos los egresos
        total: number
    };
    ventasPorTipoPago?: Array<{ tipo: string; total: number; count: number }>;   // ✅ Viene del backend
    ventasPorEstado?: Array<{ estado: string; total: number; count: number }>;    // ✅ Viene del backend
    pagosPorTipoPago?: Array<{ tipo: string; total: number; count: number }>;     // ✅ Viene del backend
    gastosPorTipoPago?: Array<{ tipo: string; total: number; count: number }>;    // ✅ Viene del backend
    ventasTotales?: number;  // ✅ NUEVO: Total de ventas de CierreCajaService
    ventasAnuladas?: number;  // ✅ NUEVO: Ventas anuladas de CierreCajaService
    ventasCredito?: number;  // ✅ NUEVO: Ventas a crédito de CierreCajaService
    sumatorialCompras?: number;  // ✅ NUEVO: Sumatoria de compras de CierreCajaService
    sumatorialDevoluciones?: number;  // ✅ NUEVO (2026-03-09): Sumatoria de devoluciones
    sumatorialServicio?: number;  // ✅ NUEVO (2026-03-09): Sumatoria de servicios
    detallesPagoDesglosado?: Array<{ tipo_pago_id: number; tipo: string; total: number; cantidad: number }>;  // ✅ NUEVO: Desglose de pagos desde detalles_pago_venta
    totalDetallesPago?: number;  // ✅ NUEVO: Dinero real pagado por ventas (desde detalles_pago_venta)
    cargandoDatos?: boolean;  // ✅ NUEVO: Indicador si se están cargando datos del servidor
}

// ✅ NUEVO: Función para detectar discrepancias en ventas
const tieneDiscrepancia = (movimiento: MovimientoCaja): boolean => {
    if (!movimiento.venta) return false;

    const montoMovimiento = Number(movimiento.monto);
    const totalVenta = Number(movimiento.venta.total ?? 0);
    const montoPagado = Number(movimiento.venta.monto_pagado ?? 0);

    // Discrepancia 1: El monto del movimiento no coincide con el total de la venta
    if (Math.abs(montoMovimiento - totalVenta) > 0.01) {
        return true;
    }

    // Discrepancia 2: El monto del movimiento no coincide con el monto pagado
    if (Math.abs(montoMovimiento - montoPagado) > 0.01) {
        return true;
    }

    return false;
};

// ✅ NUEVO: Función para obtener colores según el tipo de operación
const getTipoOperacionColor = (codigo: string): string => {
    switch (codigo.toUpperCase()) {
        case 'VENTA':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'PAGO':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'GASTOS':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'APERTURA':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'CIERRE':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        case 'AJUSTE':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'COMPRA':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'ANULACION':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        case 'CREDITO':
            return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
        case 'DEVOLUCION':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
        case 'SERVICIO':
            return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
};

export function MovimientosDelDiaTable({ cajaAbiertaHoy, movimientosHoy, efectivoEsperado, ventasPorTipoPago = [], ventasPorEstado = [], pagosPorTipoPago = [], gastosPorTipoPago = [], ventasTotales = 0, ventasAnuladas = 0, ventasCredito = 0, sumatorialCompras = 0, sumatorialDevoluciones = 0, sumatorialServicio = 0, detallesPagoDesglosado = [], totalDetallesPago = 0, cargandoDatos = false }: Props) {
    console.log('MovimientosDelDiaTable - Props recibidos:', { cajaAbiertaHoy, movimientosHoy, efectivoEsperado, ventasPorTipoPago, ventasPorEstado, pagosPorTipoPago, gastosPorTipoPago, ventasTotales, ventasAnuladas, ventasCredito, cargandoDatos });
    const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
    const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>('');
    const [filtroSigno, setFiltroSigno] = useState<'todos' | 'ingresos' | 'egresos'>('todos');
    const [busquedaDescripcion, setBusquedaDescripcion] = useState<string>('');
    const [montoMin, setMontoMin] = useState<string>('');
    const [montoMax, setMontoMax] = useState<string>('');
    const [filtroUsuario, setFiltroUsuario] = useState<string>('');
    const [filtroDocumento, setFiltroDocumento] = useState<string>('');
    const [filtroEstadoVenta, setFiltroEstadoVenta] = useState<'todos' | 'APROBADO' | 'ANULADO'>('todos'); // ✅ NUEVO: Filtro estado venta
    const [ordenarPor, setOrdenarPor] = useState<'fecha' | 'monto' | 'tipo'>('fecha');
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [mostrarModalMovimientoIndividual, setMostrarModalMovimientoIndividual] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<MovimientoCaja | null>(null);
    const [mostrarDialogoEliminacion, setMostrarDialogoEliminacion] = useState(false);
    const [movimientoAEliminar, setMovimientoAEliminar] = useState<MovimientoCaja | null>(null);
    const [eliminandoMovimiento, setEliminandoMovimiento] = useState(false);
    const [mostrarModalVenta, setMostrarModalVenta] = useState(false);
    const [movimientoVentaSeleccionado, setMovimientoVentaSeleccionado] = useState<MovimientoCaja | null>(null);


    if (!cajaAbiertaHoy || movimientosHoy.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-5xl mb-4 opacity-50">📋</div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Aún no hay movimientos
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {!cajaAbiertaHoy
                                ? 'Abra una caja para registrar movimientos'
                                : 'Los movimientos aparecerán aquí cuando se registren'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ NUEVO: Determinar si la caja es de hoy o de otro día
    const fechaApertura = new Date(cajaAbiertaHoy.fecha);
    const hoy = new Date();
    const esHoy = fechaApertura.toDateString() === hoy.toDateString();
    const etiquetaPeriodo = esHoy ? 'del Día' : `desde ${fechaApertura.toLocaleDateString('es-BO', { month: 'short', day: 'numeric' })}`;

    // ✅ MEJORADO: Agrupar movimientos por tipo, EXCLUYENDO ventas anuladas del tipo VENTA
    const movimientosAgrupados = movimientosHoy.reduce((acc: Record<string, MovimientoCaja[]>, mov) => {
        const tipo = mov.tipo_operacion.nombre;

        // 🔴 IMPORTANTE: Si es VENTA, solo contar si está APROBADA (excluir ANULADAS)
        if (tipo === 'Venta' || tipo === 'VENTA') {
            if (mov.venta?.estado_documento?.codigo !== 'APROBADO') {
                return acc; // Saltar ventas no aprobadas
            }
        }

        if (!acc[tipo]) {
            acc[tipo] = [];
        }
        acc[tipo].push(mov);
        return acc;
    }, {});

    // ✅ NUEVO: Obtener tipos únicos y calcular totales
    const tipos = Object.keys(movimientosAgrupados);
    const totalesPorTipo = Object.entries(movimientosAgrupados).map(([tipo, movs]) => {
        // ✅ ACTUALIZADO (2026-04-29): Para VENTA, usar totalDetallesPago (dinero real pagado desde detalles_pago_venta)
        // Para otros tipos, sumar los montos localmente PERO solo si están APROBADOS
        if (tipo === 'Venta' || tipo === 'VENTA') {
            return {
                tipo,
                total: totalDetallesPago || 0, // Usar dinero real pagado (desde detalles_pago_venta)
                count: movs.length,
            };
        }

        // ✅ CORREGIDO (2026-04-30): Filtrar solo movimientos APROBADOS antes de sumar
        const movsAprobados = movs.filter(m => {
            // Para movimientos con venta asociada, verificar que esté aprobada
            if (m.venta?.estado_documento) {
                return m.venta.estado_documento.codigo === 'APROBADO';
            }
            // Para otros movimientos sin venta (gastos, etc.), incluirlos
            return true;
        });

        return {
            tipo,
            total: movsAprobados.reduce((sum, m) => sum + m.monto, 0),
            count: movsAprobados.length,
        };
    });

    // ✅ CORREGIDO (2026-04-30): Si hay totalDetallesPago pero NO hay movimiento VENTA en movimientosHoy,
    // agregar un card de VENTA manual (puede ocurrir si los movimientos aún no se crean en backend)
    const tieneVentaEnTotales = totalesPorTipo.some(t => t.tipo === 'Venta' || t.tipo === 'VENTA');
    if (totalDetallesPago > 0 && !tieneVentaEnTotales) {
        totalesPorTipo.unshift({
            tipo: 'Venta',
            total: totalDetallesPago,
            count: detallesPagoDesglosado.length,
        });

        console.log('💡 [MovimientosDelDiaTable] Agregando card de VENTA manual porque totalDetallesPago > 0', {
            totalDetallesPago,
            detallesCount: detallesPagoDesglosado.length,
        });
    }

    // ✅ CORREGIDO (2026-04-30): Si hay ventasAnuladas pero el card de ANULACION tiene total=0,
    // reemplazarlo con el valor correcto desde props (ventasAnuladas viene del backend calculado correctamente)
    const anulacionIndex = totalesPorTipo.findIndex(t => t.tipo === 'Anulación' || t.tipo === 'ANULACION');
    if (ventasAnuladas > 0) {
        if (anulacionIndex >= 0) {
            // Reemplazar si existe
            totalesPorTipo[anulacionIndex] = {
                tipo: 'Anulación',
                total: -ventasAnuladas, // Negativo porque es salida
                count: totalesPorTipo[anulacionIndex].count,
            };
        } else {
            // Agregar si no existe
            totalesPorTipo.push({
                tipo: 'Anulación',
                total: -ventasAnuladas, // Negativo porque es salida
                count: 0,
            });
        }

        console.log('💡 [MovimientosDelDiaTable] Agregando/Actualizando card de ANULACION desde props', {
            ventasAnuladas,
        });
    }

    // ✅ NUEVO: Agrupar movimientos por tipo de pago y calcular totales
    const movimientosAgrupadosPorTipoPago = movimientosHoy.reduce((acc: Record<string, any[]>, mov: any) => {
        const tipoPagoNombre = mov.tipo_pago?.nombre || 'Sin tipo de pago';
        if (!acc[tipoPagoNombre]) {
            acc[tipoPagoNombre] = [];
        }
        acc[tipoPagoNombre].push(mov);
        return acc;
    }, {});

    const totalesPorTipoPago = Object.entries(movimientosAgrupadosPorTipoPago).map(([tipoPago, movs]: [string, any]) => ({
        tipoPago,
        total: movs.reduce((sum, m) => sum + m.monto, 0),
        count: movs.length,
    }));

    // ✅ MEJORADO: ventasPorTipoPago ahora viene del backend (MovimientoCajaService)
    // No calcular localmente, simplemente usar lo que viene en props

    // ✅ NUEVO: Calcular rango de IDs de venta (venta_id)
    const calcularRangoVentas = () => {
        if (movimientosHoy.length === 0) return null;

        // Extraer IDs de venta válidos
        const ventaIds = movimientosHoy
            .map((mov) => mov.venta_id)
            .filter((id): id is number => id !== null && id !== undefined && id > 0);

        if (ventaIds.length === 0) return null;

        const minId = Math.min(...ventaIds);
        const maxId = Math.max(...ventaIds);
        const totalVentas = ventaIds.length;

        return { minId, maxId, totalVentas };
    };

    const rangoVentas = calcularRangoVentas();

    // ✅ Obtener usuarios únicos
    const usuariosUnicos = Array.from(new Set(movimientosHoy.map(mov => mov.usuario?.name || 'Sin Usuario')))
        .filter(u => u !== 'Sin Usuario')
        .sort();

    // ✅ NUEVO: Filtrar movimientos por múltiples criterios
    let movimientosAMostrar = movimientosHoy.filter((mov) => {
        // 1️⃣ Filtro por tipo
        if (filtroTipo && mov.tipo_operacion.nombre !== filtroTipo) {
            return false;
        }

        // 2️⃣ Filtro por rango de fechas
        if (filtroFechaDesde || filtroFechaHasta) {
            const fechaMov = new Date(mov.fecha).toISOString().split('T')[0];
            const desde = filtroFechaDesde ? filtroFechaDesde : '1900-01-01';
            const hasta = filtroFechaHasta ? filtroFechaHasta : '2100-12-31';
            if (!(fechaMov >= desde && fechaMov <= hasta)) {
                return false;
            }
        }

        // 3️⃣ Filtro por signo (ingreso/egreso)
        const monto = toNumber(mov.monto);
        if (filtroSigno === 'ingresos' && monto < 0) {
            return false;
        }
        if (filtroSigno === 'egresos' && monto > 0) {
            return false;
        }

        // 4️⃣ Filtro por descripción (búsqueda)
        if (busquedaDescripcion) {
            const busqueda = busquedaDescripcion.toLowerCase();
            const coincide =
                mov.observaciones?.toLowerCase().includes(busqueda) ||
                mov.numero_documento?.toLowerCase().includes(busqueda) ||
                mov.tipo_operacion.nombre.toLowerCase().includes(busqueda);
            if (!coincide) {
                return false;
            }
        }

        // 5️⃣ Filtro por rango de monto
        if (montoMin || montoMax) {
            const montoAbsoluto = Math.abs(monto);
            const min = montoMin ? parseFloat(montoMin) : 0;
            const max = montoMax ? parseFloat(montoMax) : Infinity;
            if (!(montoAbsoluto >= min && montoAbsoluto <= max)) {
                return false;
            }
        }

        // 6️⃣ Filtro por usuario
        if (filtroUsuario) {
            const nombreUsuario = mov.usuario?.name || 'Sin Usuario';
            if (nombreUsuario !== filtroUsuario) {
                return false;
            }
        }

        // 7️⃣ Filtro por documento
        if (filtroDocumento) {
            const busqueda = filtroDocumento.toLowerCase();
            if (!mov.numero_documento?.toLowerCase().includes(busqueda)) {
                return false;
            }
        }

        // 8️⃣ Filtro por estado de venta (APROBADO/ANULADO) - ✅ NUEVO
        if (filtroEstadoVenta !== 'todos' && mov.venta?.estado_documento) {
            if (mov.venta.estado_documento.codigo !== filtroEstadoVenta) {
                return false;
            }
        }

        return true;
    });

    // ✅ Aplicar ordenamiento
    movimientosAMostrar = [...movimientosAMostrar].sort((a, b) => {
        switch (ordenarPor) {
            case 'fecha':
                // ✅ CORREGIDO: Ordenar por fecha DESCENDENTE (más nuevos primero)
                return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
            case 'monto':
                return Math.abs(toNumber(b.monto)) - Math.abs(toNumber(a.monto));
            case 'tipo':
                return a.tipo_operacion.nombre.localeCompare(b.tipo_operacion.nombre);
            default:
                return 0;
        }
    });

    // ✅ Función para exportar movimientos a CSV
    const exportarACSV = () => {
        const headers = ['Fecha/Hora', 'Tipo', 'Descripción', 'Documento', 'Monto', 'Usuario'];
        const rows = movimientosAMostrar.map(mov => [
            new Date(mov.fecha).toLocaleString('es-BO'),
            mov.tipo_operacion.nombre,
            mov.observaciones || '',
            mov.numero_documento || '',
            mov.monto,
            mov.usuario?.name || 'Sin Usuario',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `movimientos-caja-${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    // ✅ NUEVO: Función para eliminar movimiento
    const handleEliminarMovimiento = async () => {
        if (!movimientoAEliminar) return;

        setEliminandoMovimiento(true);
        try {
            const response = await fetch(
                `/cajas/movimiento/${movimientoAEliminar.id}/eliminar`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                console.error('❌ Error al eliminar movimiento:', data);
                alert(`Error: ${data.message || 'No se pudo eliminar el movimiento'}`);
                return;
            }

            const data = await response.json();
            console.log('✅ Movimiento eliminado:', data);

            // Mostrar notificación de éxito
            alert('✅ Movimiento eliminado exitosamente');

            // Recargar la página
            window.location.reload();
        } catch (error) {
            console.error('❌ Error en solicitud de eliminación:', error);
            alert('Error al eliminar el movimiento');
        } finally {
            setEliminandoMovimiento(false);
            setMostrarDialogoEliminacion(false);
            setMovimientoAEliminar(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Movimientos {etiquetaPeriodo}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            📋 Mostrando <strong className="text-gray-900 dark:text-white">{movimientosAMostrar.length}</strong> de <strong className="text-gray-900 dark:text-white">{movimientosHoy.length}</strong> movimientos
                        </p>
                    </div>
                    <br />
                    {/* ✅ NUEVO: Rango de IDs de Venta */}
                    <div className="display-block text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Rango de Ventas (ID)
                        </p>
                        {rangoVentas ? (
                            <>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {rangoVentas.minId} - {rangoVentas.maxId}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {rangoVentas.totalVentas} venta{rangoVentas.totalVentas !== 1 ? 's' : ''}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-bold text-gray-400 dark:text-gray-500">
                                    —
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Sin ventas
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* ✅ NUEVO: Filtros por tipo */}
                <div className="mb-6 flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={() => setFiltroTipo(null)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${!filtroTipo
                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Todos ({movimientosHoy.length})
                    </button>
                    {tipos.map((tipo) => {
                        // const total = totalesPorTipo.find(t => t.tipo === tipo)?.total || 0;
                        return (
                            <button
                                key={tipo}
                                onClick={() => {
                                    setFiltroTipo(tipo);
                                    // ✅ DEBUG: Mostrar en consola qué datos llegaron para este tipo
                                    console.log(`\n📋 [MovimientosDelDiaTable] Datos del tipo: ${tipo}`, {
                                        tipo,
                                        cantidad: movimientosAgrupados[tipo].length,
                                        movimientos: movimientosAgrupados[tipo],
                                        detalles: movimientosAgrupados[tipo].map(m => ({
                                            id: m.id,
                                            numero_documento: m.numero_documento,
                                            monto: m.monto,
                                            venta_id: m.venta_id,
                                            venta_numero: m.venta?.numero,
                                            venta_estado: m.venta?.estado_documento?.codigo,
                                            fecha: m.fecha,
                                        })),
                                    });
                                }}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition ${filtroTipo === tipo
                                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {tipo} ({movimientosAgrupados[tipo].length})
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                        className="ml-auto px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        {filtrosVisibles ? '🔼 Ocultar Filtros' : '🔽 Mostrar Filtros'}
                    </button>
                </div>

                {/* ✅ NUEVO: Filtros Avanzados */}
                {filtrosVisibles && (
                    <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">

                        {/* Filtro por Rango de Fechas */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Rango de Fechas
                            </p>
                            <div className="flex gap-2 flex-wrap items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400">Desde:</label>
                                    <input
                                        type="datetime-local"
                                        value={filtroFechaDesde}
                                        onChange={(e) => setFiltroFechaDesde(e.target.value ? e.target.value.split('T')[0] : '')}
                                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400">Hasta:</label>
                                    <input
                                        type="datetime-local"
                                        value={filtroFechaHasta}
                                        onChange={(e) => setFiltroFechaHasta(e.target.value ? e.target.value.split('T')[0] : '')}
                                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
                                    />
                                </div>
                                {(filtroFechaDesde || filtroFechaHasta) && (
                                    <button
                                        onClick={() => {
                                            setFiltroFechaDesde('');
                                            setFiltroFechaHasta('');
                                        }}
                                        className="px-2 py-1 rounded text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filtro por Rango de Monto */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Rango de Monto
                            </p>
                            <div className="flex gap-2 flex-wrap items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400">Min:</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={montoMin}
                                        onChange={(e) => setMontoMin(e.target.value)}
                                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm w-24"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400">Max:</label>
                                    <input
                                        type="number"
                                        placeholder="∞"
                                        value={montoMax}
                                        onChange={(e) => setMontoMax(e.target.value)}
                                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm w-24"
                                    />
                                </div>
                                {(montoMin || montoMax) && (
                                    <button
                                        onClick={() => {
                                            setMontoMin('');
                                            setMontoMax('');
                                        }}
                                        className="px-2 py-1 rounded text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filtro por Documento */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Buscar por Folio
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Número de folio..."
                                    value={filtroDocumento}
                                    onChange={(e) => setFiltroDocumento(e.target.value)}
                                    className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
                                />
                                {filtroDocumento && (
                                    <button
                                        onClick={() => setFiltroDocumento('')}
                                        className="px-2 py-1 rounded text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filtro por Estado de Venta (APROBADO/ANULADO) - ✅ NUEVO */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Estado de Venta
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setFiltroEstadoVenta('todos')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition ${filtroEstadoVenta === 'todos'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => setFiltroEstadoVenta('APROBADO')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition ${filtroEstadoVenta === 'APROBADO'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    ✅ Aprobadas
                                </button>
                                <button
                                    onClick={() => setFiltroEstadoVenta('ANULADO')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition ${filtroEstadoVenta === 'ANULADO'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    ❌ Anuladas
                                </button>
                            </div>
                        </div>

                        {/* Ordenamiento */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Ordenar por
                            </p>
                            <div className="flex gap-2">
                                <select
                                    value={ordenarPor}
                                    onChange={(e) => setOrdenarPor(e.target.value as 'fecha' | 'monto' | 'tipo')}
                                    className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"
                                >
                                    <option value="fecha">📅 Por Fecha (más reciente)</option>
                                    <option value="monto">💰 Por Monto (mayor primero)</option>
                                    <option value="tipo">📋 Por Tipo de Operación</option>
                                </select>
                            </div>
                        </div>

                        {/* Botones Exportar e Imprimir */}
                        <div className="space-y-2">
                            <button
                                onClick={exportarACSV}
                                className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-medium transition"
                            >
                                📥 Exportar a CSV
                            </button>
                            {cajaAbiertaHoy && (
                                <button
                                    onClick={() => setMostrarModalImpresion(true)}
                                    className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                                >
                                    🖨️ Imprimir Movimientos
                                </button>
                            )}
                        </div>

                        {/* Resumen de Filtros Activos */}
                        {(filtroFechaDesde || filtroFechaHasta || filtroSigno !== 'todos' || busquedaDescripcion || montoMin || montoMax || filtroUsuario || filtroDocumento || filtroEstadoVenta !== 'todos') && (
                            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        ✅ <strong className="text-gray-900 dark:text-white">{movimientosAMostrar.length}</strong> resultado{movimientosAMostrar.length !== 1 ? 's' : ''} de <strong className="text-gray-900 dark:text-white">{movimientosHoy.length}</strong> movimientos
                                    </div>
                                    {movimientosAMostrar.length === 0 && (
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            ⚠️ Sin resultados
                                        </div>
                                    )}
                                </div>
                                {movimientosAMostrar.length > 0 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {movimientosAMostrar.length === movimientosHoy.length ? 'Mostrando todos los movimientos' : `Filtrado: ${((movimientosAMostrar.length / movimientosHoy.length) * 100).toFixed(0)}% de los movimientos`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ✅ NUEVO: Resumen por tipo de operación */}
                {totalesPorTipo.length >= 1 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            📊 Sumatoria por Tipo de Operación
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {totalesPorTipo.map(({ tipo, total, count }) => {
                                // Obtener el código del tipo operación para usar los colores
                                const tipoOperacionMatch = movimientosHoy.find(m => m.tipo_operacion.nombre === tipo);
                                const codigo = tipoOperacionMatch?.tipo_operacion.codigo || tipo.toUpperCase();
                                const esIngreso = total > 0;

                                console.log('Movimientos del día - Resumen por tipo:', { tipo, total, count, codigo, esIngreso });

                                // ✅ ACTUALIZADO (2026-04-30): Para VENTA, mostrar desglose de tipos de pago
                                const esVenta = tipo === 'Venta' || tipo === 'VENTA';
                                const mostrarDesglose = esVenta && detallesPagoDesglosado && detallesPagoDesglosado.length > 0;

                                return (
                                    <div
                                        key={tipo}
                                        className={`rounded-lg p-4 cursor-pointer transition hover:shadow-md border-l-4 ${getTipoOperacionColor(codigo).includes('bg-green')
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-400'
                                                : getTipoOperacionColor(codigo).includes('bg-red')
                                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-400'
                                                    : getTipoOperacionColor(codigo).includes('bg-blue')
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                                                        : getTipoOperacionColor(codigo).includes('bg-yellow')
                                                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                                                            : getTipoOperacionColor(codigo).includes('bg-orange')
                                                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400'
                                                                : getTipoOperacionColor(codigo).includes('bg-purple')
                                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400'
                                                                    : getTipoOperacionColor(codigo).includes('bg-indigo')
                                                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400'
                                                                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-400'
                                            }`}
                                        onClick={() => setFiltroTipo(filtroTipo === tipo ? null : tipo)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    {tipo}
                                                </p>
                                                <p className={`text-lg font-bold mt-2 ${getMovimientoColor(total)}`}>
                                                    {formatCurrency(Math.abs(total))}
                                                </p>

                                                {/* ✅ NUEVO (2026-04-30): Mostrar desglose de tipos de pago para VENTA */}
                                                {mostrarDesglose && (
                                                    <div className="mt-2 space-y-1 border-t border-gray-300 dark:border-gray-600 pt-2">
                                                        {/* ✅ ACTUALIZADO (2026-05-03): SOLO mostrar EFECTIVO + TRANSFERENCIA (CRÉDITO tiene su propio card) */}
                                                        {detallesPagoDesglosado
                                                            .filter((detalle) =>
                                                                detalle.codigo === 'EFECTIVO' || detalle.codigo === 'TRANSFERENCIA/QR'
                                                            )
                                                            .map((detalle, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                                <span className="text-gray-600 dark:text-gray-400">{detalle.tipo}</span>
                                                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                                    {formatCurrency(detalle.total)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    <span className="inline-block bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                        {/* ✅ ACTUALIZADO (2026-05-03): Si es VENTA, mostrar solo pagos de efectivo+transferencia */}
                                                        {mostrarDesglose
                                                            ? `${detallesPagoDesglosado.filter(d => d.codigo === 'EFECTIVO' || d.codigo === 'TRANSFERENCIA/QR').length} pagos`
                                                            : `${count} mov.`
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={`text-2xl ${esIngreso ? '📈' : '📉'}`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Informacion
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Descripcion
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tipo Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tipo Entrega
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Comprobantes
                                </th> */}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Monto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {movimientosAMostrar.map((movimiento) => (
                                <tr key={movimiento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {formatDateTime(movimiento.fecha)}
                                        <br />
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoOperacionColor(movimiento.tipo_operacion.codigo)}`}>
                                            {movimiento.tipo_operacion.nombre}
                                        </span>
                                        <br />
                                        {movimiento.numero_documento}
                                        {(movimiento.venta_id || movimiento.pago_id) && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {movimiento.venta_id && (
                                                    <span className="inline-block mr-2">
                                                        ID Venta: <span className="font-semibold text-gray-700 dark:text-gray-300">#{movimiento.venta_id}</span>
                                                    </span>
                                                )}
                                                {movimiento.pago_id && (
                                                    <span className="inline-block">
                                                        ID Pago: <span className="font-semibold text-gray-700 dark:text-gray-300">#{movimiento.pago_id}</span>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {movimiento.observaciones}
                                    </td>
                                    {/* ✅ NUEVA: Estado de la Venta */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {movimiento.venta?.estado_documento ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movimiento.venta.estado_documento.codigo === 'APROBADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : movimiento.venta.estado_documento.codigo === 'ANULADO'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        : movimiento.venta.estado_documento.codigo === 'PENDIENTE'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                {movimiento.venta.estado_documento.nombre}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">—</span>
                                        )}
                                    </td>
                                    {/* ✅ NUEVA: Tipo de Pago */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {movimiento.tipo_pago?.nombre ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movimiento.tipo_pago.nombre === 'EFECTIVO'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                                    : movimiento.tipo_pago.nombre === 'TRANSFERENCIA'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                        : movimiento.tipo_pago.nombre === 'CHEQUE'
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                            : movimiento.tipo_pago.nombre === 'CREDITO'
                                                                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
                                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                {movimiento.tipo_pago.nombre}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">—</span>
                                        )}
                                    </td>
                                    {/* ✅ NUEVA: Tipo de Entrega */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {movimiento.venta?.tipo_entrega ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movimiento.venta.tipo_entrega === 'DELIVERY'
                                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                                                    : movimiento.venta.tipo_entrega === 'PICKUP'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                {movimiento.venta.tipo_entrega === 'DELIVERY' ? '🚚 Envío' : movimiento.venta.tipo_entrega === 'PICKUP' ? '🏪 Retiro' : movimiento.venta.tipo_entrega}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">—</span>
                                        )}
                                    </td>
                                    {/*  <td className="px-6 py-4 text-sm">
                                        <ComprobantesMovimiento comprobantes={movimiento.comprobantes} />
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* ✅ NUEVO: Botón Ver Detalles de Venta */}
                                            {movimiento.venta && (
                                                <button
                                                    onClick={() => {
                                                        setMovimientoVentaSeleccionado(movimiento);
                                                        setMostrarModalVenta(true);
                                                    }}
                                                    className={`inline-flex items-center justify-center p-1.5 rounded-lg transition ${
                                                        tieneDiscrepancia(movimiento)
                                                            ? 'bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400'
                                                            : 'bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                                                    }`}
                                                    title={tieneDiscrepancia(movimiento) ? '⚠️ Discrepancia detectada - Ver detalles' : 'Ver detalles de venta'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Botón Imprimir Movimiento Individual */}
                                            <button
                                                onClick={() => {
                                                    setMovimientoSeleccionado(movimiento);
                                                    setMostrarModalMovimientoIndividual(true);
                                                }}
                                                className="inline-flex items-center justify-center p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition"
                                                title="Imprimir este movimiento"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4V9m0 0V5a2 2 0 012-2h.5a2 2 0 011.961 1.561l2.286 9.144a2 2 0 01-1.961 2.561H7.5a2 2 0 01-1.961-2.561l2.286-9.144A2 2 0 019.5 5H10a2 2 0 012 2v4m0 0h4" />
                                                </svg>
                                            </button>

                                            {/* ✅ NUEVO: Botón Eliminar (solo para GASTOS, PAGO_SUELDO, ANTICIPO) */}
                                            {['GASTOS', 'PAGO_SUELDO', 'ANTICIPO'].includes(movimiento.tipo_operacion.codigo) && (
                                                <button
                                                    onClick={() => {
                                                        setMovimientoAEliminar(movimiento);
                                                        setMostrarDialogoEliminacion(true);
                                                    }}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition"
                                                    title="Eliminar este movimiento"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Monto */}
                                            <div className="flex items-center">
                                                {getMovimientoIcon(toNumber(movimiento.monto))}
                                                <span className={`ml-2 text-sm font-medium ${getMovimientoColor(toNumber(movimiento.monto))}`}>
                                                    {formatCurrency(Math.abs(toNumber(movimiento.monto)))}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ NUEVO: Modal de Impresión (Todos los movimientos) */}
                {cajaAbiertaHoy && (
                    <OutputSelectionModal
                        isOpen={mostrarModalImpresion}
                        onClose={() => setMostrarModalImpresion(false)}
                        documentoId={cajaAbiertaHoy.id}
                        tipoDocumento="caja"
                        printType="movimientos"
                        documentoInfo={{
                            numero: `Apertura #${cajaAbiertaHoy.id}`,
                            fecha: new Date(cajaAbiertaHoy.fecha).toLocaleDateString('es-ES'),
                            monto: cajaAbiertaHoy.monto_apertura,
                        }}
                    />
                )}

                {/* ✅ NUEVO: Modal de Impresión (Movimiento Individual) */}
                {movimientoSeleccionado && (
                    <OutputSelectionModal
                        isOpen={mostrarModalMovimientoIndividual}
                        onClose={() => {
                            setMostrarModalMovimientoIndividual(false);
                            setMovimientoSeleccionado(null);
                        }}
                        documentoId={movimientoSeleccionado.id}
                        tipoDocumento="movimiento"
                        documentoInfo={{
                            numero: `Movimiento #${movimientoSeleccionado.id}`,
                            fecha: new Date(movimientoSeleccionado.fecha).toLocaleDateString('es-ES'),
                            monto: movimientoSeleccionado.monto,
                        }}
                    />
                )}

                {/* ✅ NUEVO: Diálogo de Confirmación para Eliminar */}
                <AlertDialog open={mostrarDialogoEliminacion} onOpenChange={setMostrarDialogoEliminacion}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Eliminar movimiento?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Se eliminará el movimiento de <strong>{movimientoAEliminar?.tipo_operacion.nombre}</strong>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* ✅ Detalles del movimiento */}
                        <div className="space-y-3 py-4 border-y border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto:</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(Math.abs(toNumber(movimientoAEliminar?.monto || 0)))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha:</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {movimientoAEliminar && formatDateTime(movimientoAEliminar.fecha)}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Observación:</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">
                                    {movimientoAEliminar?.observaciones || 'Sin observaciones'}
                                </span>
                            </div>
                        </div>

                        {/* ✅ Advertencia */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
                            </p>
                        </div>

                        {/* ✅ Botones */}
                        <div className="flex gap-3 justify-end">
                            <AlertDialogCancel disabled={eliminandoMovimiento}>
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleEliminarMovimiento}
                                disabled={eliminandoMovimiento}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {eliminandoMovimiento ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </>
                                )}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* ✅ NUEVO: Modal de Detalles de Venta */}
                <Dialog open={mostrarModalVenta} onOpenChange={setMostrarModalVenta}>
                    <DialogContent className="max-w-2xl dark:bg-slate-800 dark:border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="dark:text-white">Detalles de Venta</DialogTitle>
                        </DialogHeader>

                        {movimientoVentaSeleccionado?.venta && (
                            <div className="space-y-6 py-4">
                                {/* IDs y Monto */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">ID Venta</p>
                                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-1">
                                            #{movimientoVentaSeleccionado.venta.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">ID Movimiento</p>
                                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-1">
                                            #{movimientoVentaSeleccionado.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Monto Movimiento</p>
                                        <p className={`text-lg font-bold mt-1 ${movimientoVentaSeleccionado.monto > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {movimientoVentaSeleccionado.monto > 0 ? '+' : ''}Bs. {Number(movimientoVentaSeleccionado.monto).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Información General */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Número de Venta</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                            {movimientoVentaSeleccionado.venta.numero_documento || movimientoVentaSeleccionado.venta.numero}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</p>
                                        <p className="mt-1">
                                            {movimientoVentaSeleccionado.venta.estado_documento ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movimientoVentaSeleccionado.venta.estado_documento.codigo === 'APROBADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : movimientoVentaSeleccionado.venta.estado_documento.codigo === 'ANULADO'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                    {movimientoVentaSeleccionado.venta.estado_documento.nombre}
                                                </span>
                                            ) : '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Montos */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                                            Bs. {Number(movimientoVentaSeleccionado.venta.total ?? 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Pagado</p>
                                        <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-2">
                                            Bs. {Number(movimientoVentaSeleccionado.venta.monto_pagado ?? 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Pendiente</p>
                                        <p className={`text-xl font-bold mt-2 ${Number(movimientoVentaSeleccionado.venta.monto_pendiente ?? 0) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                                            Bs. {Number(movimientoVentaSeleccionado.venta.monto_pendiente ?? 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalles de Pago */}
                                {movimientoVentaSeleccionado.venta.detallesPagoVenta && movimientoVentaSeleccionado.venta.detallesPagoVenta.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Desglose de Pagos</h3>
                                        <div className="space-y-2">
                                            {movimientoVentaSeleccionado.venta.detallesPagoVenta.map((detalle, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/50 rounded">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {detalle.tipoPago?.nombre || 'Sin tipo'}
                                                    </span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        Bs. {Number(detalle.monto).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Cliente */}
                                {movimientoVentaSeleccionado.venta.cliente && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cliente</p>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {movimientoVentaSeleccionado.venta.cliente.nombre}
                                        </p>
                                    </div>
                                )}

                                {/* Acciones */}
                                <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
                                    <button
                                        onClick={() => setMostrarModalVenta(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
