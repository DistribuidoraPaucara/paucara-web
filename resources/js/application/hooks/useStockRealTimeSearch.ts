import { useState, useCallback, useRef, useEffect } from 'react';

interface SearchFilters {
  almacen_id?: string;
  categoria_id?: string;
  con_stock?: boolean;
  busqueda?: string;
  page?: number;
  per_page?: number;
}

interface StockData {
  id: number;
  producto_id: number;
  almacen_id: number;
  cantidad: number;
  [key: string]: any;
}

interface SearchResult {
  data: StockData[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

/**
 * Hook para búsqueda en tiempo real de stock actual
 * Realiza búsqueda por POST con debounce automático
 */
export function useStockRealTimeSearch(debounceMs: number = 500) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener el token CSRF
  const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') || '' : '';
  };

  // Función para realizar la búsqueda
  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/reportes/inventario/buscar-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify(searchFilters),
      });

      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.status}`);
      }

      const data: SearchResult = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error en búsqueda:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar filtros con debounce
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 };
      setFilters(updatedFilters);

      // Limpiar timer anterior
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Crear nuevo timer
      debounceTimerRef.current = setTimeout(() => {
        performSearch(updatedFilters);
      }, debounceMs);
    },
    [filters, debounceMs, performSearch]
  );

  // Función para ir a página específica
  const goToPage = useCallback(
    (page: number) => {
      const updatedFilters = { ...filters, page };
      setFilters(updatedFilters);
      performSearch(updatedFilters);
    },
    [filters, performSearch]
  );

  // Función para cambiar cantidad de registros por página
  const changePerPage = useCallback(
    (perPage: number) => {
      const updatedFilters = { ...filters, per_page: perPage, page: 1 };
      setFilters(updatedFilters);
      performSearch(updatedFilters);
    },
    [filters, performSearch]
  );

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    setResults(null);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    filters,
    results,
    isLoading,
    error,
    updateFilters,
    goToPage,
    changePerPage,
    clearFilters,
  };
}
