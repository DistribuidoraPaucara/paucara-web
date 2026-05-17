import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import FiltrosComprasComponent from '@/presentation/components/compras/filtros-compras';
import EstadisticasComprasComponent from '@/presentation/components/compras/estadisticas-compras';
import TablaCompras from '@/presentation/components/compras/tabla-compras';
import { ImprimirComprasButton } from '@/presentation/components/impresion/ImprimirComprasButton';
import { Plus } from 'lucide-react';

// Importar tipos del domain
import type {
  Compra,
  FiltrosCompras,
  EstadisticasCompras,
  DatosParaFiltrosCompras
} from '@/domain/entities/compras';
import type { Pagination } from '@/domain/entities/shared';

interface PageProps extends InertiaPageProps {
  compras: Pagination<Compra>;
  filtros: FiltrosCompras;
  estadisticas: EstadisticasCompras;
  datosParaFiltros: DatosParaFiltrosCompras;
}

export default function ComprasIndex() {
  const { props } = usePage<PageProps>();
  const { can } = useAuth();

  const compras = props.compras;
  const filtros = props.filtros || {};
  const estadisticas = props.estadisticas;
  const datosParaFiltros = props.datosParaFiltros;

  return (
    <AppLayout breadcrumbs={[{ title: 'Compras', href: '/compras' }]}>
      <Head title="Compras" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Compras</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {compras.total > 0
                ? `${compras.from}-${compras.to} de ${compras.total} compras`
                : 'No se encontraron compras'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {compras.data && compras.data.length > 0 && (
              <ImprimirComprasButton
                compras={compras.data}
                filtros={filtros}
              />
            )}
            {can('compras.create') && (
              <Link
                href="/compras/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva compra
              </Link>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <EstadisticasComprasComponent estadisticas={estadisticas} />
        )}

        {/* Filtros */}
        <FiltrosComprasComponent
          filtros={filtros}
          datosParaFiltros={datosParaFiltros}
        />

        {/* Tabla de Compras */}
        <TablaCompras
          compras={compras.data}
          sortBy={filtros.sort_by}
          sortDir={filtros.sort_dir}
        />

        {/* Paginación */}
        {compras.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {compras.from} a {compras.to} de {compras.total} resultados
            </div>
            <div className="flex space-x-1">
              {compras.links?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${link.active
                    ? 'bg-blue-600 text-white'
                    : link.url
                      ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                    }`}
                  preserveState
                  replace
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
