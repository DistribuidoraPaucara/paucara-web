import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { StockPageProps } from '@/domain/entities/reportes';
import { useStockRealTimeSearch } from '@/application/hooks/useStockRealTimeSearch';
import { StockEstadisticasCard } from './stock-actual/components/StockEstadisticasCard';
import { StockFiltrosCard } from './stock-actual/components/StockFiltrosCard';
import { StockTable } from './stock-actual/components/StockTable';
import { ExportButtons } from './stock-actual/components/ExportButtons';
import { useState, useEffect } from 'react';

interface ReporteProps extends StockPageProps {
  marcas?: { id: number; nombre: string }[];
}

export default function ReporteStockActual({
    stock,
    estadisticas,
    filtros,
    almacenes,
    categorias,
    marcas = []
}: ReporteProps) {
    const { filters, results, isLoading, updateFilters, goToPage, changePerPage, clearFilters } = useStockRealTimeSearch(300);
    const [displayStock, setDisplayStock] = useState(stock);

    // Actualizar displayStock cuando results cambia
    useEffect(() => {
        if (results?.data) {
            setDisplayStock({
                ...stock,
                data: results.data,
                total: results.pagination.total,
                per_page: results.pagination.per_page,
                current_page: results.pagination.current_page,
                last_page: results.pagination.last_page,
            });
        }
    }, [results]);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Reportes', href: '#' },
            { title: 'Stock Actual', href: '#' }
        ]}>
            <Head title="Reporte de Stock Actual" />

            <div className="space-y-6 p-4">
                {/* Header con Botones de Descarga */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reporte de Stock Actual</h1>
                        <p className="text-muted-foreground">
                            Visualiza el estado actual del inventario por almacén
                        </p>
                    </div>
                    {/* ✅ NUEVO: Botones de descarga */}
                    <ExportButtons
                        reportType="stock-actual"
                        filters={filters}
                    />
                </div>

                {/* Estadísticas */}
                {/* <StockEstadisticasCard estadisticas={estadisticas} /> */}

                {/* Filtros */}
                <StockFiltrosCard
                    filters={filters}
                    almacenes={almacenes}
                    categorias={categorias}
                    marcas={marcas}
                    onUpdateField={updateFilters}
                    onClear={clearFilters}
                    isLoading={isLoading}
                />

                {/* Tabla de Stock */}
                <StockTable
                    stock={displayStock}
                    isLoading={isLoading}
                    onPageChange={goToPage}
                    onPerPageChange={changePerPage}
                />
            </div>
        </AppLayout>
    );
}
