import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para sincronizar estado con parámetros de URL
 *
 * EJEMPLO:
 * ```tsx
 * const [view, setView] = useQueryParam('view', 'simple');
 *
 * return (
 *   <button onClick={() => setView('dashboard')}>
 *     Cambiar a Dashboard
 *   </button>
 * );
 * ```
 *
 * COMPORTAMIENTO:
 * - Lee el valor inicial de ?view= en la URL
 * - Al cambiar el estado, actualiza la URL automáticamente
 * - Usa window.history.pushState para evitar recarga de página
 * - Compatible con navegación atrás/adelante del navegador
 *
 * @param key - Nombre del parámetro de URL
 * @param defaultValue - Valor por defecto si no existe en URL
 * @returns [value, setValue] - Similar a useState
 */
export function useQueryParam(key: string, defaultValue: string = ''): [string, (value: string) => void] {
    const [value, setValue] = useState(() => {
        // Leer valor inicial desde URL
        if (typeof window === 'undefined') return defaultValue;

        const url = new URL(window.location.href);
        return url.searchParams.get(key) || defaultValue;
    });

    // Función para actualizar URL y estado
    const updateValue = useCallback((newValue: string) => {
        setValue(newValue);

        // Actualizar URL sin recargar página
        const url = new URL(window.location.href);
        if (newValue && newValue !== defaultValue) {
            url.searchParams.set(key, newValue);
        } else {
            url.searchParams.delete(key);
        }

        window.history.pushState({}, '', url);
    }, [key, defaultValue]);

    return [value, updateValue];
}

/**
 * Hook alternativo que retorna un objeto con métodos más claros
 *
 * EJEMPLO:
 * ```tsx
 * const viewParam = useQueryParams({ key: 'view', default: 'simple' });
 *
 * return (
 *   <button onClick={() => viewParam.set('dashboard')}>
 *     Cambiar a Dashboard (URL: ?view=dashboard)
 *   </button>
 * );
 * ```
 */
export function useQueryParams<T extends string = string>(options: {
    key: string;
    default?: T;
}): {
    value: T;
    set: (newValue: T) => void;
    clear: () => void;
} {
    const [value, setValue] = useQueryParam(options.key, options.default || '');

    return {
        value: (value || options.default || '') as T,
        set: (newValue: T) => setValue(newValue),
        clear: () => setValue(''),
    };
}
