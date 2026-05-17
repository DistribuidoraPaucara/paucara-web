import { useState, useCallback, useRef } from 'react';
import type { Producto } from '@/domain/entities/productos';

interface UseProductoSearchOptions {
    debounceMs?: number;
}

interface SearchResult {
    productos: Producto[];
    currentPage: number;
    lastPage: number;
    total: number;
    exactMatch: boolean;
}

export function useProductoSearch(options: UseProductoSearchOptions = {}) {
    const { debounceMs = 500 } = options;
    const [opciones, setOpciones] = useState<Array<{
        value: string | number;
        label: string;
        description?: string;
        data?: Producto;
    }>>([]);
    const [cargando, setCargando] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Obtener token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token?.content || '';
    };

    // Buscar productos al backend (sin borrador, búsqueda general)
    const buscar = useCallback(async (termino: string): Promise<SearchResult | null> => {
        if (!termino.trim()) {
            setOpciones([]);
            return null;
        }

        try {
            setCargando(true);

            // Usar el endpoint general de búsqueda de productos
            const response = await fetch('/productos/paginados/listar', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken(),
                },
                body: JSON.stringify({
                    page: 1,
                    per_page: 20,
                    search: termino,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al buscar productos');
            }

            const data = await response.json();
            const productos: Producto[] = data.productos || [];

            // Convertir a opciones del SearchSelect
            const nuevasOpciones = productos.map((p: Producto) => ({
                value: p.id,
                label: `${p.nombre}${p.sku ? ` (${p.sku})` : ''}`,
                description: [p.categoria, p.marca].filter(Boolean).join(' • '),
                data: p,
            }));

            setOpciones(nuevasOpciones);

            return {
                productos,
                currentPage: data.current_page || 1,
                lastPage: data.last_page || 1,
                total: data.total || 0,
                exactMatch: data.exactMatch || false,
            };
        } catch (error) {
            console.error('Error buscando productos:', error);
            setOpciones([]);
            return null;
        } finally {
            setCargando(false);
        }
    }, []);

    // Buscar con debounce
    const buscarConDebounce = useCallback((termino: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!termino.trim()) {
            setOpciones([]);
            return;
        }

        setCargando(true);
        debounceTimerRef.current = setTimeout(() => {
            buscar(termino);
        }, debounceMs);
    }, [buscar, debounceMs]);

    // Limpiar debounce al desmontar
    const limpiar = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        setOpciones([]);
        setCargando(false);
    }, []);

    return {
        opciones,
        cargando,
        buscar,
        buscarConDebounce,
        limpiar,
    };
}
