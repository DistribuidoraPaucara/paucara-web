import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import {
    KPICard,
    EstadoBadge,
    VencimientoIndicator,
    UrgencyBadge,
    DistributionChart,
} from '@/presentation/components/prestamos';

interface PrestamoResumen {
    id: number;
    cliente_nombre?: string;
    proveedor_nombre?: string;
    monto_garantia: number;
    fecha_esperada_devolucion: string;
    estado: 'ACTIVO' | 'PARCIALMENTE_DEVUELTO' | 'COMPLETAMENTE_DEVUELTO' | 'CANCELADO';
    dias_vencidos: number;
    tipo: 'cliente' | 'proveedor';
}

interface DashboardPrestamosProps {
    resumen: {
        prestamos_clientes_activos: number;
        prestamos_proveedores_activos: number;
        total_prestado_clientes: number;
        total_deuda_proveedores: number;
        devoluciones_vencidas: number;
        devoluciones_proximas_vencer: number;
    };
    distribucion: {
        disponible: number;
        en_prestamo: number;
        vendido: number;
        deuda_proveedores: number;
    };
    prestamos_vencidos: PrestamoResumen[];
    prestamos_proximos_vencer: PrestamoResumen[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Préstamos',
        href: '/prestamos',
    },
    {
        title: 'Dashboard',
        href: '#',
    },
];

export default function DashboardPrestamos({
    resumen,
    distribucion,
    prestamos_vencidos,
    prestamos_proximos_vencer,
}: DashboardPrestamosProps) {
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        router.reload({
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Préstamos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Dashboard de Préstamos
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Resumen general de préstamos a clientes y proveedores
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <Link href="/prestamos/clientes">
                        <Button size="lg" className="gap-2">
                            Préstamos a Clientes
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/prestamos/proveedores">
                        <Button size="lg" variant="outline" className="gap-2">
                            Préstamos en Compras
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/prestamos/stock">
                        <Button size="lg" variant="outline" className="gap-2">
                            Ver Stock
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    {/* enlace a prestamos/prestables */}
                    <Link href="/prestamos/prestables">
                        <Button size="lg" variant="outline" className="gap-2">
                            Gestionar Productos de Prestamos
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* KPIs Principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/prestamos/clientes">
                        <KPICard
                            title="Préstamos Clientes"
                            value={resumen.prestamos_clientes_activos}
                            icon="👥"
                            color="blue"
                            subtitle="Activos"
                            trend={{
                                value: 12,
                                direction: 'up',
                            }}
                            className="cursor-pointer"
                        />
                    </Link>

                    <Link href="/prestamos/proveedores">
                        <KPICard
                            title="Préstamos Proveedores"
                            value={resumen.prestamos_proveedores_activos}
                            icon="🏭"
                            color="green"
                            subtitle="Activos"
                            className="cursor-pointer"
                        />
                    </Link>

                    <KPICard
                        title="Devoluciones Vencidas"
                        value={resumen.devoluciones_vencidas}
                        icon="⚠️"
                        color="red"
                        subtitle="Pendientes"
                        trend={{
                            value: 8,
                            direction: 'up',
                        }}
                    />

                    <KPICard
                        title="Próximas a Vencer"
                        value={resumen.devoluciones_proximas_vencer}
                        icon="🕐"
                        color="yellow"
                        subtitle="En 7 días"
                        className="cursor-pointer"
                    />
                </div>

                {/* Distribución y Métricas */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Gráfico de Distribución */}
                    <div className="lg:col-span-2">
                        <DistributionChart
                            disponible={distribucion.disponible}
                            enPrestamo={distribucion.en_prestamo}
                            vendido={distribucion.vendido}
                            deuda={distribucion.deuda_proveedores}
                            title="Distribución de Stock"
                            size="lg"
                        />
                    </div>

                    {/* Cards de Montantes */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                                Total Prestado a Clientes
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                                {resumen.total_prestado_clientes.toLocaleString('es-ES')}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                                Deuda con Proveedores
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                                {resumen.total_deuda_proveedores.toLocaleString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alertas y Listados */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Devoluciones Vencidas */}
                    <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Devoluciones Vencidas
                            </h2>
                            <span className="inline-block px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-xs font-semibold">
                                {prestamos_vencidos.length}
                            </span>
                        </div>

                        {prestamos_vencidos.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                ✅ No hay devoluciones vencidas
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {prestamos_vencidos.slice(0, 5).map((prestamo) => (
                                    <div
                                        key={`${prestamo.tipo}-${prestamo.id}`}
                                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                                    {prestamo.cliente_nombre || prestamo.proveedor_nombre}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    Vencido hace {prestamo.dias_vencidos} días
                                                </p>
                                            </div>
                                            <UrgencyBadge
                                                diasVencidos={prestamo.dias_vencidos}
                                                size="sm"
                                                variant="dot"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {prestamos_vencidos.length > 5 && (
                            <Link
                                href="/prestamos/alertas"
                                className="mt-4 flex items-center justify-center gap-2 p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                Ver todos ({prestamos_vencidos.length})
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>

                    {/* Próximos a Vencer */}
                    <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-yellow-500" />
                                Próximos a Vencer
                            </h2>
                            <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 text-xs font-semibold">
                                {prestamos_proximos_vencer.length}
                            </span>
                        </div>

                        {prestamos_proximos_vencer.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                ✅ No hay préstamos próximos a vencer
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {prestamos_proximos_vencer.slice(0, 5).map((prestamo) => (
                                    <div
                                        key={`${prestamo.tipo}-${prestamo.id}`}
                                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                                    {prestamo.cliente_nombre || prestamo.proveedor_nombre}
                                                </p>
                                                <div className="mt-1">
                                                    <VencimientoIndicator
                                                        fechaEsperada={prestamo.fecha_esperada_devolucion}
                                                        showLabel={false}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                            <EstadoBadge
                                                estado={prestamo.estado}
                                                size="sm"
                                                variant="inline"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {prestamos_proximos_vencer.length > 5 && (
                            <Link
                                href="/prestamos/alertas"
                                className="mt-4 flex items-center justify-center gap-2 p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                Ver todos ({prestamos_proximos_vencer.length})
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>

                
            </div>
        </AppLayout>
    );
}
