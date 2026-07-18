import { Head } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';

interface Movimiento {
    id: number;
    prestable_stock: {
        prestable_id: number;
        prestable: { nombre: string; codigo: string };
        almacen_prestable: { id: number; nombre: string };
    };
    usuario: { id: number; name: string };
    tipo: string;
    cantidad: number;
    cantidad_dañada_registrada: number;
    disponible_anterior: number;
    prestamo_cliente_anterior: number;
    prestamo_proveedor_anterior: number;
    prestamo_evento_anterior?: number;
    compra_anterior?: number;
    vendida_anterior: number;
    disponible_posterior: number;
    prestamo_cliente_posterior: number;
    prestamo_proveedor_posterior: number;
    prestamo_evento_posterior?: number;
    compra_posterior?: number;
    vendida_posterior: number;
    cantidad_cliente_dañada_anterior: number;
    cantidad_cliente_dañada_posterior: number;
    cantidad_proveedor_dañada_anterior: number;
    cantidad_proveedor_dañada_posterior: number;
    cantidad_evento_dañada_anterior?: number;
    cantidad_evento_dañada_posterior?: number;
    categoria_afectada: string | null;
    motivo: string | null;
    observaciones: string | null;
    numero_referencia: string | null;
    referencia_tipo: string | null;
    referencia_id?: number | null;
    anulado: boolean;
    created_at: string;
}

interface PaginationData {
    data: Movimiento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const getTipoBadgeStyle = (tipo: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
        AJUSTE_DIRECTO: { bg: 'bg-blue-100', text: 'text-blue-700' },
        AJUSTE_RELATIVO: { bg: 'bg-amber-100', text: 'text-amber-700' },
        ENTRADA: { bg: 'bg-green-100', text: 'text-green-700' },
        SALIDA: { bg: 'bg-red-100', text: 'text-red-700' },
        CONSUMO_RESERVA: { bg: 'bg-purple-100', text: 'text-purple-700' },
        DISTRIBUCION_RESERVA: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
        LIBERACION_RESERVA: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
        DEVOLUCION_EVENTO: { bg: 'bg-orange-100', text: 'text-orange-700' },
        DEVOLUCION_CLIENTE: { bg: 'bg-pink-100', text: 'text-pink-700' },
        DEVOLUCION_PROVEEDOR: { bg: 'bg-teal-100', text: 'text-teal-700' },
        VENTA_PRESTABLE: { bg: 'bg-lime-100', text: 'text-lime-700' },
        COMPRA_PRESTABLE: { bg: 'bg-sky-100', text: 'text-sky-700' },
    };
    return styles[tipo] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
        AJUSTE_DIRECTO: '📊 Ajuste Directo',
        AJUSTE_RELATIVO: '➕➖ Ajuste Relativo',
        ENTRADA: '📦 Entrada',
        SALIDA: '📤 Salida',
        CONSUMO_RESERVA: '🔴 Consumo',
        DISTRIBUCION_RESERVA: '📍 Distribución',
        LIBERACION_RESERVA: '🔵 Liberación',
        DEVOLUCION_EVENTO: '🎉 Devolución Evento',
        DEVOLUCION_CLIENTE: '👥 Devolución Cliente',
        DEVOLUCION_PROVEEDOR: '🚚 Devolución Proveedor',
        VENTA_PRESTABLE: '💰 Venta Prestable',
        COMPRA_PRESTABLE: '📥 Compra Prestable',
    };
    return labels[tipo] || tipo;
};

// Determinar qué columnas mostrar basado en los datos disponibles
const obtenerColumnasAMostrar = (movimientos: Movimiento[]): string[] => {
    const columnas = ['disponible'];

    // Verificar si hay datos de dañadas por tipo
    const tieneClienteDañada = movimientos.some(
        m => (m.cantidad_cliente_dañada_anterior ?? 0) > 0 || (m.cantidad_cliente_dañada_posterior ?? 0) > 0
    );
    const tieneProveedorDañada = movimientos.some(
        m => (m.cantidad_proveedor_dañada_anterior ?? 0) > 0 || (m.cantidad_proveedor_dañada_posterior ?? 0) > 0
    );
    const tieneEventoDañada = movimientos.some(
        m => (m.cantidad_evento_dañada_anterior ?? 0) > 0 || (m.cantidad_evento_dañada_posterior ?? 0) > 0
    );

    if (tieneClienteDañada) columnas.push('dañada_cliente');
    if (tieneProveedorDañada) columnas.push('dañada_proveedor');
    if (tieneEventoDañada) columnas.push('dañada_evento');

    return columnas;
};

const getIconoColumna = (columna: string): string => {
    const iconos: Record<string, string> = {
        disponible: '📦',
        dañada_cliente: '❌',
        dañada_proveedor: '⚠️',
        dañada_evento: '🎉❌',
    };
    return iconos[columna] || '📊';
};


