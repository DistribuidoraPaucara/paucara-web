/**
 * Hook para calcular carrito con precios por rango
 *
 * FASE 4 - Integración de rangos en creación de ventas web
 *
 * Features:
 * - Debounce automático para evitar múltiples llamadas API
 * - Caché de resultados
 * - Manejo de errores
 * - Loading states
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import precioRangoCarritoService, {
    type CarritoCalculadoResponse,
    type ItemCarrito,
    type DetalleCarritoConRango
} from '@/infrastructure/services/precio-rango-carrito.service';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface UsePrecioRangoCarritoState {
    loading: boolean;
    error: string | null;
    carritoCalculado: CarritoCalculadoResponse | null;
    detallesConRango: Map<number, DetalleCarritoConRango>; // Indexado por producto_id
}

export function usePrecioRangoCarrito(debounceDelayMs: number = 500) {
    const [state, setState] = useState<UsePrecioRangoCarritoState>({
        loading: false,
        error: null,
        carritoCalculado: null,
        detallesConRango: new Map(),
    });

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Ejecutar el cálculo del carrito
     */
    const executeCalculate = useCallback(async (items: ItemCarrito[]) => {
        try {
            setState(prev => ({
                ...prev,
                loading: true,
                error: null,
            }));

            const response = await precioRangoCarritoService.calcularCarrito(items);
            console.log('🎯 Respuesta del servicio:', response);

            // El servicio retorna {success: true, data: {...}}
            // Extraer los detalles de response.data (no response directamente)
            const carritoData = response.data || response;
            const detalles = carritoData.detalles || [];

            console.log(`📦 Detalles recibidos: ${detalles.length}`);

            // Crear mapa de detalles por producto_id
            const detallesMap = new Map<number, DetalleCarritoConRango>();
            detalles.forEach((detalle: DetalleCarritoConRango) => {
                detallesMap.set(detalle.producto_id as number, detalle);
                console.log(`🔹 Guardando en mapa: producto_id=${detalle.producto_id}, precio=${detalle.precio_unitario}`);
            });

            console.log(`✅ Mapa creado con ${detallesMap.size} productos`);

            setState(prev => ({
                ...prev,
                loading: false,
                carritoCalculado: carritoData as CarritoCalculadoResponse,
                detallesConRango: detallesMap,
            }));

            console.log(`🗂️ Estado actualizado. Mapa size: ${detallesMap.size}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al calcular carrito';
            console.error('❌ Error en executeCalculate:', errorMessage);

            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
                carritoCalculado: null,
            }));

            // ✅ MEJORADO: Mostrar notificación de error clara y específica
            try {
                // Extraer el mensaje del error para hacerlo más legible
                let mensajeUsuario = errorMessage;

                // Detectar errores comunes y personalizarlos
                if (errorMessage.includes('límite') || errorMessage.includes('Cantidad')) {
                    // Ya es un mensaje claro del servidor
                    mensajeUsuario = `⚠️ ${errorMessage}`;
                } else if (errorMessage.includes('422')) {
                    mensajeUsuario = '⚠️ Error de validación: Verifica los datos ingresados';
                } else {
                    mensajeUsuario = `⚠️ Error al calcular precios: ${errorMessage}`;
                    console.error('Detalle del error:', mensajeUsuario);
                }

                // ✅ MEJORADO: Mostrar toast de error
                NotificationService.error(mensajeUsuario);
            } catch (notifError) {
                console.error('Error al mostrar notificación:', notifError);
            }

            // Limpiar el error después de 5 segundos
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
            errorTimeoutRef.current = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    error: null,
                }));
            }, 5000);
        }
    }, []);

    /**
     * Calcular carrito con debounce
     */
    const calcularCarritoDebounced = useCallback((items: ItemCarrito[]) => {
        // Cancelar timer anterior si existe
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Establecer nuevo timer
        debounceTimerRef.current = setTimeout(() => {
            executeCalculate(items);
        }, debounceDelayMs);
    }, [debounceDelayMs, executeCalculate]);

    /**
     * Obtener detalles de rango para un producto específico
     */
    const getDetalleRango = useCallback((productoId: number): DetalleCarritoConRango | undefined => {
        return state.detallesConRango.get(productoId);
    }, [state.detallesConRango]);

    /**
     * Obtener precio unitario actualizado para un producto
     */
    const getPrecioActualizado = useCallback((productoId: number): number | null => {
        const detalle = state.detallesConRango.get(productoId);
        const precio = detalle?.precio_unitario ?? null;
        if (precio) {
            console.log(`💰 getPrecioActualizado(${productoId}) = ${precio}`);
        }
        return precio;
    }, [state.detallesConRango]);

    /**
     * Obtener tipo de precio para un producto
     */
    const getTipoPrecio = useCallback((productoId: number): { id: number; nombre: string } | null => {
        const detalle = state.detallesConRango.get(productoId);
        if (!detalle) return null;

        return {
            id: detalle.tipo_precio_id as number,
            nombre: detalle.tipo_precio_nombre,
        };
    }, [state.detallesConRango]);

    /**
     * Verificar si hay ahorro disponible para un producto
     */
    const getAhorroDisponible = useCallback((productoId: number): number | null => {
        const detalle = state.detallesConRango.get(productoId);
        return detalle?.ahorro_proximo ?? null;
    }, [state.detallesConRango]);

    /**
     * Obtener información del próximo rango
     */
    const getProximoRango = useCallback((productoId: number) => {
        const detalle = state.detallesConRango.get(productoId);
        return detalle?.proximo_rango ?? null;
    }, [state.detallesConRango]);

    /**
     * Limpiar error
     */
    const clearError = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
        }));
    }, []);

    /**
     * Resetear estado
     */
    const reset = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }
        setState({
            loading: false,
            error: null,
            carritoCalculado: null,
            detallesConRango: new Map(),
        });
    }, []);

    // Cleanup en unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    return {
        // Estado
        loading: state.loading,
        error: state.error,
        carritoCalculado: state.carritoCalculado,

        // Métodos
        calcularCarritoDebounced,
        getDetalleRango,
        getPrecioActualizado,
        getTipoPrecio,
        getAhorroDisponible,
        getProximoRango,
        clearError,
        reset,

        // Valores útiles
        ahorro_disponible: state.carritoCalculado?.ahorro_disponible ?? 0,
        tiene_ahorro_disponible: state.carritoCalculado?.tiene_ahorro_disponible ?? false,
    };
}
