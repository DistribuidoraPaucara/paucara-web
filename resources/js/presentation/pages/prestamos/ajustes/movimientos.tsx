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
    tipo: 'AJUSTE_DIRECTO' | 'AJUSTE_RELATIVO' | 'ENTRADA' | 'SALIDA' | 'CONSUMO_RESERVA' | 'DISTRIBUCION_RESERVA' | 'LIBERACION_RESERVA';
    cantidad: number;
    disponible_anterior: number;
    prestamo_cliente_anterior: number;
    prestamo_proveedor_anterior: number;
    vendida_anterior: number;
    disponible_posterior: number;
    prestamo_cliente_posterior: number;
    prestamo_proveedor_posterior: number;
    vendida_posterior: number;
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
    };
    return styles[tipo] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function MovimientosPrestables() {
    const [movimientos, setMovimientos] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [page, setPage] = useState(1);

    const cargarMovimientos = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            if (tipoFiltro) params.append('tipo', tipoFiltro);
            params.append('page', page.toString());

            const response = await fetch(`/api/prestables/movimientos?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            console.log('📡 Respuesta del backend:', result);
            if (result.success) {
                console.log('✅ Movimientos cargados:', result.data);
                setMovimientos(result.data);
            }
        } catch (error) {
            console.error('Error cargando movimientos:', error);
        } finally {
            setLoading(false);
        }
    }, [buscar, tipoFiltro, page]);

    useEffect(() => {
        cargarMovimientos();
    }, [cargarMovimientos]);

    const calcularTotalAntes = (m: Movimiento) => {
        return m.disponible_anterior + m.prestamo_cliente_anterior + m.prestamo_proveedor_anterior + m.vendida_anterior;
    };

    const calcularTotalDespues = (m: Movimiento) => {
        return m.disponible_posterior + m.prestamo_cliente_posterior + m.prestamo_proveedor_posterior + m.vendida_posterior;
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
        };
        return labels[tipo] || tipo;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Movimientos de Stock', href: '/prestamos/ajustes/movimientos' }]}>
            <Head title="Movimientos de Stock de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
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
                <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
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
                </div>

                {/* Leyenda */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                    <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-300">📋 Leyenda de Columnas Antes/Después:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">D</span>
                            <p className="text-blue-700 dark:text-blue-400">Disponible</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">PC</span>
                            <p className="text-blue-700 dark:text-blue-400">Préstamo Cliente</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">PP</span>
                            <p className="text-blue-700 dark:text-blue-400">Préstamo Proveedor</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">T</span>
                            <p className="text-blue-700 dark:text-blue-400">Total</p>
                        </div>
                    </div>
                </div>

                {/* Tabla de Movimientos */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Prestable
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Almacén
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Referencia
                                </th>
                                
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Antes
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Cantidad Sol.
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Después
                                </th>
                                {/* <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Cambio
                                </th> */}
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
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                                                movimiento.anulado ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {new Date(movimiento.created_at).toLocaleString('es-ES')}
                                                <p>{movimiento.usuario?.name || 'Sin usuario'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {movimiento.prestable_stock?.prestable?.nombre || 'Sin prestable'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {movimiento.prestable_stock?.prestable?.codigo || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${estilo.bg} ${estilo.text}`}>
                                                    {getTipoLabel(movimiento.tipo)}
                                                </Badge>
                                                {movimiento.anulado && (
                                                    <Badge className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        ⛔ Anulado
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {movimiento.prestable_stock?.almacen_prestable?.nombre || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {movimiento.referencia_id ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                                            Folio: {movimiento.referencia_id}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {movimiento.referencia_tipo || 'Sin tipo'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500">-</span>
                                                )}
                                            </td>
                                            
                                            <td className="px-4 py-3 text-center bg-blue-50 dark:bg-blue-900/10">
                                                <div className="text-xs text-slate-700 dark:text-slate-300">
                                                    <div>D: {movimiento.disponible_anterior}</div>
                                                    <div>PC: {movimiento.prestamo_cliente_anterior}</div>
                                                    <div>PP: {movimiento.prestamo_proveedor_anterior}</div>
                                                    <div className="font-semibold text-blue-900 dark:text-blue-300">T: {totalAntes}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                                                        movimiento.cantidad >= 0
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {movimiento.cantidad >= 0 ? '+' : ''}{movimiento.cantidad}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center bg-amber-50 dark:bg-amber-900/10">
                                                <div className="text-xs text-slate-700 dark:text-slate-300">
                                                    <div>D: {movimiento.disponible_posterior}</div>
                                                    <div>PC: {movimiento.prestamo_cliente_posterior}</div>
                                                    <div>PP: {movimiento.prestamo_proveedor_posterior}</div>
                                                    <div className="font-semibold text-amber-900 dark:text-amber-300">T: {totalDespues}</div>
                                                </div>
                                            </td>
                                            {/* <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                                                        esPositivo
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {esPositivo ? '+' : ''}{cambio}
                                                </span>
                                            </td> */}
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
