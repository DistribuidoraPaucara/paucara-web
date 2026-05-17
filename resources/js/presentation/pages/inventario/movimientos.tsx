// Presentation Layer: Enhanced Movimientos Page
// Página principal de movimientos de inventario con arquitectura de 4 capas

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import MovimientosTable from '@/presentation/components/Inventario/MovimientosTable';
import MovimientosFilters from '@/presentation/components/Inventario/MovimientosFilters';
import MovimientosStats from '@/presentation/components/Inventario/MovimientosStats';
import { ImprimirMovimientosButton } from '@/presentation/components/impresion/ImprimirMovimientosButton';
import { ImprimirProductosVendidosButton } from '@/presentation/components/impresion/ImprimirProductosVendidosButton';
import { Button } from '@/presentation/components/ui/button';
import { Plus, BarChart3, List } from 'lucide-react';
import type {
    MovimientoInventario,
    MovimientosStats as MovimientosStatsType,
    FiltrosMovimientos
} from '@/domain/entities/movimientos-inventario';
import type { Pagination } from '@/domain/entities/shared';
import { useMovimientosInventario } from '@/application/hooks/use-movimientos-inventario';

interface ProductoVendido {
    id: number;
    nombre: string;
    sku: string;
    cantidad_total: number;
    precio_unitario: number;
    subtotal: number;
}

interface PageProps extends InertiaPageProps {
    movimientos: Pagination<MovimientoInventario>;
    filtros: FiltrosMovimientos;
    stats: MovimientosStatsType;
    almacenes: Array<{ id: number; nombre: string }>;
    productos: Array<{ id: number; nombre: string }>;
    productosVendidosHoy?: ProductoVendido[];
}

const defaultStats: MovimientosStatsType = {
    total_movimientos: 0,
    total_entradas: 0,
    total_salidas: 0,
    total_transferencias: 0,
    total_mermas: 0,
    total_ajustes: 0,
    valor_total_entradas: 0,
    valor_total_salidas: 0,
    valor_total_mermas: 0,
    productos_afectados: 0,
    almacenes_activos: 0,
    movimientos_pendientes: 0,
    tendencia_semanal: []
};

const MovimientosInventarioPage: React.FC<PageProps> = ({
    movimientos,
    filtros,
    stats = defaultStats,
    almacenes = [],
    productos = [],
    productosVendidosHoy = []
}) => {
    console.log('MovimientosInventarioPage renderizado', { movimientos, filtros, stats });
    // ✅ Estado de UI
    const [activeTab, setActiveTab] = useState<'lista' | 'estadisticas'>('lista');

    // ✅ Hook de aplicación para manejo de acciones
    const { handleCreateAjuste, handleGoToReportes } = useMovimientosInventario();

    // ✅ Aplicar filtros cuando el usuario hace clic en "Buscar"
    const handleFiltrosChange = (nuevosFiltros: FiltrosMovimientos) => {
        console.log('Aplicando filtros:', nuevosFiltros);

        // ✅ NUEVO (2026-03-27): Limpiar parámetros vacíos
        const filtrosLimpios = limpiarFiltros(nuevosFiltros);

        // Convertir filtros a parámetros de query
        const queryParams = {
            ...filtrosLimpios,
            page: 1, // Resetear a página 1 cuando se aplican filtros
        };

        // Navegar con los nuevos filtros
        router.get('/inventario/movimientos', queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ✅ Función auxiliar para limpiar filtros vacíos (2026-03-27)
    const limpiarFiltros = (filtrosObj: any) => {
        const filtrosLimpios: any = {};
        Object.entries(filtrosObj).forEach(([key, value]) => {
            // Solo incluir parámetros que tengan valor (no vacíos, no null, no undefined)
            if (value !== '' && value !== null && value !== undefined) {
                filtrosLimpios[key] = value;
            }
        });
        return filtrosLimpios;
    };

    // ✅ Breadcrumbs
    const breadcrumbs = [
        {
            title: 'Inventario',
            href: '/inventario',
        },
        {
            title: 'Movimientos',
            href: '/inventario/movimientos',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimientos de Inventario" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Movimientos de Inventario
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Consulta y analiza todos los movimientos de tu inventario
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ImprimirMovimientosButton
                            movimientos={movimientos.data as any}
                            filtros={filtros}
                        />

                        <ImprimirProductosVendidosButton
                            productosVendidos={productosVendidosHoy}
                            fecha={new Date().toISOString().split('T')[0]}
                        />

                        <Button variant="outline" onClick={handleGoToReportes}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Reportes
                        </Button>

                        <Button onClick={handleCreateAjuste}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajustar Stock
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <MovimientosFilters
                    filtros={filtros}
                    onFiltrosChange={handleFiltrosChange}
                    almacenes={almacenes}
                    productos={productos}
                />

                {/* Tabs navegación */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('lista')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'lista'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            Lista de Movimientos
                        </button>
                        <button
                            onClick={() => setActiveTab('estadisticas')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'estadisticas'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Estadísticas
                        </button>
                    </nav>
                </div>

                {/* Contenido de las tabs */}
                {activeTab === 'lista' && (
                    <div className="space-y-4">
                        {/* Resumen rápido */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Movimientos
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {movimientos.total?.toLocaleString('es-ES') || 0}
                                        </p>
                                    </div>
                                    <div className="text-2xl">📦</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Entradas Hoy
                                        </p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            +{stats.total_entradas.toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                    <div className="text-2xl">⬆️</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Salidas Hoy
                                        </p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            -{stats.total_salidas.toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                    <div className="text-2xl">⬇️</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Transferencias
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {stats.total_transferencias.toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                    <div className="text-2xl">🔄</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de movimientos */}
                        <MovimientosTable
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            movimientos={movimientos.data as any}
                            pagination={{
                                current_page: movimientos.current_page,
                                last_page: movimientos.last_page,
                                per_page: movimientos.per_page,
                                total: movimientos.total,
                                from: movimientos.from,
                                to: movimientos.to,
                            }}
                            onPageChange={(page) => {
                                // Preservar filtros actuales cuando cambias de página
                                // ✅ NUEVO (2026-03-27): Limpiar parámetros vacíos
                                const filtrosLimpios = limpiarFiltros(filtros);
                                const queryParams = {
                                    ...filtrosLimpios,
                                    page,
                                };
                                router.get('/inventario/movimientos', queryParams, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                            onPerPageChange={(perPage) => {
                                // ✅ NUEVO: Cambiar items por página (volver a página 1)
                                // ✅ NUEVO (2026-03-27): Limpiar parámetros vacíos
                                const filtrosLimpios = limpiarFiltros(filtros);
                                const queryParams = {
                                    ...filtrosLimpios,
                                    per_page: perPage,
                                    page: 1, // Resetear a página 1
                                };
                                router.get('/inventario/movimientos', queryParams, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                        />
                    </div>
                )}

                {activeTab === 'estadisticas' && (
                    <MovimientosStats
                        stats={stats}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default MovimientosInventarioPage;
