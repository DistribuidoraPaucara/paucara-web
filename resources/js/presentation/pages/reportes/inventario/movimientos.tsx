import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { MovimientosPageProps } from '@/domain/entities/reportes';
import { useMovimientosFilters } from '@/application/hooks/useMovimientosFilters';
import { MovimientosEstadisticasCard } from './movimientos/components/MovimientosEstadisticasCard';
import { MovimientosFiltrosCard } from './movimientos/components/MovimientosFiltrosCard';
import { MovimientosTable } from './movimientos/components/MovimientosTable';
import { ExportButtons } from './stock-actual/components/ExportButtons';

export default function ReporteMovimientos({
    movimientos,
    estadisticas,
    filtros,
    tipos,
    almacenes
}: MovimientosPageProps) {
    const { formData, handleFilter, clearFilters, updateField, ALL_VALUE } = useMovimientosFilters(filtros);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Reportes', href: '#' },
            { title: 'Movimientos', href: '#' }
        ]}>
            <Head title="Reporte de Movimientos de Inventario" />

            <div className="space-y-6 p-4">
                {/* Header con Botones de Descarga */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reporte de Movimientos</h1>
                        <p className="text-muted-foreground">
                            Historial detallado de movimientos de inventario
                        </p>
                    </div>
                    {/* ✅ NUEVO: Botones de descarga */}
                    <ExportButtons
                        reportType="movimientos"
                        filters={formData}
                    />
                </div>

                {/* Estadísticas */}
                <MovimientosEstadisticasCard estadisticas={estadisticas} />

                {/* Filtros */}
                <MovimientosFiltrosCard
                    formData={formData}
                    tipos={tipos}
                    almacenes={almacenes}
                    ALL_VALUE={ALL_VALUE}
                    onUpdateField={updateField}
                    onFilter={handleFilter}
                    onClear={clearFilters}
                />

                {/* Tabla de Movimientos */}
                <MovimientosTable movimientos={movimientos} tipos={tipos} />
            </div>
        </AppLayout>
    );
}
