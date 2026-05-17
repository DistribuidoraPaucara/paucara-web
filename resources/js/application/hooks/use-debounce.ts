// Hook: useDebounce - Retrasa la ejecución de una función
import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Hook que ejecuta una función después de un delay especificado
 * Útil para búsquedas en tiempo real, validaciones, etc.
 *
 * @param callback - Función a ejecutar
 * @param delay - Delay en milisegundos (default: 300ms)
 * @returns Función debounceada
 *
 * Ejemplo:
 * const debouncedSearch = useDebounce(() => {
 *   searchEntities({ q: query });
 * }, 500);
 *
 * useEffect(() => {
 *   debouncedSearch();
 * }, [query]);
 */
export function useDebounce(callback: () => void, delay: number = 300) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook que debouncea un valor (retorna el valor después del delay)
 * Útil para sincronizar estados con delay
 *
 * @param value - Valor a debouncer
 * @param delay - Delay en milisegundos (default: 300ms)
 * @returns Valor debounceado
 *
 * Ejemplo:
 * const debouncedQuery = useDebouncedValue(query, 500);
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar al desmontar o cambiar value
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
