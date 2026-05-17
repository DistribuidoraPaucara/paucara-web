/**
 * Utilities for Compras (Purchases) Reportes
 *
 * Helpers para formateo, estilos y utilidades de reportes
 */

import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Formatea un monto a formato de moneda boliviana
 *
 * @param amount Monto a formatear
 * @returns Monto formateado como BOB
 */
export const formatCurrency = (amount?: number | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return 'Bs. 0.00';
    }
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Formatea una cadena de fecha a formato legible
 *
 * @param dateString Fecha en formato ISO o string
 * @returns Fecha formateada en es-ES
 */
export const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
};

/**
 * Formatea un porcentaje con signo
 *
 * @param value Valor numérico del porcentaje
 * @returns Porcentaje formateado con signo (ej: +5.2% o -3.1%)
 */
export const formatPercentage = (value?: number | null): string => {
    if (value === undefined || value === null) return '+0.0%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

/**
 * Obtiene la clase de color basado en la variación
 *
 * @param variacion Valor de variación
 * @returns Clase Tailwind de color
 */
export const getVariacionColor = (variacion: number): string => {
    if (variacion > 0) return 'text-green-600';
    if (variacion < 0) return 'text-red-600';
    return 'text-gray-600';
};

/**
 * Obtiene el ícono correspondiente a la variación
 *
 * @param variacion Valor de variación
 * @returns Ícono de tendencia o null
 */
export const getVariacionIcon = (variacion: number): ReactNode => {
    if (variacion > 0) return <TrendingUp className="w-4 h-4" />;
    if (variacion < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
};

/**
 * Genera clases CSS para mostrar variación
 *
 * @param variacion Valor de variación
 * @returns Clases Tailwind combinadas
 */
export const getVariacionClasses = (variacion: number): string => {
    return `flex items-center ${getVariacionColor(variacion)}`;
};

/**
 * Determina el nivel de alarma basado en porcentaje
 *
 * @param porcentaje Porcentaje del total
 * @returns Nivel: 'alto', 'medio' o 'bajo'
 */
export const getNivelImportancia = (porcentaje: number): 'alto' | 'medio' | 'bajo' => {
    if (porcentaje >= 30) return 'alto';
    if (porcentaje >= 10) return 'medio';
    return 'bajo';
};

/**
 * Obtiene color de badge basado en nivel de importancia
 *
 * @param nivel Nivel de importancia
 * @returns Variante de badge
 */
export const getBadgeVariantPorNivel = (nivel: 'alto' | 'medio' | 'bajo'): 'default' | 'secondary' | 'outline' => {
    switch (nivel) {
        case 'alto':
            return 'default';
        case 'medio':
            return 'secondary';
        case 'bajo':
            return 'outline';
    }
};

/**
 * Valida fechas de rango
 *
 * @param fechaInicio Fecha de inicio
 * @param fechaFin Fecha de fin
 * @returns true si el rango es válido
 */
export const esRangoFechasValido = (fechaInicio: string, fechaFin: string): boolean => {
    if (!fechaInicio || !fechaFin) return true;

    try {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return inicio <= fin;
    } catch {
        return false;
    }
};

/**
 * Construye URL con parámetros de filtro
 *
 * @param filtros Objeto con filtros
 * @returns URL query string
 */
export const construirUrlFiltros = (filtros: Record<string, any>): string => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== '') {
            params.set(key, String(value));
        }
    });

    return params.toString();
};

/**
 * Obtiene valor por defecto para campos numéricos
 *
 * @param valor Valor a validar
 * @param defecto Valor por defecto
 * @returns Valor válido o valor por defecto
 */
export const obtenerValorSeguro = (valor: number | undefined, defecto: number = 0): number => {
    return valor ?? defecto;
};