export default function MovimientosPrestables() {
    const [movimientos, setMovimientos] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [page, setPage] = useState(1);
    const [columnasAMostrar, setColumnasAMostrar] = useState<string[]>(['disponible']);
    const [soloActivos, setSoloActivos] = useState(false);

    const cargarMovimientos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            if (tipoFiltro) params.append('tipo', tipoFiltro);
            params.append('page', page.toString());
            if (soloActivos) params.append('solo_activos', 'true');

            const response = await fetch(`/api/prestables/movimientos?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            console.log('%c📡 RESPUESTA DEL BACKEND', 'color: #0066cc; font-weight: bold; font-size: 12px');
            console.log(result);

            if (result.success) {
                console.log('%c✅ MOVIMIENTOS CARGADOS', 'color: #00aa00; font-weight: bold; font-size: 12px');
                console.log(`Total: ${result.data.total} movimientos`);

                // Mostrar detalles de cada movimiento
                if (result.data.data && result.data.data.length > 0) {
                    console.log('%c📊 DETALLES DE MOVIMIENTOS', 'color: #ff6600; font-weight: bold; font-size: 12px');
                    result.data.data.forEach((mov: Movimiento, idx: number) => {
                        console.log(`%c[${idx + 1}] Movimiento #${mov.id}`, 'color: #aa00aa; font-weight: bold');
                        console.table({
                            Prestable: mov.prestable_stock?.prestable?.nombre,
                            Tipo: mov.tipo,
                            Cantidad: mov.cantidad,
                            'Dañada Registrada': mov.cantidad_dañada_registrada,
                            'Referencia Tipo': mov.referencia_tipo,
                            'Referencia ID': mov.referencia_id,
                            Motivo: mov.motivo,
                            Observaciones: mov.observaciones,
                            'Cliente Dañada Anterior': mov.cantidad_cliente_dañada_anterior,
                            'Cliente Dañada Posterior': mov.cantidad_cliente_dañada_posterior,
                            'Proveedor Dañada Anterior': mov.cantidad_proveedor_dañada_anterior,
                            'Proveedor Dañada Posterior': mov.cantidad_proveedor_dañada_posterior,
                            'Evento Dañada Anterior': mov.cantidad_evento_dañada_anterior,
                            'Evento Dañada Posterior': mov.cantidad_evento_dañada_posterior,
                        });
                    });
                }

                setMovimientos(result.data);
                // Actualizar columnas a mostrar basadas en los datos
                const columnas = obtenerColumnasAMostrar(result.data.data || []);
                setColumnasAMostrar(columnas);
            } else {
                console.error('%c❌ ERROR EN RESPUESTA', 'color: #cc0000; font-weight: bold; font-size: 12px');
                console.log(result);
            }
        } catch (error) {
            console.error('Error cargando movimientos:', error);
        } finally {
            setLoading(false);
        }
    }, [buscar, tipoFiltro, page, soloActivos]);

    useEffect(() => {
        cargarMovimientos();
    }, [cargarMovimientos]);

    const calcularTotalAntes = (m: Movimiento) => {
        return m.disponible_anterior;
    };

    const calcularTotalDespues = (m: Movimiento) => {
        return m.disponible_posterior;
    };


    return (
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Movimientos de Stock', href: '/prestamos/ajustes/movimientos' }]}>
            <Head title="Movimientos de Stock de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-6 p-2">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📈 Movimientos de Stock</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Registro detallado de todos los movimientos de prestables
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Buscar prestable
                            </label>
                            <Input
                                type="text"
                                placeholder="Nombre o código..."
                                value={buscar}
                                onChange={(e) => {
                                    setBuscar(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Tipo de movimiento
                            </label>
                            <select
                                value={tipoFiltro}
                                onChange={(e) => {
                                    setTipoFiltro(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="AJUSTE_DIRECTO">Ajuste Directo</option>
                                <option value="AJUSTE_RELATIVO">Ajuste Relativo</option>
                                <option value="ENTRADA">Entrada</option>
                                <option value="SALIDA">Salida</option>
                                <option value="CONSUMO_RESERVA">Consumo de Reserva</option>
                                <option value="DISTRIBUCION_RESERVA">Distribución de Reserva</option>
                                <option value="LIBERACION_RESERVA">Liberación de Reserva</option>
                            </select>
                        </div>
                    </div>

                    {/* Checkbox Solo Activos */}
                    <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={soloActivos}
                                onChange={(e) => {
                                    setSoloActivos(e.target.checked);
                                    setPage(1);
                                }}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                🔒 Solo movimientos activos (excluir anulados)
                            </span>
                        </label>
                    </div>
                </div>

                {/* Leyenda de Columnas */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-900/30 dark:bg-blue-900/10">
                    <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-300">📋 Leyenda de Columnas (Estados Antes/Después):</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-5">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📦</span>
                            <p className="text-blue-700 dark:text-blue-400">Disponible</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">❌</span>
                            <p className="text-blue-700 dark:text-blue-400">Dañada Cliente</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            <p className="text-blue-700 dark:text-blue-400">Dañada Proveedor</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🎉❌</span>
                            <p className="text-blue-700 dark:text-blue-400">Dañada Evento</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📊</span>
                            <p className="text-blue-700 dark:text-blue-400">Cantidad Movida</p>
                        </div>
                    </div>
                </div>

                {/* Tabla de Movimientos */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    ID
                                </th>
                                <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Fecha
                                </th>
                                <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Prestable
                                </th>
                                {/* <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Tipo
                                </th> */}
                                <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Almacén
                                </th>
                                <th className="px-2 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Referencia
                                </th>
                                <th className="px-2 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Antes
                                </th>
                                <th className="px-2 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Cantidad
                                </th>
                                <th className="px-2 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    ❌ Dañada Registrada
                                </th>
                                <th className="px-2 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Después
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">Cargando...</span>
                                    </td>
                                </tr>
                            ) : movimientos?.data && movimientos.data.length > 0 ? (
                                movimientos.data.map((movimiento) => {
                                    const totalAntes = calcularTotalAntes(movimiento);
                                    const totalDespues = calcularTotalDespues(movimiento);
                                    const estilo = getTipoBadgeStyle(movimiento.tipo);

                                    return (
                                        <tr
                                            key={movimiento.id}
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${movimiento.anulado ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                                }`}
                                        >
                                            <td className="px-2 py-3 text-slate-700 dark:text-slate-300">
                                                <div className="text-sm font-medium">{movimiento.id}</div>
                                            </td>
                                            <td className="px-2 py-3 text-slate-700 dark:text-slate-300">
                                                <div className="text-xs">{new Date(movimiento.created_at).toLocaleString('es-ES')}</div>
                                                <div className="text-xs text-slate-500">{movimiento.usuario?.name || 'Sin usuario'}</div>
                                            </td>
                                            <td className="px-2 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {movimiento.prestable_stock?.prestable?.nombre || 'Sin prestable'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {movimiento.prestable_stock?.prestable?.codigo || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* <td className="px-2 py-3 text-xs">
                                                <Badge className={`${estilo.bg} ${estilo.text}`}>
                                                    {getTipoLabel(movimiento.tipo)}
                                                </Badge>
                                                
                                            </td> */}
                                            <td className="px-2 py-3 text-slate-700 dark:text-slate-300 text-xs">
                                                {movimiento.prestable_stock?.almacen_prestable?.nombre || '-'}
                                            </td>
                                            <td className="px-2 py-3 text-slate-700 dark:text-slate-300 text-xs">
                                                {movimiento.referencia_id ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-xs text-slate-900 dark:text-slate-100">
                                                            Folio #{movimiento.referencia_id}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {movimiento.referencia_tipo || '-'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500">-</span>
                                                )}
                                                {movimiento.anulado && (
                                                    <Badge className="mt-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                                                        ⛔ Anulado
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-2 py-3 text-center bg-blue-50 dark:bg-blue-900/10">
                                                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                                                    {columnasAMostrar.map(col => {
                                                        let valor = 0;
                                                        if (col === 'dañada_cliente') {
                                                            valor = movimiento.cantidad_cliente_dañada_anterior ?? 0;
                                                        } else if (col === 'dañada_proveedor') {
                                                            valor = movimiento.cantidad_proveedor_dañada_anterior ?? 0;
                                                        } else if (col === 'dañada_evento') {
                                                            valor = movimiento.cantidad_evento_dañada_anterior ?? 0;
                                                        } else {
                                                            valor = movimiento[`${col}_anterior` as keyof Movimiento] ?? 0;
                                                        }
                                                        return (
                                                            <div key={col}>
                                                                <span className="font-xs">{getIconoColumna(col)}</span> {valor}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 text-center">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${movimiento.cantidad >= 0
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}
                                                >
                                                    {movimiento.cantidad >= 0 ? '✓' : ''}
                                                    {movimiento.cantidad}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 text-center bg-red-50 dark:bg-red-900/10">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${movimiento.cantidad_dañada_registrada > 0
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    ❌ {movimiento.cantidad_dañada_registrada}
                                                </span>
                                            </td>
                                            <td className="px-2 py-3 text-center bg-amber-50 dark:bg-amber-900/10">
                                                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                                                    {columnasAMostrar.map(col => {
                                                        let valor = 0;
                                                        if (col === 'dañada_cliente') {
                                                            valor = movimiento.cantidad_cliente_dañada_posterior ?? 0;
                                                        } else if (col === 'dañada_proveedor') {
                                                            valor = movimiento.cantidad_proveedor_dañada_posterior ?? 0;
                                                        } else if (col === 'dañada_evento') {
                                                            valor = movimiento.cantidad_evento_dañada_posterior ?? 0;
                                                        } else {
                                                            valor = movimiento[`${col}_posterior` as keyof Movimiento] ?? 0;
                                                        }
                                                        return (
                                                            <div key={col}>
                                                                <span className="font-medium">{getIconoColumna(col)}</span> {valor}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">No hay movimientos registrados</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {movimientos && movimientos.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Mostrando página {movimientos.current_page} de {movimientos.last_page}
                            {' '} ({movimientos.total} movimientos totales)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                ← Anterior
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === movimientos.last_page}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
