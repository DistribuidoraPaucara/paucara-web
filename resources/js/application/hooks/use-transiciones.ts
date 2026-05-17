import { useEffect, useState } from 'react';

interface TransicionDisponible {
    codigo_destino: string;
    nombre_destino: string;
    requiere_validacion?: boolean;
    icono?: string;
    color?: string;
}

interface UseTransicionesReturn {
    transicionesValidas: TransicionDisponible[];
    codigosValidos: string[];
    puedePasar: (codigo: string) => boolean;
    loading: boolean;
    error: string | null;
    recargar: () => Promise<void>;
}

/**
 * Hook para obtener transiciones válidas de estado desde la BD
 *
 * Consulta la tabla transiciones_estado para determinar qué cambios de estado
 * son válidos desde el estado actual de la entrega.
 *
 * @param estadoEntregaId - ID del estado actual desde estados_logistica
 * @param estadoCodigo - Código del estado actual (ej: 'EN_TRANSITO')
 * @returns Object con transiciones válidas, helper methods, y estado de carga
 *
 * @example
 * const { transicionesValidas, puedePasar } = useTransiciones(5, 'LISTO_PARA_ENTREGA');
 *
 * if (puedePasar('EN_TRANSITO')) {
 *     // Mostrar botón para cambiar a EN_TRANSITO
 * }
 */
export function useTransiciones(
    estadoEntregaId: number | null,
    estadoCodigo?: string
): UseTransicionesReturn {
    const [transicionesValidas, setTransicionesValidas] = useState<TransicionDisponible[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const codigosValidos = transicionesValidas.map((t) => t.codigo_destino);

    const puedePasar = (codigo: string): boolean => {
        return codigosValidos.includes(codigo);
    };

    const recargar = async () => {
        if (!estadoEntregaId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/estados/${estadoEntregaId}/transiciones`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudieron obtener transiciones`);
            }

            const data = await response.json();
            const transiciones = data.transiciones || data.data || [];

            setTransicionesValidas(transiciones);

            console.log('[TRANSICIONES] Cargadas:', {
                estadoId: estadoEntregaId,
                estadoCodigo,
                transiciones: transiciones.map((t: TransicionDisponible) => t.codigo_destino),
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMsg);
            console.error('[TRANSICIONES] Error:', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Cargar transiciones cuando cambia el estado
    useEffect(() => {
        if (estadoEntregaId) {
            recargar();
        } else {
            setTransicionesValidas([]);
        }
    }, [estadoEntregaId]);

    return {
        transicionesValidas,
        codigosValidos,
        puedePasar,
        loading,
        error,
        recargar,
    };
}

export default useTransiciones;
