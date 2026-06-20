// Presentation: Página de administración de Permisos
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Permission {
  id: number;
  name: string;
  description?: string;
  guard_name: string;
}

interface Props {
  permissions?: {
    data?: Permission[];
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    total?: number;
    current_page?: number;
  };
  modulos?: string[];
  filters?: {
    search?: string;
    modulo?: string;
  };
}

export default function PermisosIndexPage({
  permissions = { data: [], links: [] },
  modulos = [],
  filters = { search: '', modulo: '' }
}: Props) {
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [selectedModulo, setSelectedModulo] = useState(filters?.modulo || '');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce para la búsqueda - solo si cambió realmente
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchChanged = searchQuery !== (filters?.search || '');
      const moduloChanged = selectedModulo !== (filters?.modulo || '');

      if (searchChanged || moduloChanged) {
        handleSearch();
      }
    }, 1500); // Debounce de 1.5 segundos

    return () => clearTimeout(timer);
  }, [searchQuery, selectedModulo]);

  const handleSearch = () => {
    setIsLoading(true);
    router.get(
      '/permisos',
      { search: searchQuery, modulo: selectedModulo },
      { preserveState: true, onFinish: () => setIsLoading(false) }
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este permiso?')) {
      setIsLoading(true);
      router.delete(`/permisos/${id}`, {
        onFinish: () => setIsLoading(false),
      });
    }
  };

  const handlePageChange = (url: string) => {
    setIsLoading(true);
    router.visit(url, {
      preserveState: true,
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Gestión de Permisos" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permisos</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gestione los permisos del sistema</p>
          </div>
          <Link
            href="/permisos/create"
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo</span>
          </Link>
        </div>

        {/* Filtros */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-lg">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Nombre o descripción..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Presiona Enter o espera 1.5s</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Módulo
              </label>
              <select
                value={selectedModulo}
                onChange={(e) => setSelectedModulo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                disabled={isLoading}
              >
                <option value="">Todos los módulos</option>
                {modulos.map((modulo) => (
                  <option key={modulo} value={modulo}>
                    {modulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div className="flex items-end">
              <div className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                Total: <strong>{permissions?.total || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow dark:shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Guard</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!permissions?.data || permissions.data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Cargando...' : 'No hay permisos registrados'}
                  </td>
                </tr>
              ) : (
                permissions.data.map((permission) => (
                  <tr key={permission.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{permission.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{permission.description || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-300">
                        {permission.guard_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link href={`/permisos/${permission.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(permission.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {permissions?.links && permissions.links.length > 1 && (
          <div className="flex items-center justify-center space-x-2 p-4">
            {permissions.links.map((link, index) => {
              const isDisabled = !link.url;
              const isActive = link.active;

              // Reemplazar las etiquetas HTML
              const label = link.label
                .replace('&laquo;', '«')
                .replace('&raquo;', '»')
                .replace('&lt;', '<')
                .replace('&gt;', '>');

              if (isDisabled) {
                return (
                  <button
                    key={index}
                    disabled
                    className="rounded-lg px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  >
                    {label}
                  </button>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => link.url && handlePageChange(link.url)}
                  disabled={isLoading}
                  className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                    isActive
                      ? 'border border-indigo-500 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Info de página actual */}
        {permissions?.current_page && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Página <strong>{permissions.current_page}</strong> de <strong>{Math.ceil((permissions.total || 1) / 25)}</strong>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
