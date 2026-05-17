/**
 * Dashboard específico para Chofer
 * Muestra rutas, entregas y información de logística
 */

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Navigation,
    CheckCircle,
    Clock,
    Truck,
} from 'lucide-react';

import { MetricCard } from '@/presentation/components/dashboard/metric-card';

interface ChoferDashboardProps {
    datosChofer: {
        rutas_hoy: number;
        entregas_completadas: number;
        entregas_pendientes: number;
        km_recorridos: number;
        ultima_ruta: any | null;
    };
    periodo: string;
    titulo: string;
    descripcion: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chofer',
        href: '/chofer/dashboard',
    },
    {
        title: 'Dashboard',
        href: '/chofer/dashboard',
    },
];

export default function ChoferDashboard({
    datosChofer,
    periodo = 'hoy',
    titulo = 'Dashboard Chofer',
    descripcion = 'Resumen de rutas y entregas asignadas',
}: ChoferDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Chofer" />

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
                        title="Rutas Hoy"
                        value={datosChofer.rutas_hoy}
                        subtitle="rutas asignadas"
                        icon={Truck}
                        loading={false}
                    />
                    <MetricCard
                        title="Entregas Completadas"
                        value={datosChofer.entregas_completadas}
                        subtitle="completadas"
                        icon={CheckCircle}
                        loading={false}
                    />
                    <MetricCard
                        title="Entregas Pendientes"
                        value={datosChofer.entregas_pendientes}
                        subtitle="aún por entregar"
                        icon={Clock}
                        loading={false}
                    />
                    <MetricCard
                        title="Km Recorridos"
                        value={datosChofer.km_recorridos}
                        subtitle="kilómetros"
                        icon={Navigation}
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
                            href="/logistica/entregas-asignadas"
                            className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                Mis Entregas Asignadas
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Ver todas las entregas asignadas para hoy
                            </p>
                        </a>
                        <a
                            href="/logistica/entregas-en-transito"
                            className="rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                En Tránsito
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Entregas actualmente en tránsito
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
