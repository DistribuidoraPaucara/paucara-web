import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import { useCajaWarning } from '@/application/hooks/use-caja-warning';
import FiltrosVentasComponent from '@/presentation/components/ventas/filtros-ventas';
import EstadisticasVentasComponent from '@/presentation/components/ventas/estadisticas-ventas';
import TablaVentas from '@/presentation/components/ventas/tabla-ventas';
import { AlertSinCaja } from '@/presentation/components/cajas/alert-sin-caja';
import { ImprimirVentasButton } from '@/presentation/components/impresion/ImprimirVentasButton';
import { Plus } from 'lucide-react';

// Importar tipos del domain
import type {
    Venta,
    FiltrosVentas,
    EstadisticasVentas,
    DatosParaFiltrosVentas
} from '@/domain/entities/ventas';
import type { Pagination } from '@/domain/entities/shared';

interface PageProps extends InertiaPageProps {
    ventas: Pagination<Venta>;
    filtros: FiltrosVentas;
    estadisticas: EstadisticasVentas;
    datosParaFiltros?: DatosParaFiltrosVentas;
}

export default function VentasIndex() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();
    const { shouldShowBanner } = useCajaWarning();

    const ventas = props.ventas;
    console.log('🚀 ~ file: index.tsx:26 ~ VentasIndex ~ ventas:', ventas);
    const filtros = props.filtros || {};
    const estadisticas = props.estadisticas;
    const datosParaFiltros = props.datosParaFiltros || {
        clientes: [],
        estados_documento: [],
        monedas: [],
        usuarios: []
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Ventas', href: '/ventas' }]}>
            <Head title="Ventas" />

            <div className="space-y-6 p-3">
                {/* Banner de advertencia - caja sin abrir */}
                {shouldShowBanner && (
                    <div className="mb-4">
                        <AlertSinCaja
                            onAbrir={() => router.visit('/cajas')}
                            onVerCajas={() => router.visit('/cajas')}
                        />
                    </div>
                )}

                {/* Alertas de stock bajo */}
                {/* <StockBajoAlerts /> */}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Ventas</h1>
                        <div className="mt-2 space-y-1">
                            <p className="text-gray-600 dark:text-gray-400">
                                {ventas.total > 0
                                    ? `${ventas.from}-${ventas.to} de ${ventas.total} ventas`
                                    : 'No se encontraron ventas'
                                }
                            </p>
                            {ventas.total > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    📄 Página {ventas.current_page} de {ventas.last_page} ({ventas.per_page} por página)
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {ventas.data && ventas.data.length > 0 && (
                            <ImprimirVentasButton
                                ventas={ventas.data}
                                filtros={filtros}
                            />
                        )}
                        {can('ventas.create') && (
                            <Link
                                href="/ventas/create"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva venta
                            </Link>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                {estadisticas && estadisticas.total_ventas !== undefined && (
                    <EstadisticasVentasComponent estadisticas={estadisticas} />
                )}

                {/* Filtros */}
                <FiltrosVentasComponent
                    filtros={filtros}
                    datosParaFiltros={datosParaFiltros}
                />

                {/* Tabla de ventas */}
                <TablaVentas
                    ventas={ventas}
                    filtros={filtros}
                />
            </div>
        </AppLayout>
    );
}
