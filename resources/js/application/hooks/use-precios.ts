/**
 * Hook: usePrecios
 * Maneja el estado y lógica para la gestión de precios
 */

import { useState, useCallback } from 'react';
import { preciosService } from '@/application/services/precios.service';
import type {
    PrecioProducto,
    FiltrosPrecio,
    PreciosListaResponse,
    HistorialPrecio,
} from '@/domain/entities/precios';

export interface UsePreciosState {
    // Estado de carga
    loading: boolean;
    error: string | null;

    // Datos
    precios: PreciosListaResponse | null;
    cambiosRecientes: HistorialPrecio[];
    resumen: {
        total_cambios_7dias: number;
        cambios_recientes: HistorialPrecio[];
        productos_alerta: any[];
    } | null;

    // Paginación
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;

    // Operaciones
    historialSeleccionado: HistorialPrecio[];
    precioEnEdicion: PrecioProducto | null;

    // Filtros
    soloConDiferenciaCosto: boolean; // ✅ NUEVO: Filtro para mostrar solo con diferencia de costo

    // Compras con diferencia de costo
    comprasConDiferencia: any[];
    productoComprasSeleccionado: any | null; // Producto completo con precios
    precioCostoNuevo?: number | null; // Nuevo precio de costo propuesto
    loadingCompras: boolean;
}

export interface UsePreciosActions {
    obtenerPrecios: (filtros?: FiltrosPrecio, page?: number) => Promise<void>;
    obtenerHistorial: (precioId: number | string) => Promise<void>;
    obtenerCambiosRecientes: (dias?: number) => Promise<void>;
    obtenerResumen: () => Promise<void>;
    obtenerComprasConDiferenciaCosto: (productoId: number) => Promise<void>;
    actualizarPrecio: (precioId: number | string, precioNuevo: number, motivo: string) => Promise<void>;
    actualizarLote: (precios: Array<{
        precio_id: number;
        precio_nuevo: number;
        porcentaje_ganancia?: number;
        motivo: string;
    }>) => Promise<void>;
    limpiarError: () => void;
    seleccionarPrecio: (precio: PrecioProducto | null) => void;
    limpiarComprasSeleccionadas: () => void;
    toggleSoloConDiferenciaCosto: () => void; // ✅ NUEVO: Toggle para filtro
}

const estadoInicial: UsePreciosState = {
    loading: false,
    error: null,
    precios: null,
    cambiosRecientes: [],
    resumen: null,
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
    historialSeleccionado: [],
    precioEnEdicion: null,
    soloConDiferenciaCosto: false, // ✅ NUEVO: Inicialmente desactivado
    comprasConDiferencia: [],
    productoComprasSeleccionado: null,
    precioCostoNuevo: null,
    loadingCompras: false,
};

