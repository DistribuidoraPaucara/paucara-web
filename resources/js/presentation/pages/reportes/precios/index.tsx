import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { PreciosPageProps } from '@/domain/entities/reportes';
import { usePreciosFilters } from '@/application/hooks/usePreciosFilters';
import { PreciosEstadisticasCard } from './components/PreciosEstadisticasCard';
import { PreciosFiltrosCard } from './components/PreciosFiltrosCard';
import { PreciosTable } from './components/PreciosTable';
import { Button } from '@/presentation/components/ui/button';

export default function ReportePreciosIndex({
  precios,
  estadisticas,
  filtros,
  tipos_precio,
  categorias
}: PreciosPageProps) {
  const { formData, handleFilter, clearFilters, updateField, getExportParams, ALL_VALUE } = usePreciosFilters(filtros);

  const handleExport = () => {
    const params = getExportParams();
    window.open('/reportes/precios/export?' + new URLSearchParams(params).toString());
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Reportes', href: '#' },
      { title: 'Precios', href: '#' }
    ]}>
      <Head title="Reporte de Precios" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reporte de Precios</h1>
            <p className="text-gray-600 dark:text-gray-400">Análisis detallado de precios por producto y tipo</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </Button>

            <Button asChild>
              <Link href="/reportes/ganancias">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Ver Ganancias
              </Link>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <PreciosEstadisticasCard estadisticas={estadisticas} />

        {/* Filtros */}
        <PreciosFiltrosCard
          formData={formData}
          tipos_precio={tipos_precio}
          categorias={categorias}
          ALL_VALUE={ALL_VALUE}
          onUpdateField={updateField}
          onFilter={handleFilter}
          onClear={clearFilters}
        />

        {/* Tabla de Precios */}
        <PreciosTable precios={precios} />
      </div>
    </AppLayout>
  );
}
