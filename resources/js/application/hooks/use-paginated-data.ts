/**
 * usePaginatedData - Hook para datos con paginación automática
 *
 * Propósito: Manejar paginación de datos locales o remotos
 * Elimina ~40 líneas de lógica de paginación duplicada
 *
 * Features:
 * - Paginación automática
 * - Carga de datos async
 * - Manejo de loading/error states
 * - Cambio de página fácil
 *
 * Uso:
 * const { items, pagination, goToPage, isLoading } = usePaginatedData(data, 10);
 */

import { useState, useEffect, useCallback } from 'react';
import type { BaseEntity } from '@/domain/entities/generic';

export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  from: number;
  to: number;
}

export interface UsePaginatedDataReturn<T> {
  items: T[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;

  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPerPage: (perPage: number) => void;
  reset: () => void;
  refetch: () => Promise<void>;
}

export function usePaginatedData<T extends BaseEntity>(
  data: T[] | (() => Promise<T[]>),
  perPage: number = 10,
  initialPage: number = 1
): UsePaginatedDataReturn<T> {
  const [allItems, setAllItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(perPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos si es función async
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof data === 'function') {
        const result = await data();
        setAllItems(result);
      } else {
        setAllItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      setAllItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Cargar datos en mount o cuando cambie data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calcular items paginados
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);

  const start = (validPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = allItems.slice(start, end);

  // Info de paginación
  const pagination: PaginationInfo = {
    page: validPage,
    perPage: itemsPerPage,
    total: totalItems,
    totalPages,
    hasNext: validPage < totalPages,
    hasPrev: validPage > 1,
    from: start + 1,
    to: Math.min(end, totalItems),
  };

  // Navegar a página
  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages || 1)));
  }, [totalPages]);

  // Página siguiente
  const nextPage = useCallback(() => {
    goToPage(validPage + 1);
  }, [validPage, goToPage]);

  // Página anterior
  const prevPage = useCallback(() => {
    goToPage(validPage - 1);
  }, [validPage, goToPage]);

  // Cambiar cantidad por página
  const handleSetPerPage = useCallback((newPerPage: number) => {
    setItemsPerPage(Math.max(1, newPerPage));
    setPage(1); // Resetear a página 1
  }, []);

  // Reset
  const reset = useCallback(() => {
    setPage(initialPage);
    setItemsPerPage(perPage);
  }, [initialPage, perPage]);

  return {
    items,
    pagination,
    isLoading,
    error,

    goToPage,
    nextPage,
    prevPage,
    setPerPage: handleSetPerPage,
    reset,
    refetch: fetchData,
  };
}
