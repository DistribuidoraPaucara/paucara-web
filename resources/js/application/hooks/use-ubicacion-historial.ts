import { useState, useCallback, useMemo } from 'react';
import type { Id } from '@/domain/entities/shared';

interface HistoricalLocation {
    lat: number;
    lng: number;
    timestamp: string;
    velocidad?: number;
}

interface UseUbicacionHistorialOptions {
    maxPoints?: number; // Máximo de puntos a guardar por entrega
}

interface UseUbicacionHistorialReturn {
    historial: Map<Id, HistoricalLocation[]>;
    agregarUbicacion: (entregaId: Id, lat: number, lng: number, velocidad?: number) => void;
    obtenerHistorial: (entregaId: Id) => HistoricalLocation[];
    obtenerDistanciaRecorrida: (entregaId: Id) => number;
    limpiarHistorial: (entregaId: Id) => void;
    limpiarTodo: () => void;
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param lat1 Latitud del primer punto
 * @param lng1 Longitud del primer punto
 * @param lat2 Latitud del segundo punto
 * @param lng2 Longitud del segundo punto
 * @returns Distancia en kilómetros
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Application Layer Hook - useUbicacionHistorial
 *
 * Encapsula la gestión del historial de ubicaciones para entregas:
 * - Almacena hasta N puntos por entrega (configurable, máximo 100 por defecto)
 * - Calcula distancia recorrida usando Haversine
 * - Proporciona datos para polylines de recorrido histórico
 * - Limpia automáticamente cuando se alcanza el límite
 *
 * @example
 * const { historial, agregarUbicacion, obtenerDistanciaRecorrida } = useUbicacionHistorial();
 *
 * // Agregar ubicación
 * agregarUbicacion(123, -17.78, -63.18, 45.5);
 *
 * // Obtener distancia recorrida
 * const km = obtenerDistanciaRecorrida(123);
 */
export function useUbicacionHistorial(options: UseUbicacionHistorialOptions = {}) {
    const { maxPoints = 100 } = options;

    const [historial, setHistorial] = useState<Map<Id, HistoricalLocation[]>>(new Map());

    /**
     * Agregar una nueva ubicación al historial de una entrega
     */
    const agregarUbicacion = useCallback(
        (entregaId: Id, lat: number, lng: number, velocidad?: number) => {
            setHistorial((prevHistorial) => {
                const nuevoHistorial = new Map(prevHistorial);
                const ubicacionesActuales = nuevoHistorial.get(entregaId) || [];

                // Crear nueva ubicación
                const nuevaUbicacion: HistoricalLocation = {
                    lat,
                    lng,
                    timestamp: new Date().toISOString(),
                    velocidad,
                };

                // Agregar nueva ubicación
                const ubicacionesActualizadas = [...ubicacionesActuales, nuevaUbicacion];

                // Mantener solo los últimos N puntos
                if (ubicacionesActualizadas.length > maxPoints) {
                    ubicacionesActualizadas.shift();
                }

                nuevoHistorial.set(entregaId, ubicacionesActualizadas);
                return nuevoHistorial;
            });
        },
        [maxPoints]
    );

    /**
     * Obtener el historial completo de una entrega
     */
    const obtenerHistorial = useCallback(
        (entregaId: Id): HistoricalLocation[] => {
            return historial.get(entregaId) || [];
        },
        [historial]
    );

    /**
     * Calcular la distancia total recorrida en una entrega
     * Usa la fórmula de Haversine para mayor precisión
     */
    const obtenerDistanciaRecorrida = useCallback(
        (entregaId: Id): number => {
            const ubicaciones = historial.get(entregaId) || [];

            if (ubicaciones.length < 2) {
                return 0;
            }

            let distanciaTotal = 0;

            // Iterar sobre ubicaciones consecutivas
            for (let i = 0; i < ubicaciones.length - 1; i++) {
                const ubi1 = ubicaciones[i];
                const ubi2 = ubicaciones[i + 1];

                const distancia = haversineDistance(
                    ubi1.lat,
                    ubi1.lng,
                    ubi2.lat,
                    ubi2.lng
                );

                distanciaTotal += distancia;
            }

            // Redondear a 2 decimales
            return Math.round(distanciaTotal * 100) / 100;
        },
        [historial]
    );

    /**
     * Limpiar el historial de una entrega específica
     */
    const limpiarHistorial = useCallback((entregaId: Id) => {
        setHistorial((prevHistorial) => {
            const nuevoHistorial = new Map(prevHistorial);
            nuevoHistorial.delete(entregaId);
            return nuevoHistorial;
        });
    }, []);

    /**
     * Limpiar todo el historial
     */
    const limpiarTodo = useCallback(() => {
        setHistorial(new Map());
    }, []);

    return {
        historial,
        agregarUbicacion,
        obtenerHistorial,
        obtenerDistanciaRecorrida,
        limpiarHistorial,
        limpiarTodo,
    };
}