export function usePrecios(): [UsePreciosState, UsePreciosActions] {
    const [estado, setEstado] = useState<UsePreciosState>(estadoInicial);

    // Obtener lista de precios
    const obtenerPrecios = useCallback(async (filtros?: FiltrosPrecio, page: number = 1) => {
        try {
            setEstado(prev => ({ ...prev, loading: true, error: null }));
            const datos = await preciosService.obtenerListaPrecios(filtros, page);

            // Extraer información de paginación del response
            const apiResponse = datos as any;
            const total = apiResponse.total || 0;
            const perPage = apiResponse.per_page || 20;
            const lastPage = apiResponse.last_page || 1;
            const currentPage = apiResponse.current_page || page;

            setEstado(prev => ({
                ...prev,
                precios: datos,
                currentPage: currentPage,
                perPage: perPage,
                total: total,
                lastPage: lastPage,
                loading: false
            }));
        } catch (error: any) {
            setEstado(prev => ({
                ...prev,
                error: error.message || 'Error al obtener precios',
                loading: false,
            }));
        }
    }, []);

    // Obtener historial de un precio
    const obtenerHistorial = useCallback(async (precioId: number | string) => {
        try {
            setEstado(prev => ({ ...prev, loading: true, error: null }));
            const historial = await preciosService.obtenerHistorialPrecio(precioId);
            setEstado(prev => ({ ...prev, historialSeleccionado: historial, loading: false }));
        } catch (error: any) {
            setEstado(prev => ({
                ...prev,
                error: error.message || 'Error al obtener historial',
                loading: false,
            }));
        }
    }, []);

    // Obtener cambios recientes
    const obtenerCambiosRecientes = useCallback(async (dias: number = 7) => {
        try {
            setEstado(prev => ({ ...prev, loading: true, error: null }));
            const cambios = await preciosService.obtenerCambiosRecientes(dias);
            setEstado(prev => ({ ...prev, cambiosRecientes: cambios, loading: false }));
        } catch (error: any) {
            setEstado(prev => ({
                ...prev,
                error: error.message || 'Error al obtener cambios recientes',
                loading: false,
            }));
        }
    }, []);

    // Obtener resumen
    const obtenerResumen = useCallback(async () => {
        try {
            setEstado(prev => ({ ...prev, loading: true, error: null }));
            const resumen = await preciosService.obtenerResumen();
            setEstado(prev => ({ ...prev, resumen, loading: false }));
        } catch (error: any) {
            setEstado(prev => ({
                ...prev,
                error: error.message || 'Error al obtener resumen',
                loading: false,
            }));
        }
    }, []);

    // Actualizar precio
    const actualizarPrecio = useCallback(
        async (precioId: number | string, precioNuevo: number, motivo: string) => {
            try {
                setEstado(prev => ({ ...prev, loading: true, error: null }));
                await preciosService.actualizarPrecio(precioId, precioNuevo, motivo);
                // Recargar lista
                await obtenerPrecios();
                setEstado(prev => ({ ...prev, loading: false }));
            } catch (error: any) {
                setEstado(prev => ({
                    ...prev,
                    error: error.message || 'Error al actualizar precio',
                    loading: false,
                }));
            }
        },
        [obtenerPrecios]
    );

    // Actualizar lote
    const actualizarLote = useCallback(
        async (precios: Array<{
            precio_id: number;
            precio_nuevo: number;
            porcentaje_ganancia?: number;
            motivo: string;
        }>) => {
            try {
                console.log('🔄 usePrecios::actualizarLote - Iniciando actualización de lote con', precios.length, 'precios');
                setEstado(prev => ({ ...prev, loading: true, error: null }));
                const resultado = await preciosService.actualizarLote(precios);
                console.log('🔄 usePrecios::actualizarLote - Actualización completada:', resultado);
                // Recargar lista
                await obtenerPrecios();
                setEstado(prev => ({ ...prev, loading: false }));
            } catch (error: any) {
                console.error('🔄 usePrecios::actualizarLote - Error:', error);
                setEstado(prev => ({
                    ...prev,
                    error: error.message || 'Error al actualizar precios',
                    loading: false,
                }));
            }
        },
        [obtenerPrecios]
    );

    // Limpiar error
    const limpiarError = useCallback(() => {
        setEstado(prev => ({ ...prev, error: null }));
    }, []);

    // Seleccionar precio
    const seleccionarPrecio = useCallback((precio: PrecioProducto | null) => {
        setEstado(prev => ({ ...prev, precioEnEdicion: precio }));
    }, []);

    // Obtener compras con diferencia de costo
    const obtenerComprasConDiferenciaCosto = useCallback(async (productoId: number) => {
        try {
            console.log('🔄 Obteniendo compras con diferencia de costo para producto:', productoId);
            setEstado(prev => ({ ...prev, loadingCompras: true, error: null }));
            const datos = await preciosService.obtenerComprasConDiferenciaCosto(productoId);

            console.log('📥 Datos recibidos del backend:', datos);

            // Encontrar el producto en la lista de precios para obtener todos sus precios
            const productoCompleto = estado.precios?.data?.find(p => p.id === productoId);

            // El precioCostoNuevo es el precio de la ÚLTIMA COMPRA APROBADA
            // No calcular, usar directamente del backend
            const precioCostoNuevo = datos.precio_ultima_compra || null;

            console.log('📊 Resumen:', {
                'precio_costo_actual': datos.precio_costo_actual,
                'precio_ultima_compra': datos.precio_ultima_compra,
                'hay_diferencia': precioCostoNuevo && datos.precio_costo_actual && precioCostoNuevo !== datos.precio_costo_actual,
            });

            setEstado(prev => ({
                ...prev,
                comprasConDiferencia: datos.compras || [],
                productoComprasSeleccionado: {
                    id: datos.producto.id,
                    nombre: datos.producto.nombre,
                    sku: datos.producto.sku,
                    precios: productoCompleto?.precios || [], // ✅ NUEVO: Incluir todos los precios
                },
                precioCostoNuevo, // ✅ Precio de la última compra aprobada
                loadingCompras: false,
            }));
        } catch (error: any) {
            console.error('❌ Error al obtener compras:', error);
            setEstado(prev => ({
                ...prev,
                error: error.message || 'Error al obtener compras',
                loadingCompras: false,
            }));
        }
    }, [estado.precios?.data]);

    // Limpiar compras seleccionadas
    const limpiarComprasSeleccionadas = useCallback(() => {
        setEstado(prev => ({
            ...prev,
            comprasConDiferencia: [],
            productoComprasSeleccionado: null,
            precioCostoNuevo: null,
            loadingCompras: false,
        }));
    }, []);

    // Toggle filtro de solo con diferencia de costo
    const toggleSoloConDiferenciaCosto = useCallback(() => {
        setEstado(prev => ({
            ...prev,
            soloConDiferenciaCosto: !prev.soloConDiferenciaCosto,
        }));
    }, []);

    const acciones: UsePreciosActions = {
        obtenerPrecios,
        obtenerHistorial,
        obtenerCambiosRecientes,
        obtenerResumen,
        obtenerComprasConDiferenciaCosto,
        actualizarPrecio,
        actualizarLote,
        limpiarError,
        seleccionarPrecio,
        limpiarComprasSeleccionadas,
        toggleSoloConDiferenciaCosto, // ✅ NUEVO
    };

    return [estado, acciones];
}
