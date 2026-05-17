import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { TipoOperacion } from '@/domain/entities/ajustes-masivos';
import ajustesService from '@/infrastructure/services/ajustes.service';

interface UseTiposOperacionOptions {
    autoLoad?: boolean;
}

interface UseTiposOperacionReturn {
    tipos: TipoOperacion[];
    cargando: boolean;
    error: string | null;
    cargar: () => Promise<void>;
}

/**
 * Application Layer Hook
 *
 * Encapsula la lógica de carga de tipos de operación disponibles
 * para ajustes masivos de inventario
 *
 * @example
 * const { tipos, cargando } = useTiposOperacion({ autoLoad: true });
 */
export function useTiposOperacion(options: UseTiposOperacionOptions = {}): UseTiposOperacionReturn {
    const { autoLoad = true } = options;

    const [tipos, setTipos] = useState<TipoOperacion[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Cargar tipos de operación desde la API
     */
    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await ajustesService.obtenerTiposOperacion();
            setTipos(datos);
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error al cargar tipos de operación';
            setError(mensaje);
            toast.error(mensaje);
            console.error('Error loading operation types:', err);
        } finally {
            setCargando(false);
        }
    }, []);

    /**
     * Auto-cargar tipos al montar el componente
     */
    useEffect(() => {
        if (autoLoad) {
            cargar();
        }
    }, [autoLoad, cargar]);

    return {
        tipos,
        cargando,
        error,
        cargar,
    };
}
