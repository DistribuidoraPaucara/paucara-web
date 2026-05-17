/**
 * Application Hook: Dashboard de Inventario
 *
 * Encapsula toda la lógica de procesamiento y validación de datos
 * del dashboard, dejando la presentación limpia y agnóstica
 */

import { useMemo } from 'react';
import type {
    DashboardPageProps,
    DashboardData,
    MovimientoReciente,
    ProductoMasMovido,
    DASHBOARD_CONSTANTS
} from '@/domain/entities/dashboard-inventario';

interface UseDashboardInventarioOptions {
    estadisticas: DashboardPageProps['estadisticas'];
    stock_por_almacen: DashboardPageProps['stock_por_almacen'];
    movimientos_recientes: DashboardPageProps['movimientos_recientes'];
    productos_mas_movidos: DashboardPageProps['productos_mas_movidos'];
}

interface UseDashboardInventarioReturn {
    data: DashboardData;
    movimientosRecientes: MovimientoReciente[];
    productosMasMovidos: ProductoMasMovido[];
}

/**
 * Hook para procesar y validar datos del dashboard
 *
 * Responsabilidades:
 * - Validar que los datos del servidor sean arrays válidos
 * - Filtrar y procesar movimientos
 * - Limitar cantidad de items mostrados
 * - Preparar datos para la vista
 */
export function useDashboardInventario({
    estadisticas,
    stock_por_almacen,
    movimientos_recientes,
    productos_mas_movidos,
}: UseDashboardInventarioOptions): UseDashboardInventarioReturn {
    /**
     * Validar y procesar datos del servidor
     * Garantiza que siempre tenemos arrays válidos
     */
    const data = useMemo(() => {
        return {
            estadisticas,
            stockPorAlmacen: Array.isArray(stock_por_almacen) ? stock_por_almacen : [],
            movimientosRecientes: Array.isArray(movimientos_recientes) ? movimientos_recientes : [],
            productosMasMovidos: Array.isArray(productos_mas_movidos) ? productos_mas_movidos : [],
        };
    }, [estadisticas, stock_por_almacen, movimientos_recientes, productos_mas_movidos]);

    /**
     * Filtrar movimientos válidos (que tengan producto y almacén)
     * Limitar a los últimos N movimientos
     */
    const movimientosRecientes = useMemo(() => {
        return data.movimientosRecientes
            .filter(m => m.stockProducto?.producto && m.stockProducto?.almacen)
            .slice(0, 5); // DASHBOARD_CONSTANTS.ITEMS_MOVIMIENTOS_RECIENTES
    }, [data.movimientosRecientes]);

    /**
     * Limitar productos más movidos a los top N
     */
    const productosMasMovidos = useMemo(() => {
        return data.productosMasMovidos.slice(0, 5); // DASHBOARD_CONSTANTS.ITEMS_PRODUCTOS_MAS_MOVIDOS
    }, [data.productosMasMovidos]);

    return {
        data,
        movimientosRecientes,
        productosMasMovidos,
    };
}
