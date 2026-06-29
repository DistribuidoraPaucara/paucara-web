/**
 * Page: Cajas/ReportesDiariosDetalle
 *
 * Página de detalle completo de un cierre de caja
 * Muestra todos los movimientos entre apertura y cierre con filtros interactivos
 */

import AppLayout from '@/layouts/app-layout';
import { OutputSelectionModal, type TipoDocumento } from '@/presentation/components/impresion/OutputSelectionModal';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Eye, Printer, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface TipoOperacion {
    id: number;
    codigo: string;
    nombre: string;
    direccion?: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
}

interface TipoPago {
    id: number;
    nombre: string;
}

interface Movimiento {
    id: number;
    fecha: string;
    usuario: {
        id: number;
        name: string;
    };
    tipo_operacion: {
        codigo: string;
        nombre: string;
    };
    numero_documento: string;
    monto: number;
    observaciones?: string;
    venta_id?: number;
    pago_id?: number;
    tipo_pago_id?: number;
    tipo_pago?: TipoPago;
    venta?: {
        id: number;
        numero_documento: string;
        total?: number;
        monto_pagado?: number;
        monto_pendiente?: number;
        tipo_pago_id?: number;
        estado_documento?: {
            id: number;
            codigo: string;
            nombre: string;
        };
        cliente?: {
            id: number;
            nombre: string;
        };
        detallesPagoVenta?: Array<{
            id: number;
            monto: number;
            tipo_pago_id: number;
            tipoPago?: TipoPago;
        }>;
    };
}

interface TotalPorTipo {
    codigo: string;
    nombre: string;
    cantidad: number;
    total: number;
}

interface Cierre {
    id: number;
    usuario_id: number;
    usuario: {
        id: number;
        name: string;
    };
    caja: {
        id: number;
        nombre: string;
    };
    fecha_apertura: string;
    fecha_cierre: string;
    monto_apertura: number;
    monto_esperado: number;
    monto_real: number;
    diferencia: number;
}

interface DatosResumen {
    totalVentas: number;
    ventasAnuladas: number;
    pagosCredito: number;
    totalIngresos: number;
    totalEgresos: number;
    sumatorialGastos: number;
    sumatorialPagosSueldo: number;
    sumatorialAnticipos: number;
    sumatorialCompras: number;
    sumatorialServicio: number;
    sumatorialDevoluciones: number;
    detallesPagosVentaPorTipo: Array<{
        tipo: string;
        codigo: string;
        total: number;
        cantidad: number;
    }>;
}

interface Props {
    cierre: Cierre;
    movimientos: Movimiento[];
    totales_por_tipo: TotalPorTipo[];
    tipos_operacion: TipoOperacion[];
    tipos_pago?: TipoPago[];
    datosResumen?: DatosResumen;
}

