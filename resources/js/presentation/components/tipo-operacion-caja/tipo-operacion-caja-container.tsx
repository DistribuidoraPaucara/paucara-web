// Presentation Layer: Contenedor principal para la gestión de tipos de operación de caja
'use client';

import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { TipoOperacionCaja } from '@/domain/entities/tipo-operacion-caja';
import TipoOperacionCajaSearchBar from './tipo-operacion-caja-search-bar';
import TipoOperacionCajaTable from './tipo-operacion-caja-table';
import TipoOperacionCajaPagination from './tipo-operacion-caja-pagination';

interface TipoOperacionCajaContainerProps {
  items: TipoOperacionCaja[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  query?: string;
}

export default function TipoOperacionCajaContainer({
  items,
  pagination,
  query = ''
}: TipoOperacionCajaContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [direccionFilter, setDireccionFilter] = useState<string>('');

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    router.get(
      '/tipo-operacion-caja',
      { search: searchQuery, direccion: direccionFilter || undefined },
      {
        preserveState: true,
        onFinish: () => setIsLoading(false),
      }
    );
  }, [searchQuery, direccionFilter]);

  const handleDireccionFilter = useCallback((direccion: string) => {
    setDireccionFilter(direccion);
    setIsLoading(true);
    router.get(
      '/tipo-operacion-caja',
      { search: searchQuery, direccion: direccion || undefined },
      {
        preserveState: true,
        onFinish: () => setIsLoading(false),
      }
    );
  }, [searchQuery]);

  const handlePageChange = useCallback((url: string) => {
    setIsLoading(true);
    router.visit(url, {
      preserveState: true,
      onFinish: () => setIsLoading(false),
    });
  }, []);

  const handleDelete = useCallback((id: number) => {
    setIsLoading(true);
    router.delete(`/tipo-operacion-caja/${id}`, {
      onFinish: () => setIsLoading(false),
    });
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tipos de Operación de Caja
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestione los tipos de operación disponibles para el registro de movimientos de caja
          </p>
        </div>
        <Link
          href="/tipo-operacion-caja/create"
          className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Tipo</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Búsqueda
          </label>
          <TipoOperacionCajaSearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Buscar por código o nombre..."
          />
        </div>

        {/* Direction Filter Select */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dirección
          </label>
          <select
            value={direccionFilter}
            onChange={(e) => handleDireccionFilter(e.target.value)}
            className="w-full md:w-48 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            <option value="ENTRADA">⬇ ENTRADA</option>
            <option value="SALIDA">⬆ SALIDA</option>
            <option value="AJUSTE">🔧 AJUSTE</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto rounded-lg bg-indigo-600 dark:bg-indigo-700 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando <strong>{items.length}</strong> de <strong>{pagination.total}</strong> registros
        {direccionFilter && <span> • Filtrado por: <strong>{direccionFilter}</strong></span>}
      </div>

      {/* Table */}
      <TipoOperacionCajaTable
        items={items}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <TipoOperacionCajaPagination
        links={pagination.links}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
