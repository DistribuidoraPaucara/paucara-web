/**
 * Dashboard Administrativo
 * Resumen completo del sistema con todas las métricas
 */

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Wallet,
    Users,
    FileText,
    Activity
} from 'lucide-react';

import { MetricCard } from '@/presentation/components/dashboard/metric-card';
import { ChartWrapper } from '@/presentation/components/dashboard/chart-wrapper';
import { AlertasStock } from '@/presentation/components/dashboard/alertas-stock';
import { ProductosMasVendidos } from '@/presentation/components/dashboard/productos-mas-vendidos';
import { PeriodSelector } from '@/presentation/components/dashboard/period-selector';
import { AlertCircle, TrendingDown } from 'lucide-react';

interface AdminDashboardProps {
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
    cuentasVencidas?: Array<{
        id: number;
        cliente_nombre: string;
        saldo_pendiente: number;
        dias_vencido: number;
        fecha_vencimiento: string;
        referencia_documento: string;
        estado: string;
    }>;
    totalCuentasVencidas?: number;
    totalMontoVencido?: number;
    periodo: string;
    titulo: string;
    descripcion: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({
    metricas,
    graficoVentas,
    productosMasVendidos,
    alertasStock,
    ventasPorCanal,
    cuentasVencidas = [],
    totalCuentasVencidas = 0,
    totalMontoVencido = 0,
    periodo: initialPeriodo = 'mes_actual',
    titulo = 'Dashboard Administrativo',
    descripcion = 'Resumen completo del sistema',
}: AdminDashboardProps) {
    const [periodo, setPeriodo] = useState(initialPeriodo);
    const [loading, setLoading] = useState(false);

    const defaultMetricas = {
        ventas: { total: 0, cantidad: 0, promedio: 0, cambio_porcentual: 0 },
        compras: { total: 0, cantidad: 0, promedio: 0, cambio_porcentual: 0 },
        inventario: { total_productos: 0, stock_total: 0, valor_inventario: 0, productos_sin_stock: 0 },
        caja: { ingresos: 0, egresos: 0, saldo: 0, total_movimientos: 0 },
        clientes: { total: 0, nuevos: 0, activos: 0, con_credito: 0 },
        proformas: { total: 0, aprobadas: 0, pendientes: 0, tasa_aprobacion: 0 },
    };

    const safeMetricas = {
        ...defaultMetricas,
        ventas: { ...defaultMetricas.ventas, ...metricas.ventas },
        compras: { ...defaultMetricas.compras, ...metricas.compras },
        inventario: { ...defaultMetricas.inventario, ...metricas.inventario },
        caja: { ...defaultMetricas.caja, ...metricas.caja },
        clientes: { ...defaultMetricas.clientes, ...metricas.clientes },
        proformas: { ...defaultMetricas.proformas, ...metricas.proformas },
    };

    const safeGraficoVentas = graficoVentas || { labels: [], datasets: [] };
    const safeProductosMasVendidos = productosMasVendidos || [];
    const safeAlertasStock = alertasStock || { stock_bajo: 0, stock_critico: 0, productos_afectados: [] };
    const safeVentasPorCanal = ventasPorCanal || {};

    const handlePeriodChange = (newPeriod: string) => {
        setPeriodo(newPeriod);
        setLoading(true);

        router.get('/admin/dashboard', { periodo: newPeriod }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const ventasPorCanalData = {
        labels: Object.keys(safeVentasPorCanal),
        datasets: [{
            data: Object.values(safeVentasPorCanal).map((canal: { total: number; monto: number }) => canal.monto),
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
            <Head title="Dashboard Administrativo" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {titulo}
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            {descripcion}
                        </p>
                    </div>
                    <PeriodSelector
                        value={periodo}
                        onChange={handlePeriodChange}
                    />
                </div>

                {/* Cuentas por Cobrar Vencidas */}
                {totalCuentasVencidas > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-950/20">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                                    🚨 Cuentas por Cobrar Vencidas
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                    Total: {totalCuentasVencidas} cuenta{totalCuentasVencidas !== 1 ? 's' : ''}
                                </p>
                                <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                                    Bs. {totalMontoVencido.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-amber-200 dark:border-amber-900/30">
                                        <th className="px-3 py-2 text-left font-medium text-amber-800 dark:text-amber-200">
                                            Cliente
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-amber-800 dark:text-amber-200">
                                            Referencia
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium text-amber-800 dark:text-amber-200">
                                            Saldo
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-amber-800 dark:text-amber-200">
                                            Días Vencido
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-amber-800 dark:text-amber-200">
                                            Fecha Vencimiento
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuentasVencidas.map((cuenta) => (
                                        <tr
                                            key={cuenta.id}
                                            className="border-b border-amber-100 hover:bg-amber-100/50 dark:border-amber-900/20 dark:hover:bg-amber-900/10"
                                        >
                                            <td className="px-3 py-3 font-medium text-amber-900 dark:text-amber-100">
                                                {cuenta.cliente_nombre}
                                            </td>
                                            <td className="px-3 py-3 text-amber-800 dark:text-amber-300">
                                                {cuenta.referencia_documento}
                                            </td>
                                            <td className="px-3 py-3 text-right font-semibold text-amber-900 dark:text-amber-100">
                                                Bs. {cuenta.saldo_pendiente.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span className={`inline-block rounded px-2 py-1 text-xs font-bold ${cuenta.dias_vencido > 30
                                                    ? 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                                    : cuenta.dias_vencido > 15
                                                        ? 'bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                                    }`}>
                                                    {cuenta.dias_vencido} días
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-amber-700 dark:text-amber-300">
                                                {cuenta.fecha_vencimiento}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {cuentasVencidas.length < totalCuentasVencidas && (
                            <div className="mt-4 text-center">
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Mostrando {cuentasVencidas.length} de {totalCuentasVencidas} cuentas. Ver todas en módulo de Cuentas por Cobrar.
                                </p>
                            </div>
                        )}
                    </div>
                )}

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
                </div>

                {/* Métricas secundarias */}
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
