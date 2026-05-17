/**
 * Dashboard específico para Preventista
 * Muestra información de clientes, ventas y comisiones
 */

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { MetricCard } from '@/presentation/components/dashboard/metric-card';

interface PreventistaDashboardProps {
    datosPrventista: {
        clientes_asignados: number;
        ventas_mes: number;
        comision_generada: number;
        proformas_pendientes: number;
    };
    periodo: string;
    titulo: string;
    descripcion: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Preventista',
        href: '/preventista/dashboard',
    },
    {
        title: 'Dashboard',
        href: '/preventista/dashboard',
    },
];

export default function PreventistaDashboard({
    datosPrventista,
    titulo = 'Dashboard Preventista',
    descripcion = 'Resumen de clientes, ventas y comisiones',
}: PreventistaDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Preventista" />

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
                </div>

                {/* Métricas principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Clientes Asignados"
                        value={datosPrventista.clientes_asignados}
                        subtitle="en mi cartera"
                        icon={Users}
                        loading={false}
                    />
                    <MetricCard
                        title="Ventas Este Mes"
                        value={datosPrventista.ventas_mes}
                        subtitle="monto total"
                        icon={TrendingUp}
                        loading={false}
                    />
                    <MetricCard
                        title="Comisión Generada"
                        value={datosPrventista.comision_generada}
                        subtitle="comisión del mes"
                        icon={DollarSign}
                        loading={false}
                    />
                    <MetricCard
                        title="Proformas Pendientes"
                        value={datosPrventista.proformas_pendientes}
                        subtitle="sin aprobar"
                        icon={FileText}
                        loading={false}
                    />
                </div>

                {/* Información adicional */}
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                    <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Accesos Rápidos
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <a
                            href="/clientes"
                            className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                Mis Clientes
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Ver y gestionar clientes asignados
                            </p>
                        </a>
                        <a
                            href="/proformas"
                            className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                Proformas
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Crear y seguimiento de proformas
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
