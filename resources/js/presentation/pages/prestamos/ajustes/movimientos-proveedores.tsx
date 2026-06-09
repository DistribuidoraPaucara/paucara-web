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
    disponible_posterior: number;
    prestamo_proveedor_anterior: number;
    prestamo_proveedor_posterior: number;
    cantidad_proveedor_dañada_anterior: number;
    cantidad_proveedor_dañada_posterior: number;
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

export default function MovimientosProveedores() {
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
            params.append('categoria', 'proveedor');

            const response = await fetch(`/api/prestables/movimientos?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            if (result.success) {
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Movimientos de Proveedores', href: '/prestamos/ajustes/movimientos/proveedores' }]}>
            <Head title="Movimientos de Stock - Proveedores" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🚚 Movimientos de Stock - Proveedores</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Registro de todos los préstamos de proveedores: disponibilidad y daños
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
                                <option value="ENTRADA">Entrada</option>
                                <option value="SALIDA">Salida</option>
                                <option value="CONSUMO_RESERVA">Consumo de Reserva</option>
                                <option value="AJUSTE_DIRECTO">Ajuste Directo</option>
                                <option value="AJUSTE_RELATIVO">Ajuste Relativo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de Movimientos */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">ID</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Fecha</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Prestable</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Tipo</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Almacén</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Referencia</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Disponible Antes</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Acreedor Antes</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Cantidad</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">⚠️ Dañada Registrada</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Disponible Después</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Acreedor Después</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">Dañada Después</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={13} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">Cargando...</span>
                                    </td>
                                </tr>
                            ) : movimientos?.data && movimientos.data.length > 0 ? (
                                movimientos.data.map((movimiento) => {
                                    const estilo = getTipoBadgeStyle(movimiento.tipo);

                                    return (
                                        <tr
                                            key={movimiento.id}
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                                                movimiento.anulado ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                <div className="text-sm font-medium">{movimiento.id}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                <div className="text-sm font-medium">{new Date(movimiento.created_at).toLocaleString('es-ES')}</div>
                                                <div className="text-xs text-slate-500">{movimiento.usuario?.name || 'Sin usuario'}</div>
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
                                                    <Badge className="mt-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        ⛔ Anulado
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                                {movimiento.prestable_stock?.almacen_prestable?.nombre || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {movimiento.referencia_id ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                                            #{movimiento.referencia_id}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {movimiento.referencia_tipo || '-'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <span className="font-medium text-blue-700 dark:text-blue-400">
                                                    {movimiento.disponible_anterior}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <span className="font-medium text-amber-700 dark:text-amber-400">
                                                    {movimiento.prestamo_proveedor_anterior}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${
                                                        movimiento.cantidad >= 0
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {movimiento.cantidad >= 0 ? '✓' : ''}
                                                    {movimiento.cantidad}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center bg-orange-50 dark:bg-orange-900/10">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${
                                                    movimiento.cantidad_dañada_registrada > 0
                                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                    ⚠️ {movimiento.cantidad_dañada_registrada}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <span className="font-medium text-blue-700 dark:text-blue-400">
                                                    {movimiento.disponible_posterior}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                <span className="font-medium text-amber-700 dark:text-amber-400">
                                                    {movimiento.prestamo_proveedor_posterior}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center bg-orange-50 dark:bg-orange-900/10 text-sm">
                                                <span className="font-bold text-orange-700 dark:text-orange-400">
                                                    {movimiento.cantidad_proveedor_dañada_posterior}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={13} className="px-4 py-8 text-center">
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
