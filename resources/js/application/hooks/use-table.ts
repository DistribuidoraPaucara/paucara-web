/**
 * useTable - Hook todo en uno para tablas completas
 *
 * Propósito: Combinar ordenamiento + paginación + búsqueda + filtros
 * Elimina ~40 líneas de lógica de tabla duplicada
 *
 * Features:
 * - Ordenamiento
 * - Paginación
 * - Búsqueda
 * - Filtros
 * - Selección de filas
 * - Todo integrado
 *
 * Uso:
 * const table = useTable(data, { perPage: 10, sortBy: 'nombre' });
 * table.handleSort('nombre');
 * table.handleSearch('juan');
 */

import { useState, useCallback, useMemo } from 'react';
import { TableHelper } from '@/infrastructure/utils/table-helper';
import { FilterBuilder } from '@/infrastructure/utils/filter-builder';
import type { BaseEntity } from '@/domain/entities/generic';

export interface UseTableOptions {
  perPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchFields?: string[];
  initialFilters?: Record<string, any>;
}

export interface UseTableReturn<T extends BaseEntity> {
  // Dados
  items: T[];
  displayItems: T[];

  // Estado
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  searchQuery: string;
  currentPage: number;
  perPage: number;
  selectedIds: any[];

  // Filtros
  filters: Record<string, any>;
  filterCount: number;

  // Información
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    perPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    from: number;
    to: number;
  };

  // Acciones - Ordenamiento
  handleSort: (field: string) => void;
  clearSort: () => void;

  // Acciones - Búsqueda
  handleSearch: (query: string) => void;
  clearSearch: () => void;

  // Acciones - Paginación
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPerPage: (perPage: number) => void;

  // Acciones - Filtros
  addFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;

  // Acciones - Selección
  selectRow: (id: any) => void;
  selectAllRows: () => void;
  deselectAllRows: () => void;

  // Reset total
  reset: () => void;
}

export function useTable<T extends BaseEntity>(
  data: T[],
  options: UseTableOptions = {}
): UseTableReturn<T> {
  const {
    perPage = 10,
    sortBy = null,
    sortDirection = 'asc',
    searchFields = [],
    initialFilters = {},
  } = options;

  // Estado de ordenamiento
  const [sortField, setSortField] = useState<string | null>(sortBy as string);
  const [currentSortDirection, setCurrentSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  // Estado de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(perPage);

  // Estado de filtros
  const [filters, setFilters] = useState(initialFilters);

  // Estado de selección
  const [selectedIds, setSelectedIds] = useState<any[]>([]);

  // Aplicar filtros
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (searchQuery && searchFields.length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = (item as any)[field];
          return value && String(value).toLowerCase().includes(lowerQuery);
        })
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter((item) => (item as any)[key] === value);
      }
    });

    return result;
  }, [data, searchQuery, searchFields, filters]);

  // Aplicar ordenamiento y paginación
  const displayData = useMemo(() => {
    let result = [...filteredData];

    // Ordenamiento
    if (sortField) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortField];
        const bValue = (b as any)[sortField];

        if (aValue < bValue) return currentSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Paginación
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    result = result.slice(start, end);

    return result;
  }, [filteredData, sortField, currentSortDirection, currentPage, itemsPerPage]);

  // Calcular paginación info
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const pagination = {
    total: filteredData.length,
    totalPages,
    page: validPage,
    perPage: itemsPerPage,
    hasNext: validPage < totalPages,
    hasPrev: validPage > 1,
    from: (validPage - 1) * itemsPerPage + 1,
    to: Math.min(validPage * itemsPerPage, filteredData.length),
  };

  // ============================================
  // Acciones - Ordenamiento
  // ============================================
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      // Alternar dirección
      setCurrentSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Nuevo campo
      setSortField(field);
      setCurrentSortDirection('asc');
    }
    // Resetear a página 1
    setCurrentPage(1);
  }, [sortField]);

  const clearSort = useCallback(() => {
    setSortField(null);
  }, []);

  // ============================================
  // Acciones - Búsqueda
  // ============================================
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Resetear a página 1
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // ============================================
  // Acciones - Paginación
  // ============================================
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(validPage + 1);
  }, [validPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(validPage - 1);
  }, [validPage, goToPage]);

  const handleSetPerPage = useCallback((perPage: number) => {
    setItemsPerPage(Math.max(1, perPage));
    setCurrentPage(1);
  }, []);

  // ============================================
  // Acciones - Filtros
  // ============================================
  const addFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  // ============================================
  // Acciones - Selección
  // ============================================
  const selectRow = useCallback((id: any) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }, []);

  const selectAllRows = useCallback(() => {
    setSelectedIds(displayData.map((item) => item.id));
  }, [displayData]);

  const deselectAllRows = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // ============================================
  // Reset Total
  // ============================================
  const reset = useCallback(() => {
    setSortField(sortBy as string);
    setCurrentSortDirection(sortDirection);
    setSearchQuery('');
    setCurrentPage(1);
    setItemsPerPage(perPage);
    setFilters(initialFilters);
    setSelectedIds([]);
  }, [sortBy, sortDirection, perPage, initialFilters]);

  return {
    // Datos
    items: data,
    displayItems: displayData,

    // Estado
    sortField,
    sortDirection: sortField ? currentSortDirection : null,
    searchQuery,
    currentPage: validPage,
    perPage: itemsPerPage,
    selectedIds,

    // Filtros
    filters,
    filterCount: Object.keys(filters).length,

    // Información
    pagination,

    // Acciones - Ordenamiento
    handleSort,
    clearSort,

    // Acciones - Búsqueda
    handleSearch,
    clearSearch,

    // Acciones - Paginación
    goToPage,
    nextPage,
    prevPage,
    setPerPage: handleSetPerPage,

    // Acciones - Filtros
    addFilter,
    removeFilter,
    clearFilters,

    // Acciones - Selección
    selectRow,
    selectAllRows,
    deselectAllRows,

    // Reset
    reset,
  };
}