export default function ReportesDiariosDetalle({ cierre, movimientos, totales_por_tipo, tipos_operacion, tipos_pago = [], datosResumen }: Props) {
    // ✅ DEBUG: Mostrar qué llega del backend
    console.log('🔍 [ReportesDiariosDetalle] DATOS DEL BACKEND:', {
        cierre,
        movimientos_count: movimientos.length,
        movimientos_completo: movimientos,
        totales_por_tipo,
        tipos_operacion,
        tipos_pago,
        datosResumen,
    });

    // ✅ DEBUG: Mostrar solo los movimientos que tienen venta asociada
    console.log(
        '📋 [ReportesDiariosDetalle] MOVIMIENTOS CON VENTA:',
        movimientos.filter((m) => m.venta_id && m.venta),
    );

    // ✅ DEBUG: Mostrar movimientos de tipo CREDITO
    console.log(
        '💳 [ReportesDiariosDetalle] MOVIMIENTOS TIPO CREDITO:',
        movimientos.filter((m) => m.tipo_operacion.codigo === 'CREDITO'),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Cajas', href: '/cajas' },
        { title: 'Reportes Diarios', href: '/cajas/admin/reportes-diarios' },
        { title: `Cierre #${cierre.id}`, href: '#' },
    ];

    // ===== HELPER: Obtener ID de tipo_pago 'CRÉDITO' =====
    const creditoTipoPagoId = tipos_pago.find((tp) => tp.nombre?.toUpperCase().includes('CRÉDIT'))?.id;

    // ===== FILTROS =====
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string>(''); // ✅ ACTUALIZADO (2026-06-27): Select simple en lugar de array
    const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState<number | ''>(''); // ✅ ACTUALIZADO (2026-06-27): Select simple en lugar de array
    const [busqueda, setBusqueda] = useState('');
    const [montoMin, setMontoMin] = useState<number | null>(null);
    const [montoMax, setMontoMax] = useState<number | null>(null);
    const [filtroEstadoVenta, setFiltroEstadoVenta] = useState<string>(''); // ✅ NUEVO: Filtro por estado de venta

    // ===== MODAL DE SALIDA (Impresión/Descarga) =====
    const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);

    // ===== MODAL DE IMPRESIÓN DEL CIERRE =====
    const [isImpresionCierreAbierto, setIsImpresionCierreAbierto] = useState(false);

    // ===== MODAL DE DETALLES DE VENTA =====
    const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<Movimiento['venta'] | null>(null);

    const abrirModalImpresion = (movimiento: Movimiento) => {
        setMovimientoSeleccionado(movimiento);
        setIsOutputModalOpen(true);
    };

    const cerrarModalImpresion = () => {
        setIsOutputModalOpen(false);
        setMovimientoSeleccionado(null);
    };

    const abrirModalVenta = (venta: Movimiento['venta']) => {
        if (venta) {
            setVentaSeleccionada(venta);
            setIsVentaModalOpen(true);
        }
    };

    const cerrarModalVenta = () => {
        setIsVentaModalOpen(false);
        setVentaSeleccionada(null);
    };

    // Mapear tipo de operación a TipoDocumento
    const getTipoDocumento = (tipoOperacion: string): TipoDocumento => {
        const tipoMap: Record<string, TipoDocumento> = {
            VENTA: 'movimiento',
            PAGO: 'pago',
            GASTO: 'movimiento',
            AJUSTE: 'movimiento',
            COMPRA: 'compra',
            CREDITO: 'movimiento',
            INGRESO: 'movimiento',
            EGRESO: 'movimiento',
        };
        return tipoMap[tipoOperacion.toUpperCase()] || 'movimiento';
    };

    // ✅ NUEVO: Detectar discrepancias en movimientos de venta
    const tieneDiscrepancia = (mov: Movimiento): boolean => {
        // Solo revisar movimientos de tipo VENTA
        if (mov.tipo_operacion.codigo !== 'VENTA') return false;

        // Si no hay venta asociada, no hay discrepancia
        if (!mov.venta) return false;

        const montoMovimiento = Number(mov.monto);
        const totalVenta = Number(mov.venta.total ?? 0);
        const montoPagado = Number(mov.venta.monto_pagado ?? 0);

        // Discrepancia 1: El monto del movimiento no coincide con el total de la venta
        if (Math.abs(montoMovimiento - totalVenta) > 0.01) {
            return true;
        }

        // Discrepancia 2: El total no coincide con el monto pagado (hay pendiente no registrado)
        if (Math.abs(totalVenta - montoPagado) > 0.01) {
            return true;
        }

        return false;
    };

    // Badge para estado de venta
    const getEstadoVentaBadge = (mov: Movimiento) => {
        if (!mov.venta || !mov.venta.estado_documento) {
            return null;
        }

        const codigo = mov.venta.estado_documento.codigo?.toUpperCase();

        if (codigo === 'APROBADO' || codigo === 'APROBADA') {
            return (
                <Badge className="border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
                    ✅ {mov.venta.estado_documento.nombre}
                </Badge>
            );
        } else if (codigo === 'ANULADO' || codigo === 'ANULADA') {
            return (
                <Badge className="border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
                    ❌ {mov.venta.estado_documento.nombre}
                </Badge>
            );
        }

        return (
            <Badge className="border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-300">
                ⚪ {mov.venta.estado_documento.nombre}
            </Badge>
        );
    };

    // ===== LÓGICA DE FILTRADO =====
    const movimientosFiltrados = useMemo(() => {
        return movimientos.filter((mov) => {
            // ✅ ACTUALIZADO (2026-06-27): Filtro por tipo de operación (select simple)
            if (tipoSeleccionado) {
                if (mov.tipo_operacion.codigo !== tipoSeleccionado) {
                    return false;
                }
            }

            // ✅ ACTUALIZADO (2026-06-27): Filtro por tipo de pago (select simple)
            if (tipoPagoSeleccionado !== '') {
                // Verificar tipo_pago_id del movimiento
                const tipoPagoDelMovimiento = mov.tipo_pago_id === tipoPagoSeleccionado;

                // Verificar tipo_pago_id de la venta (para ventas a crédito sin detalles_pago_venta)
                const tipoPagoDelVenta = mov.venta?.tipo_pago_id === tipoPagoSeleccionado;

                // Verificar detalles de pago de la venta
                const tieneDetalleConTipoPago = mov.venta?.detallesPagoVenta?.some((detalle) => detalle.tipo_pago_id === tipoPagoSeleccionado);

                // Para CREDITO operations (tipo_operacion.codigo = 'CREDITO'), asumir tipo_pago = CREDITO por defecto
                const esCreditoImplicito = mov.tipo_operacion.codigo === 'CREDITO' && creditoTipoPagoId === tipoPagoSeleccionado;

                // Si no coincide en ningún lugar, excluir
                if (!tipoPagoDelMovimiento && !tipoPagoDelVenta && !tieneDetalleConTipoPago && !esCreditoImplicito) {
                    return false;
                }
            }

            // ✅ NUEVO: Filtro por estado de venta
            if (filtroEstadoVenta) {
                if (!mov.venta || !mov.venta.estado_documento) {
                    return false;
                }
                const codigo = mov.venta.estado_documento.codigo?.toUpperCase();
                if (filtroEstadoVenta === 'aprobadas' && codigo !== 'APROBADO' && codigo !== 'APROBADA') {
                    return false;
                }
                if (filtroEstadoVenta === 'anuladas' && codigo !== 'ANULADO' && codigo !== 'ANULADA') {
                    return false;
                }
            }

            // Filtro por búsqueda (documento)
            if (busqueda.trim()) {
                const searchLower = busqueda.toLowerCase();
                if (!mov.numero_documento.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Filtro por rango de montos
            if (montoMin !== null && Math.abs(mov.monto) < montoMin) {
                return false;
            }
            if (montoMax !== null && Math.abs(mov.monto) > montoMax) {
                return false;
            }

            return true;
        });
    }, [movimientos, tipoSeleccionado, tipoPagoSeleccionado, busqueda, montoMin, montoMax, filtroEstadoVenta]);

    // ✅ DEBUG: Log de filtrado
    if (tipoPagoSeleccionado !== '' || tipoSeleccionado) {
        console.log('🎯 [ReportesDiariosDetalle] FILTROS ACTIVOS:', {
            tipoSeleccionado,
            tipoPagoSeleccionado,
            creditoTipoPagoId,
            movimientosFiltrados_count: movimientosFiltrados.length,
            movimientosFiltrados: movimientosFiltrados,
        });
    }

    // ===== TOTALES FILTRADOS =====
    const totalIngresos = movimientosFiltrados.filter((m) => m.monto > 0).reduce((sum, m) => sum + m.monto, 0);

    const totalEgresos = movimientosFiltrados.filter((m) => m.monto < 0).reduce((sum, m) => sum + m.monto, 0);

    const totalNeto = totalIngresos + totalEgresos;

    const limpiarFiltros = () => {
        setTipoSeleccionado('');
        setTipoPagoSeleccionado('');
        setBusqueda('');
        setMontoMin(null);
        setMontoMax(null);
        setFiltroEstadoVenta('');
    };

    const descargarFiltrado = () => {
        // Construir los parámetros de query
        const params = new URLSearchParams();

        if (tipoSeleccionado) {
            params.append('tipos', tipoSeleccionado);
        }
        if (tipoPagoSeleccionado !== '') {
            params.append('tipos_pago', tipoPagoSeleccionado.toString());
        }
        if (busqueda.trim()) {
            params.append('busqueda', busqueda.trim());
        }
        if (montoMin !== null) {
            params.append('monto_min', montoMin.toString());
        }
        if (montoMax !== null) {
            params.append('monto_max', montoMax.toString());
        }

        params.append('formato', 'A4');

        // Redirigir a la descarga
        window.location.href = `/cajas/admin/reportes-diarios/${cierre.id}/descargar-filtrado?${params.toString()}`;
    };

    const tieneFiltrantes =
        tipoSeleccionado || tipoPagoSeleccionado !== '' || busqueda.trim() || montoMin !== null || montoMax !== null || filtroEstadoVenta;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cierre de Caja #${cierre.id}`} />

            <div className="py-1">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cierre de Caja #{cierre.id}</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {cierre.caja.nombre} • Apertura #{cierre.apertura_caja_id}
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsImpresionCierreAbierto(true)}
                            className="bg-blue-600 text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir Cierre
                        </Button>
                    </div>

                    {/* Información General */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Apertura */}
                        <Card className="border p-3 dark:border-slate-700 dark:bg-slate-800">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Apertura #{cierre.apertura_caja_id}</h3>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha/Hora</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                        {format(parseISO(cierre.fecha_apertura), 'dd/MM/yyyy HH:mm:ss', {
                                            locale: es,
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto de Apertura</p>
                                    <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                                        Bs. {Number(cierre.monto_apertura).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Cierre */}
                        <Card className="border p-3 dark:border-slate-700 dark:bg-slate-800">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cierre</h3>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha/Hora</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                        {format(parseISO(cierre.fecha_cierre), 'dd/MM/yyyy HH:mm:ss', {
                                            locale: es,
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ejecutado por</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{cierre.usuario.name}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Resumen de Montos */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card className="border p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Esperado</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">Bs. {Number(cierre.monto_esperado).toFixed(2)}</p>
                        </Card>

                        <Card className="border p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Real</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Bs. {Number(cierre.monto_real).toFixed(2)}</p>
                        </Card>

                        <Card className="border p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Diferencia</p>
                            <p
                                className={`text-2xl font-bold ${
                                    cierre.diferencia === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                                }`}
                            >
                                Bs. {Number(cierre.diferencia).toFixed(2)}
                            </p>
                        </Card>

                        <Card className="border p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Movimientos</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{movimientosFiltrados.length}</p>
                        </Card>
                    </div>

                    {/* Panel de Filtros Mejorado */}
                    <Card className="border p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros Avanzados</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Mostrando <span className="font-bold text-blue-600 dark:text-blue-400">{movimientosFiltrados.length}</span> de{' '}
                                    {movimientos.length} movimientos
                                </p>
                            </div>
                            {tieneFiltrantes && (
                                <Button
                                    onClick={limpiarFiltros}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>

                        {/* Tags de Filtros Activos */}
                        {(tipoSeleccionado ||
                            tipoPagoSeleccionado !== '' ||
                            busqueda ||
                            montoMin !== null ||
                            montoMax !== null ||
                            filtroEstadoVenta) && (
                            <div className="mb-1 border-b pb-1 dark:border-slate-700">
                                <div className="flex flex-wrap gap-2">
                                    {tipoSeleccionado && (
                                        <Badge
                                            className="cursor-pointer border border-blue-300 bg-blue-100 px-3 py-2 text-blue-800 transition hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                            onClick={() => setTipoSeleccionado('')}
                                        >
                                            {tipos_operacion.find((t) => t.codigo === tipoSeleccionado)?.nombre}
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                    {tipoPagoSeleccionado !== '' && (
                                        <Badge
                                            className="cursor-pointer border border-purple-300 bg-purple-100 px-3 py-2 text-purple-800 transition hover:bg-purple-200 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                                            onClick={() => setTipoPagoSeleccionado('')}
                                        >
                                            💳 {tipos_pago.find((t) => t.id === tipoPagoSeleccionado)?.nombre}
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                    {busqueda && (
                                        <Badge
                                            className="cursor-pointer border border-green-300 bg-green-100 px-3 py-2 text-green-800 transition hover:bg-green-200 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                                            onClick={() => setBusqueda('')}
                                        >
                                            Documento: "{busqueda}"
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                    {montoMin !== null && (
                                        <Badge
                                            className="cursor-pointer border border-purple-300 bg-purple-100 px-3 py-2 text-purple-800 transition hover:bg-purple-200 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                                            onClick={() => setMontoMin(null)}
                                        >
                                            Min: Bs. {montoMin}
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                    {montoMax !== null && (
                                        <Badge
                                            className="cursor-pointer border border-orange-300 bg-orange-100 px-3 py-2 text-orange-800 transition hover:bg-orange-200 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
                                            onClick={() => setMontoMax(null)}
                                        >
                                            Max: Bs. {montoMax}
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                    {filtroEstadoVenta && (
                                        <Badge
                                            className={`cursor-pointer border px-3 py-2 transition ${
                                                filtroEstadoVenta === 'aprobadas'
                                                    ? 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                                                    : 'border-red-300 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                                            }`}
                                            onClick={() => setFiltroEstadoVenta('')}
                                        >
                                            {filtroEstadoVenta === 'aprobadas' ? '✅ Aprobadas' : '❌ Anuladas'}
                                            <X className="ml-2 h-3 w-3" />
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Filtro por tipo de operación */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                                {/* Búsqueda por documento */}
                                <div>
                                    <label className="mb-2 block flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Search className="h-4 w-4 text-blue-500" />
                                        Buscar por Documento
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: FA-001, PC-123, NC-456..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 text-sm transition focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Tipo de Operación</label>
                                    <select
                                        value={tipoSeleccionado}
                                        onChange={(e) => setTipoSeleccionado(e.target.value)}
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                                    >
                                        <option value="">Todos</option>
                                        {tipos_operacion.map((tipo) => (
                                            <option key={tipo.codigo} value={tipo.codigo}>
                                                {tipo.nombre} {tipo.direccion ? `(${tipo.direccion})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtro por tipo de pago */}
                                {tipos_pago.length > 0 && (
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">💳 Tipo de Pago</label>
                                        <select
                                            value={tipoPagoSeleccionado}
                                            onChange={(e) => setTipoPagoSeleccionado(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm transition focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-purple-400"
                                        >
                                            <option value="">Todos</option>
                                            {tipos_pago.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Filtro por estado de venta */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Estado de Venta
                                    </label>
                                    <select
                                        value={filtroEstadoVenta}
                                        onChange={(e) => setFiltroEstadoVenta(e.target.value)}
                                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400 transition"
                                    >
                                        <option value="">📋 Todas</option>
                                        <option value="aprobadas">✅ Aprobadas</option>
                                        <option value="anuladas">❌ Anuladas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Totales Filtrados */}
                    {tieneFiltrantes && (
                        <Card className="border p-6 dark:border-slate-700 dark:bg-slate-800">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                    <p className="text-xs font-medium tracking-wide text-green-700 uppercase dark:text-green-400">Ingresos</p>
                                    <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">Bs. {totalIngresos.toFixed(2)}</p>
                                </div>
                                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                    <p className="text-xs font-medium tracking-wide text-red-700 uppercase dark:text-red-400">Egresos</p>
                                    <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">Bs. {totalEgresos.toFixed(2)}</p>
                                </div>
                                <div
                                    className={`rounded-lg p-4 ${totalNeto >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
                                >
                                    <p
                                        className={`text-xs font-medium tracking-wide uppercase ${totalNeto >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
                                    >
                                        Neto
                                    </p>
                                    <p
                                        className={`mt-2 text-2xl font-bold ${
                                            totalNeto >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        Bs. {totalNeto.toFixed(2)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <p className="text-xs font-medium tracking-wide text-blue-700 uppercase dark:text-blue-400">Movimientos</p>
                                    <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{movimientosFiltrados.length}</p>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        {movimientosFiltrados.length === 1 ? 'movimiento' : 'movimientos'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Tabla de Movimientos */}
                    <Card className="overflow-hidden border dark:border-slate-700 dark:bg-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="dark:border-slate-700 dark:bg-slate-900">
                                    <TableHead className="font-semibold dark:text-gray-300">ID</TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">Fecha/Hora</TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">Usuario</TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">Tipo de Operación</TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">Documento</TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">Tipo de Pago</TableHead>
                                    {/* <TableHead className="font-semibold dark:text-gray-300">Cliente</TableHead> */}
                                    <TableHead className="text-right font-semibold dark:text-gray-300">Monto</TableHead>
                                    {/* <TableHead className="text-right font-semibold dark:text-gray-300">Total Venta</TableHead> */}
                                    {/* <TableHead className="text-right font-semibold dark:text-gray-300">Monto Pagado</TableHead> */}
                                    {/* <TableHead className="text-right font-semibold dark:text-gray-300">Monto Pendiente</TableHead> */}
                                    {/* <TableHead className="font-semibold dark:text-gray-300">Detalles de Pago</TableHead> */}
                                    {/* <TableHead className="font-semibold dark:text-gray-300">Estado Venta</TableHead> */}
                                    <TableHead className="font-semibold dark:text-gray-300">Observaciones</TableHead>
                                    <TableHead className="text-center font-semibold dark:text-gray-300">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movimientosFiltrados.length > 0 ? (
                                    movimientosFiltrados.map((mov) => (
                                        <TableRow
                                            key={mov.id}
                                            className={`transition-colors dark:border-slate-700 ${
                                                tieneDiscrepancia(mov)
                                                    ? 'border-l-4 border-l-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                                                    : 'dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <TableCell className="text-sm dark:text-gray-300">{mov.id}</TableCell>
                                            <TableCell className="text-xs dark:text-gray-300">
                                                {format(parseISO(mov.fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                                            </TableCell>
                                            <TableCell className="dark:text-gray-300">{mov.usuario.name}</TableCell>
                                            <TableCell className="dark:text-gray-300">
                                                <Badge
                                                    variant={mov.monto > 0 ? 'default' : 'secondary'}
                                                    className={
                                                        mov.monto > 0
                                                            ? 'bg-green-600 text-white dark:bg-green-700'
                                                            : mov.monto < 0
                                                              ? 'bg-red-600 text-white dark:bg-red-700'
                                                              : ''
                                                    }
                                                >
                                                    {mov.tipo_operacion.nombre}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs dark:text-gray-300">{mov.numero_documento}</TableCell>
                                            <TableCell className="text-xs dark:text-gray-300">
                                                {mov.tipo_pago ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-purple-300 bg-purple-100 text-purple-800 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                    >
                                                        💳 {mov.tipo_pago.nombre}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            {/* <TableCell className="text-sm dark:text-gray-300">{mov.venta?.cliente?.nombre || '-'}</TableCell> */}
                                            <TableCell
                                                className={`text-right font-semibold ${
                                                    mov.monto > 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : mov.monto < 0
                                                          ? 'text-red-600 dark:text-red-400'
                                                          : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {mov.monto > 0 ? '+' : ''}
                                                Bs. {Number(mov.monto).toFixed(2)}
                                            </TableCell>

                                            {/* ✅ NUEVO: Total Venta */}
                                            {/* <TableCell className="text-right text-sm font-semibold dark:text-gray-300">
                                                {mov.venta?.total ? `Bs. ${Number(mov.venta.total).toFixed(2)}` : '-'}
                                            </TableCell> */}
                                            {/* ✅ NUEVO: Monto Pagado */}
                                            {/* <TableCell className="text-right text-sm font-semibold dark:text-gray-300">
                                                {mov.venta?.monto_pagado ? `Bs. ${Number(mov.venta.monto_pagado).toFixed(2)}` : '-'}
                                            </TableCell> */}
                                            {/* ✅ NUEVO: Monto Pendiente (desde BD) */}
                                            {/* <TableCell className="text-right text-sm font-semibold dark:text-gray-300">
                                                {mov.venta?.monto_pendiente !== undefined && mov.venta?.monto_pendiente !== null ? (
                                                    <span
                                                        className={
                                                            Number(mov.venta.monto_pendiente) > 0
                                                                ? 'text-orange-600 dark:text-orange-400'
                                                                : 'text-green-600 dark:text-green-400'
                                                        }
                                                    >
                                                        Bs. {Number(mov.venta.monto_pendiente).toFixed(2)}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell> */}
                                            {/* <TableCell className="text-sm dark:text-gray-300">
                                                {mov.venta?.detallesPagoVenta && mov.venta.detallesPagoVenta.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {mov.venta.detallesPagoVenta.map((detalle, idx) => (
                                                            <div key={idx} className="flex items-center gap-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-gray-100 px-2 py-0 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                                >
                                                                    {detalle.tipoPago?.nombre || 'Sin tipo'}
                                                                </Badge>
                                                                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                                                    Bs. {Number(detalle.monto).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell> */}
                                            {/* <TableCell className="text-sm dark:text-gray-300">{getEstadoVentaBadge(mov) || '-'}</TableCell> */}
                                            <TableCell className="text-xs dark:text-gray-300">{mov.observaciones || '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Botón de Ver Detalles de Venta */}
                                                    {mov.venta && (
                                                        <button
                                                            onClick={() => abrirModalVenta(mov.venta)}
                                                            className="inline-flex items-center justify-center rounded-lg p-2 text-purple-600 transition hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30"
                                                            title="Ver detalles de venta"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {/* Botón de Imprimir - solo para movimientos que no sean VENTA ni CREDITO */}
                                                    {mov.tipo_operacion.codigo !== 'VENTA' && mov.tipo_operacion.codigo !== 'CREDITO' && (
                                                        <button
                                                            onClick={() => abrirModalImpresion(mov)}
                                                            className="inline-flex items-center justify-center rounded-lg p-2 text-blue-600 transition hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                            title="Imprimir/Descargar movimiento"
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="dark:border-slate-700">
                                        <TableCell colSpan={15} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No hay movimientos que coincidan con los filtros seleccionados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Botones de descarga */}
                </div>
            </div>

            {/* Modal de Impresión del Cierre */}
            <OutputSelectionModal
                isOpen={isImpresionCierreAbierto}
                onClose={() => setIsImpresionCierreAbierto(false)}
                documentoId={cierre.apertura_caja_id}
                tipoDocumento="caja"
                printType="cierre"
                documentoInfo={{
                    numero: `Cierre #${cierre.id}`,
                    fecha: format(parseISO(cierre.fecha_cierre), 'dd/MM/yyyy HH:mm', { locale: es }),
                }}
            />

            {/* Modal de Salida/Impresión para cada movimiento */}
            {movimientoSeleccionado && (
                <OutputSelectionModal
                    isOpen={isOutputModalOpen}
                    onClose={cerrarModalImpresion}
                    documentoId={movimientoSeleccionado.id}
                    tipoDocumento={getTipoDocumento(movimientoSeleccionado.tipo_operacion.codigo)}
                    documentoInfo={{
                        numero: movimientoSeleccionado.numero_documento,
                        fecha: format(parseISO(movimientoSeleccionado.fecha), 'dd/MM/yyyy HH:mm'),
                        monto: movimientoSeleccionado.monto,
                    }}
                />
            )}

            {/* Modal de Detalles de Venta */}
            <Dialog open={isVentaModalOpen} onOpenChange={cerrarModalVenta}>
                <DialogContent className="max-w-2xl dark:border-slate-700 dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Detalles de Venta</DialogTitle>
                    </DialogHeader>

                    {ventaSeleccionada && (
                        <div className="space-y-6 py-4">
                            {/* Información General */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Número de Venta</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{ventaSeleccionada.numero_documento}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</p>
                                    <p className="mt-1">
                                        {getEstadoVentaBadge({
                                            venta: ventaSeleccionada,
                                            tipo_operacion: { codigo: 'VENTA', nombre: 'VENTA' },
                                        } as Movimiento) || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Montos */}
                            <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-slate-900/50">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Total</p>
                                    <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                                        Bs. {Number(ventaSeleccionada.total ?? 0).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Pagado</p>
                                    <p className="mt-2 text-xl font-bold text-green-600 dark:text-green-400">
                                        Bs. {Number(ventaSeleccionada.monto_pagado ?? 0).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Pendiente</p>
                                    <p
                                        className={`mt-2 text-xl font-bold ${Number(ventaSeleccionada.monto_pendiente ?? 0) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}
                                    >
                                        Bs. {Number(ventaSeleccionada.monto_pendiente ?? 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Detalles de Pago */}
                            {ventaSeleccionada.detallesPagoVenta && ventaSeleccionada.detallesPagoVenta.length > 0 && (
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Desglose de Pagos</h3>
                                    <div className="space-y-2">
                                        {ventaSeleccionada.detallesPagoVenta.map((detalle, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-slate-900/50">
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
                            {ventaSeleccionada.cliente && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cliente</p>
                                    <p className="mt-1 text-gray-900 dark:text-white">{ventaSeleccionada.cliente.nombre}</p>
                                </div>
                            )}

                            {/* Acciones */}
                            <div className="flex justify-end gap-2 border-t pt-4 dark:border-slate-700">
                                <Button onClick={cerrarModalVenta} variant="outline" className="dark:border-slate-600 dark:hover:bg-slate-700">
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
