import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Wallet,
    Users,
    FileText,
    Activity,
    RefreshCw
} from 'lucide-react';
import { useDashboardWebSocket } from '@/application/hooks/use-dashboard-websocket';
import { useProformaNotifications } from '@/application/hooks/use-proforma-notifications';
import { Button } from '@/presentation/components/ui/button';

// Componentes del dashboard
import { MetricCard } from '@/presentation/components/dashboard/metric-card';
import { ChartWrapper } from '@/presentation/components/dashboard/chart-wrapper';
import { AlertasStock } from '@/presentation/components/dashboard/alertas-stock';
import { ProductosMasVendidos } from '@/presentation/components/dashboard/productos-mas-vendidos';
import { PeriodSelector } from '@/presentation/components/dashboard/period-selector';

interface DashboardProps {
    metricas: {
        ventas: {
            total: number;
            cantidad: number;
            promedio: number;
            cambio_porcentual: number;
        };
        compras: {
            total: number;
            cantidad: number;
            promedio: number;
            cambio_porcentual: number;
        };
        inventario: {
            total_productos: number;
            stock_total: number;
            valor_inventario: number;
            productos_sin_stock: number;
        };
        caja: {
            ingresos: number;
            egresos: number;
            saldo: number;
            total_movimientos: number;
        };
        clientes: {
            total: number;
            nuevos: number;
            activos: number;
            con_credito: number;
        };
        proformas: {
            total: number;
            aprobadas: number;
            pendientes: number;
            tasa_aprobacion: number;
        };
    };
    graficoVentas: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            tension?: number;
            yAxisID?: string;
        }>;
    };
    productosMasVendidos: Array<{
        nombre: string;
        total_vendido: number;
        ingresos_total: number;
    }>;
    alertasStock: {
        stock_bajo: number;
        stock_critico: number;
        productos_afectados: Array<{
            producto: string;
            almacen: string;
            cantidad_actual: number;
            stock_minimo: number;
        }>;
    };
    ventasPorCanal: Record<string, {
        total: number;
        monto: number;
    }>;
    periodo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    metricas: initialMetricas,
    graficoVentas,
    productosMasVendidos,
    alertasStock,
    ventasPorCanal,
    periodo: initialPeriodo,
}: DashboardProps) {
    const [periodo, setPeriodo] = useState(initialPeriodo || 'mes_actual');
    const [loading, setLoading] = useState(false);

    // Hook para WebSocket - maneja actualizaciones en tiempo real
    const { metricas, lastUpdate, isRefreshing, refresh } = useDashboardWebSocket(initialMetricas);

    // Hook para notificaciones de proformas en tiempo real
    const { unreadCount, requestNotificationPermission } = useProformaNotifications();

    // Solicitar permisos de notificación al cargar
    useEffect(() => {
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    // Valores por defecto para evitar errores de undefined
    const defaultMetricas = {
        ventas: { total: 0, cantidad: 0, promedio: 0, cambio_porcentual: 0 },
        compras: { total: 0, cantidad: 0, promedio: 0, cambio_porcentual: 0 },
        inventario: { total_productos: 0, stock_total: 0, valor_inventario: 0, productos_sin_stock: 0 },
        caja: { ingresos: 0, egresos: 0, saldo: 0, total_movimientos: 0 },
        clientes: { total: 0, nuevos: 0, activos: 0, con_credito: 0 },
        proformas: { total: 0, aprobadas: 0, pendientes: 0, tasa_aprobacion: 0 },
    };

    const defaultGraficoVentas = {
        labels: [],
        datasets: [],
    };

    // Merge con valores por defecto para garantizar estructura completa
    const safeMetricas = {
        ...defaultMetricas,
        ...(metricas || {}),
        ventas: { ...defaultMetricas.ventas, ...(metricas?.ventas || {}) },
        compras: { ...defaultMetricas.compras, ...(metricas?.compras || {}) },
        inventario: { ...defaultMetricas.inventario, ...(metricas?.inventario || {}) },
        caja: { ...defaultMetricas.caja, ...(metricas?.caja || {}) },
        clientes: { ...defaultMetricas.clientes, ...(metricas?.clientes || {}) },
        proformas: { ...defaultMetricas.proformas, ...(metricas?.proformas || {}) },
    };

    const safeGraficoVentas = { ...defaultGraficoVentas, ...(graficoVentas || {}) };
    const safeProductosMasVendidos = productosMasVendidos || [];
    const safeAlertasStock = {
        stock_bajo: alertasStock?.stock_bajo ?? 0,
        stock_critico: alertasStock?.stock_critico ?? 0,
        productos_afectados: alertasStock?.productos_afectados ?? [],
    };
    const safeVentasPorCanal = ventasPorCanal || {};

    const handlePeriodChange = (newPeriod: string) => {
        setPeriodo(newPeriod);
        setLoading(true);

        router.get(dashboard().url, { periodo: newPeriod }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    // Preparar datos para el gráfico de ventas por canal
    const ventasPorCanalData = {
        labels: Object.keys(safeVentasPorCanal),
        datasets: [{
            data: Object.values(safeVentasPorCanal).map(canal => canal.monto),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)',
            ],
            borderWidth: 0,
        }],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Resumen general de tu empresa
                        </p>
                        {lastUpdate && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                Actualizado: {lastUpdate.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refresh}
                            disabled={isRefreshing}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <PeriodSelector
                            value={periodo}
                            onChange={handlePeriodChange}
                        />
                    </div>
                </div>

                {/* Métricas principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Ventas Totales"
                        value={safeMetricas.ventas.total}
                        subtitle={`${safeMetricas.ventas.cantidad} ventas`}
                        change={safeMetricas.ventas.cambio_porcentual}
                        icon={DollarSign}
                        loading={loading}
                    />
                    <MetricCard
                        title="Compras Totales"
                        value={safeMetricas.compras.total}
                        subtitle={`${safeMetricas.compras.cantidad} compras`}
                        change={safeMetricas.compras.cambio_porcentual}
                        icon={ShoppingCart}
                        loading={loading}
                    />
                    <MetricCard
                        title="Valor Inventario"
                        value={safeMetricas.inventario.valor_inventario}
                        subtitle={`${safeMetricas.inventario.total_productos} productos`}
                        icon={Package}
                        loading={loading}
                    />
                    <MetricCard
                        title="Saldo en Caja"
                        value={safeMetricas.caja.saldo}
                        subtitle={`${safeMetricas.caja.total_movimientos} movimientos`}
                        change={
                            safeMetricas.caja.ingresos === 0 && safeMetricas.caja.egresos === 0 ? 0 :
                                safeMetricas.caja.ingresos > safeMetricas.caja.egresos ?
                                    safeMetricas.caja.ingresos > 0 ? ((safeMetricas.caja.ingresos - safeMetricas.caja.egresos) / safeMetricas.caja.ingresos) * 100 : 0 :
                                    safeMetricas.caja.egresos > 0 ? -((safeMetricas.caja.egresos - safeMetricas.caja.ingresos) / safeMetricas.caja.egresos) * 100 : 0
                        }
                        icon={Wallet}
                        loading={loading}
                    />
                </div>                {/* Métricas secundarias */}
                <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard
                        title="Clientes Activos"
                        value={safeMetricas.clientes.activos}
                        subtitle={`${safeMetricas.clientes.nuevos} nuevos`}
                        icon={Users}
                        loading={loading}
                    />
                    <MetricCard
                        title="Proformas Aprobadas"
                        value={`${safeMetricas.proformas.tasa_aprobacion}%`}
                        subtitle={`${safeMetricas.proformas.aprobadas}/${safeMetricas.proformas.total} total`}
                        icon={FileText}
                        loading={loading}
                    />
                    <MetricCard
                        title="Stock Total"
                        value={safeMetricas.inventario.stock_total}
                        subtitle={`${safeMetricas.inventario.productos_sin_stock} sin stock`}
                        icon={Activity}
                        loading={loading}
                    />
                </div>

                {/* Gráficos y datos detallados */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Gráfico de ventas */}
                    <ChartWrapper
                        title="Evolución de Ventas"
                        type="line"
                        data={safeGraficoVentas}
                        loading={loading}
                        className="lg:col-span-2"
                    />

                    {/* Ventas por canal */}
                    <ChartWrapper
                        title="Ventas por Canal"
                        type="doughnut"
                        data={ventasPorCanalData}
                        loading={loading}
                        height={250}
                    />

                    {/* Productos más vendidos */}
                    <ProductosMasVendidos
                        productos={safeProductosMasVendidos}
                        loading={loading}
                    />
                </div>

                {/* Alertas de stock */}
                <AlertasStock
                    alertas={safeAlertasStock}
                    loading={loading}
                />
            </div>
        </AppLayout>
    );
}
