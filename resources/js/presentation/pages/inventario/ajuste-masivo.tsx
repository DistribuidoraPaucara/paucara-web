import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import CargaMasivaAjustes from '@/presentation/components/Inventario/CargaMasivaAjustes';

// Domain types
import type { TipoAjusteInventario } from '@/domain/entities/tipos-ajuste-inventario';
import type { TipoMerma } from '@/domain/entities/tipo-merma';
import type { Almacen } from '@/domain/entities/almacenes';
import type { Producto, Proveedor, Cliente } from '@/domain/entities/recursos-inventario';

interface PageProps {
  productos: Producto[];
  tipos_ajuste: TipoAjusteInventario[];
  tipos_merma: TipoMerma[];
  almacenes: Almacen[];
  proveedores?: Proveedor[];
  clientes?: Cliente[];
}

const breadcrumbs = [
  {
    title: 'Inventario',
    href: '/inventario',
  },
  {
    title: 'Ajuste de Inventario',
    href: '/inventario/ajuste',
  },
  {
    title: 'Carga Masiva',
    href: '/inventario/ajuste-masivo',
  },
];

/**
 * Página de Carga Masiva de Ajustes de Inventario
 *
 * Presentación limpia que:
 * - Valida permisos
 * - Renderiza instrucciones
 * - Delega toda la lógica al componente CargaMasivaAjustes
 * - Muestra información de referencia (tipos, almacenes)
 */
export default function AjusteMasivo({
  productos,
  tipos_ajuste,
  tipos_merma,
  almacenes,
  proveedores = [],
  clientes = [],
}: PageProps) {
  const { can } = useAuth();

  // ✅ Validación de permisos (única lógica de negocio)
  if (!can('inventario.ajuste.form')) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Acceso Denegado" />
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No tienes permisos para acceder a esta página
          </h3>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Carga Masiva de Operaciones de Inventario" />
      <div className="flex flex-col gap-6 p-4">
        {/* ENCABEZADO */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Carga Masiva de Operaciones
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Importa múltiples operaciones de inventario (ajustes, compras, ventas, mermas) desde CSV, XLSX u ODS
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/inventario/ajuste"
              className="inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ajuste Individual
            </Link>
          </div>
        </div>

        {/* COMPONENTE DE CARGA MASIVA */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <CargaMasivaAjustes
            productos={productos}
            tiposAjuste={tipos_ajuste}
            tiposMerma={tipos_merma}
            almacenes={almacenes}
            proveedores={proveedores}
            clientes={clientes}
          />
        </div>

        {/* INFORMACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
              Formato CSV, XLSX u ODS
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>
                <strong>producto</strong> - SKU, nombre o código del producto (obligatorio)
              </li>
              <li>
                <strong>cantidad</strong> - Cantidad a ajustar (siempre positiva) (obligatorio)
              </li>
              <li>
                <strong>tipo_operacion</strong> - Tipo de operación: ENTRADA_AJUSTE, SALIDA_AJUSTE, ENTRADA_COMPRA, SALIDA_VENTA, SALIDA_MERMA (obligatorio)
              </li>
              <li>
                <strong>tipo_motivo</strong> - Depende de la operación: tipo_ajuste, tipo_merma, proveedor, cliente, etc. (obligatorio)
              </li>
              <li>
                <strong>almacen</strong> - Nombre del almacén (obligatorio)
              </li>
              <li>
                <strong>observacion</strong> - Observaciones o detalles adicionales (obligatorio)
              </li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Beneficios de la carga masiva
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
              <li>✓ Importa 100+ ajustes en segundos</li>
              <li>✓ Validación automática de datos</li>
              <li>✓ Detecta errores antes de guardar</li>
              <li>✓ Ideal para auditorías físicas</li>
              <li>✓ Recuento rápido de inventario</li>
              <li>✓ Deshacer ajustes completos si es necesario</li>
            </ul>
          </div>
        </div>

        {/* TIPOS DE AJUSTE DISPONIBLES */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">📋 Tipos de ajuste disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tipos_ajuste.map((tipo) => (
              <div
                key={tipo.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{tipo.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Código: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{tipo.clave}</code>
                    </p>
                    {tipo.descripcion && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{tipo.descripcion}</p>
                    )}
                  </div>
                  {tipo.bg_color && (
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: tipo.bg_color }}
                      title={tipo.bg_color}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALMACENES DISPONIBLES */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">🏢 Almacenes disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {almacenes.map((almacen) => (
              <div
                key={almacen.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">{almacen.nombre}</span>
                {almacen.activo ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    Inactivo
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
