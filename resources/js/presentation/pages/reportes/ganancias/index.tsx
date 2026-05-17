import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import type { GananciasPageProps } from '@/domain/entities/reportes';
import { useGananciasFilters } from '@/application/hooks/useGananciasFilters';
import { EstadisticasCard } from './components/EstadisticasCard';
import { FiltrosCard } from './components/FiltrosCard';
import { GananciasTable } from './components/GananciasTable';

export default function ReporteGananciasIndex({
  ganancias,
  estadisticas,
  filtros,
  tipos_precio,
  categorias,
  error
}: GananciasPageProps) {
  const { formData, handleFilter, clearFilters, updateField, ALL_VALUE } = useGananciasFilters(filtros);

  const handleExport = () => {
    const params = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== '')
    );
    window.open('/reportes/ganancias/export?' + new URLSearchParams(params).toString());
  };

  // Error state
  if (error) {
    return (
      <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reportes', href: '#' },
        { title: 'Ganancias', href: '#' }
      ]}>
        <Head title="Reporte de Ganancias" />

        <div className="space-y-6">
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6">
                <div className="text-red-600 dark:text-red-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error de Configuración</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-4">{error}</p>
                <Button asChild>
                  <Link href="/tipos-precio">
                    Configurar Tipos de Precio
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Reportes', href: '#' },
      { title: 'Ganancias', href: '#' }
    ]}>
      <Head title="Reporte de Ganancias" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reporte de Ganancias</h1>
            <p className="text-gray-600 dark:text-gray-400">Análisis de rentabilidad por producto y tipo de precio</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </Button>

            <Button asChild variant="outline">
              <Link href="/reportes/precios">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Ver Precios
              </Link>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <EstadisticasCard estadisticas={estadisticas} />

        {/* Filtros */}
        <FiltrosCard
          formData={formData}
          tipos_precio={tipos_precio}
          categorias={categorias}
          ALL_VALUE={ALL_VALUE}
          onUpdateField={updateField}
          onFilter={handleFilter}
          onClear={clearFilters}
        />

        {/* Tabla de Ganancias */}
        <GananciasTable ganancias={ganancias} />
      </div>
    </AppLayout>
  );
}
