/**
 * useFilters - Hook para gestión de filtros reactiva
 *
 * Propósito: Manejar estado de filtros + aplicación automática
 * Elimina ~35 líneas de lógica de filtros duplicada
 *
 * Features:
 * - Agregar/remover/actualizar filtros
 * - Aplicación automática de filtros
 * - Resetear filtros
 * - Guardar/cargar filtros de URL
 *
 * Uso:
 * const { filters, addFilter, removeFilter, applyFilters } = useFilters(initialFilters);
 */

import { useState, useCallback, useEffect } from 'react';
import type { Filters } from '@/domain/entities/shared';

export interface UseFiltersReturn {
  filters: Filters;
  activeFilters: Filters;
  filterCount: number;
  hasFilters: boolean;

  addFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  updateFilter: (key: string, value: any) => void;
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;
  clearFilter: (key: string) => void;

  applyFilters: () => void;
  getFilterValue: (key: string) => any;
  hasFilter: (key: string) => boolean;

  // URL helpers
  toQueryString: () => string;
  fromQueryString: (qs: string) => void;
}

export function useFilters(
  initialFilters: Filters = {},
  onFiltersChanged?: (filters: Filters) => void | Promise<void>
): UseFiltersReturn {
  const [filters, setFiltersState] = useState<Filters>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);

  const filterCount = Object.keys(filters).length;
  const hasFilters = filterCount > 0;

  // Agregar filtro
  const addFilter = useCallback((key: string, value: any) => {
    if (value !== undefined && value !== null && value !== '') {
      setFiltersState((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  }, []);

  // Remover filtro
  const removeFilter = useCallback((key: string) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Actualizar filtro
  const updateFilter = useCallback((key: string, value: any) => {
    if (value !== undefined && value !== null && value !== '') {
      addFilter(key, value);
    } else {
      removeFilter(key);
    }
  }, [addFilter, removeFilter]);

  // Establecer múltiples filtros
  const setFilters = useCallback((newFilters: Filters) => {
    setFiltersState(newFilters);
  }, []);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setActiveFilters({});
  }, []);

  // Limpiar filtro específico
  const clearFilter = useCallback((key: string) => {
    removeFilter(key);
  }, [removeFilter]);

  // Aplicar filtros (actualizar activeFilters y llamar callback)
  const applyFilters = useCallback(async () => {
    setActiveFilters(filters);
    if (onFiltersChanged) {
      await onFiltersChanged(filters);
    }
  }, [filters, onFiltersChanged]);

  // Obtener valor de filtro
  const getFilterValue = useCallback(
    (key: string): any => filters[key],
    [filters]
  );

  // Verificar si hay filtro específico
  const hasFilter = useCallback((key: string): boolean => {
    return key in filters && filters[key] !== undefined;
  }, [filters]);

  // Convertir filtros a query string
  const toQueryString = useCallback((): string => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, [filters]);

  // Cargar filtros desde query string
  const fromQueryString = useCallback((qs: string) => {
    const params = new URLSearchParams(qs);
    const newFilters: Filters = {};

    params.forEach((value, key) => {
      newFilters[key] = value;
    });

    setFiltersState(newFilters);
  }, []);

  return {
    // Estado
    filters,
    activeFilters,
    filterCount,
    hasFilters,

    // Acciones
    addFilter,
    removeFilter,
    updateFilter,
    setFilters,
    clearFilters,
    clearFilter,

    // Aplicar y helpers
    applyFilters,
    getFilterValue,
    hasFilter,

    // URL
    toQueryString,
    fromQueryString,
  };
}
