import { useMemo } from 'react';

/**
 * Hook para determinar qué widgets renderizar en el dashboard
 * Basado en los módulos y widgets permitidos del usuario
 *
 * Uso:
 * const { widgetsAMostrar, modulosPermitidos } = useDashboardWidgets(datosModulos);
 */

export interface DashboardWidget {
    id: string;
    titulo: string;
    modulo: string;
    componente: string;
    gridSize?: 'full' | '1/2' | '1/3' | '1/4';
    orden?: number;
}

interface UseDashboardWidgetsProps {
    modulosPermitidos?: string[];
    widgetsAMostrar?: Record<string, string[]>;
    datosModulos?: Record<string, any>;
}

/**
 * Mapeo de componentes de widgets
 * Cada widget tiene un componente asociado
 */
const WIDGET_COMPONENTS: Record<string, DashboardWidget> = {
    'metricas_principales': {
        id: 'metricas_principales',
        titulo: 'Métricas Principales',
        modulo: 'general',
        componente: 'MetricasPrincipales',
        gridSize: 'full',
        orden: 1,
    },
    'metricas_secundarias': {
        id: 'metricas_secundarias',
        titulo: 'Métricas Secundarias',
        modulo: 'general',
        componente: 'MetricasSecundarias',
        gridSize: 'full',
        orden: 2,
    },
    'grafico_ventas': {
        id: 'grafico_ventas',
        titulo: 'Evolución de Ventas',
        modulo: 'general',
        componente: 'GraficoVentas',
        gridSize: 'full',
        orden: 3,
    },
    'ventas_por_canal': {
        id: 'ventas_por_canal',
        titulo: 'Ventas por Canal',
        modulo: 'general',
        componente: 'VentasPorCanal',
        gridSize: '1/2',
        orden: 4,
    },
    'productos_mas_vendidos': {
        id: 'productos_mas_vendidos',
        titulo: 'Productos Más Vendidos',
        modulo: 'general',
        componente: 'ProductosMasVendidos',
        gridSize: '1/2',
        orden: 5,
    },
    'alertas_stock': {
        id: 'alertas_stock',
        titulo: 'Alertas de Stock',
        modulo: 'general',
        componente: 'AlertasStock',
        gridSize: 'full',
        orden: 6,
    },
    // Widgets de COMPRAS
    'metricas_compras': {
        id: 'metricas_compras',
        titulo: 'Métricas de Compras',
        modulo: 'compras',
        componente: 'MetricasCompras',
        gridSize: 'full',
        orden: 1,
    },
    'grafico_compras': {
        id: 'grafico_compras',
        titulo: 'Evolución de Compras',
        modulo: 'compras',
        componente: 'GraficoCompras',
        gridSize: 'full',
        orden: 2,
    },
    'cuentas_por_pagar': {
        id: 'cuentas_por_pagar',
        titulo: 'Cuentas por Pagar',
        modulo: 'compras',
        componente: 'CuentasPagar',
        gridSize: '1/2',
        orden: 3,
    },
    'pagos_realizados': {
        id: 'pagos_realizados',
        titulo: 'Pagos Realizados',
        modulo: 'compras',
        componente: 'PagosRealizados',
        gridSize: '1/2',
        orden: 3,
    },
    'lotes_proximos_vencer': {
        id: 'lotes_proximos_vencer',
        titulo: 'Lotes Próximos a Vencer',
        modulo: 'compras',
        componente: 'LotesProximosVencer',
        gridSize: 'full',
        orden: 4,
    },
    // Widgets de LOGÍSTICA
    'metricas_logistica': {
        id: 'metricas_logistica',
        titulo: 'Métricas de Logística',
        modulo: 'logistica',
        componente: 'MetricasLogistica',
        gridSize: 'full',
        orden: 1,
    },
    'rutas_del_dia': {
        id: 'rutas_del_dia',
        titulo: 'Rutas del Día',
        modulo: 'logistica',
        componente: 'RutasDelDia',
        gridSize: 'full',
        orden: 2,
    },
    'envios_activos': {
        id: 'envios_activos',
        titulo: 'Envíos Activos',
        modulo: 'logistica',
        componente: 'EnviosActivos',
        gridSize: 'full',
        orden: 3,
    },
    // Widgets de INVENTARIO
    'metricas_inventario': {
        id: 'metricas_inventario',
        titulo: 'Métricas de Inventario',
        modulo: 'inventario',
        componente: 'MetricasInventario',
        gridSize: 'full',
        orden: 1,
    },
    // Widgets de CONTABILIDAD
    'saldo_caja': {
        id: 'saldo_caja',
        titulo: 'Saldo en Caja',
        modulo: 'contabilidad',
        componente: 'SaldoCaja',
        gridSize: 'full',
        orden: 1,
    },
    'movimientos_caja': {
        id: 'movimientos_caja',
        titulo: 'Movimientos de Caja',
        modulo: 'contabilidad',
        componente: 'MovimientosCaja',
        gridSize: 'full',
        orden: 2,
    },
};

/**
 * Hook principal para usar en el dashboard
 */
export function useDashboardWidgets({
    modulosPermitidos = [],
    widgetsAMostrar = {},
    datosModulos = {},
}: UseDashboardWidgetsProps) {
    // Procesar widgets a mostrar en orden
    const widgetsOrdenados = useMemo(() => {
        const widgets: DashboardWidget[] = [];

        // Para cada módulo permitido
        for (const modulo of modulosPermitidos) {
            const widgetsDelModulo = widgetsAMostrar[modulo] || [];

            // Añadir cada widget del módulo
            for (const widgetId of widgetsDelModulo) {
                const widget = WIDGET_COMPONENTS[widgetId];
                if (widget) {
                    widgets.push(widget);
                }
            }
        }

        // Ordenar por orden de prioridad
        return widgets.sort((a, b) => (a.orden || 99) - (b.orden || 99));
    }, [modulosPermitidos, widgetsAMostrar]);

    // Agrupar widgets por módulo para renderizarlos con headers
    const widgetsAgrupados = useMemo(() => {
        const agrupados: Record<string, DashboardWidget[]> = {};

        for (const modulo of modulosPermitidos) {
            agrupados[modulo] = widgetsOrdenados.filter(w => w.modulo === modulo);
        }

        return agrupados;
    }, [widgetsOrdenados, modulosPermitidos]);

    // Obtener datos para un widget específico
    const getDatosWidget = (widgetId: string): any => {
        const widget = WIDGET_COMPONENTS[widgetId];
        if (!widget) return null;

        return datosModulos[widget.modulo]?.[widgetId] || null;
    };

    return {
        widgetsOrdenados,
        widgetsAgrupados,
        getDatosWidget,
        modulosPermitidos,
        totalWidgets: widgetsOrdenados.length,
    };
}

/**
 * Hook auxiliar para verificar si mostrar un widget específico
 */
export function useShowWidget(widgetId: string, modulosPermitidos: string[]): boolean {
    const widget = WIDGET_COMPONENTS[widgetId];
    if (!widget) return false;
    return modulosPermitidos.includes(widget.modulo);
}

/**
 * Hook para obtener clase de grid CSS según tamaño del widget
 */
export function useWidgetGridClass(gridSize?: string): string {
    switch (gridSize) {
        case 'full':
            return 'lg:col-span-2';
        case '1/2':
            return 'lg:col-span-1';
        case '1/3':
            return 'lg:col-span-2/3';
        case '1/4':
            return 'lg:col-span-1/2';
        default:
            return 'lg:col-span-1';
    }
}
