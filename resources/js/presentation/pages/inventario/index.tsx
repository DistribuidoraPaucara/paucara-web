/**
 * Página: Dashboard de Inventario
 *
 * Página principal que renderiza el resumen general del estado del inventario
 * Delegando toda la lógica de procesamiento de datos a hooks especializados
 */

import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import { useDashboardInventario } from '@/application/hooks/use-dashboard-inventario';
import type { DashboardPageProps } from '@/domain/entities/dashboard-inventario';

// Sub-componentes
import EstadisticasCards from '@/presentation/components/dashboard/EstadisticasCards';
import StockYProductos from '@/presentation/components/dashboard/StockYProductos';
import MovimientosRecientes from '@/presentation/components/dashboard/MovimientosRecientes';
import EnlacesRapidos from '@/presentation/components/dashboard/EnlacesRapidos';

interface PageProps extends InertiaPageProps {
    estadisticas: DashboardPageProps['estadisticas'];
    stock_por_almacen: DashboardPageProps['stock_por_almacen'];
    movimientos_recientes: DashboardPageProps['movimientos_recientes'];
    productos_mas_movidos: DashboardPageProps['productos_mas_movidos'];
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
];

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();

    // ✅ Procesar datos usando hook de aplicación (DEBE ser antes de cualquier early return)
    const {
        data,
        movimientosRecientes,
        productosMasMovidos,
    } = useDashboardInventario({
        estadisticas: props.estadisticas,
        stock_por_almacen: props.stock_por_almacen,
        movimientos_recientes: props.movimientos_recientes,
        productos_mas_movidos: props.productos_mas_movidos,
    });

    // console.log('Dashboard Inventario renderizado', data);

    // ✅ Validar permisos (única lógica de negocio)
    if (!can('inventario.dashboard')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        No tienes permisos para acceder a esta página
                    </h3>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard de Inventario" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Dashboard de Inventario
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Resumen general del estado de tu inventario
                        </p>
                    </div>
                </div>

                {/* Secciones del Dashboard */}
                <EstadisticasCards
                    estadisticas={data.estadisticas}
                    canViewStockBajo={can('inventario.stock-bajo')}
                    canViewProximosVencer={can('inventario.proximos-vencer')}
                    canViewVencidos={can('inventario.vencidos')}
                />

                <StockYProductos
                    stockPorAlmacen={props.stock_por_almacen}
                    productosMasMovidos={productosMasMovidos}
                />

                <MovimientosRecientes
                    movimientos={movimientosRecientes}
                    canViewAll={can('inventario.movimientos')}
                />

                <EnlacesRapidos
                    canViewStockBajo={can('inventario.stock-bajo')}
                    canViewMovimientos={can('inventario.movimientos')}
                    canAdjust={can('inventario.ajuste.form')}
                    canViewReportes={can('inventario.reportes')}
                />

            </div>
        </AppLayout>
    );
}
