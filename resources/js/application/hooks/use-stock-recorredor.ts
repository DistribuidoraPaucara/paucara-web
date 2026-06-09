import { useState } from 'react';

export interface TraceMovimiento {
    id: number;
    tipo: string;
    cambio: number;
    valores_anteriores: {
        total: number;
        disponible: number;
        reservada: number;
    };
    valores_posteriores: {
        total: number;
        disponible: number;
        reservada: number;
    };
    invariante_ok: boolean;
    tiene_error: boolean;
}

export interface StockCorrectoResult {
    exito: boolean;
    advertencias: string[];
    stock_final_correcto: {
        total: number;
        disponible: number;
        reservado: number;
        invariante: boolean;
    };
    movimiento_inicial: {
        id: number;
        tipo: string;
        sku: string;
        nombre: string;
    };
    movimiento_final: {
        id: number;
        tipo: string;
        fecha: string;
    };
    trace: TraceMovimiento[];
    total_movimientos: number;
    mensaje?: string;
}

export const useStockRecorredor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recorrerStock = async (movimientoId: number): Promise<StockCorrectoResult | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/inventario/recorrer-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    movimiento_id: movimientoId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Error al calcular el stock');
                return null;
            }

            return data as StockCorrectoResult;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error de conexión: ${errorMsg}`);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setIsLoading(false);
    };

    return {
        recorrerStock,
        isLoading,
        error,
        reset,
    };
};
