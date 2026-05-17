import type { EstadoGanancia } from '@/domain/entities/reportes';
import { ESTADO_GANANCIA_CONFIG } from '@/domain/entities/reportes';

/**
 * Obtiene la clase CSS para el color del tipo de precio
 * @param color - Color definido en el tipo de precio
 * @returns Clase CSS de Tailwind para mostrar el badge
 */
export function getColorClass(color: string): string {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-800',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    gray: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800',
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.gray;
}

/**
 * Obtiene la clase CSS para el color del porcentaje de ganancia
 * @param porcentaje - Porcentaje de ganancia
 * @returns Clase CSS de Tailwind para el texto
 */
export function getGananciaColor(porcentaje: number): string {
  if (porcentaje >= 30) return 'text-green-600 dark:text-green-400';
  if (porcentaje >= 15) return 'text-green-500 dark:text-green-300';
  if (porcentaje >= 5) return 'text-yellow-600 dark:text-yellow-400';
  if (porcentaje >= 0) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Obtiene el estado de ganancia basado en el porcentaje
 * @param porcentaje - Porcentaje de ganancia
 * @returns Estado de ganancia con su configuración
 */
export function getEstadoGanancia(porcentaje: number): {
  estado: EstadoGanancia;
  label: string;
  icon: string;
  badge: string;
  textColor: string;
} {
  let estado: EstadoGanancia;

  if (porcentaje >= 30) {
    estado = 'excelente' as EstadoGanancia;
  } else if (porcentaje >= 15) {
    estado = 'bueno' as EstadoGanancia;
  } else if (porcentaje >= 5) {
    estado = 'regular' as EstadoGanancia;
  } else if (porcentaje >= 0) {
    estado = 'bajo' as EstadoGanancia;
  } else {
    estado = 'perdida' as EstadoGanancia;
  }

  const config = ESTADO_GANANCIA_CONFIG[estado];
  return {
    estado,
    label: config.label,
    icon: config.icon,
    badge: config.badge,
    textColor: config.textColor,
  };
}

/**
 * Formatea un valor monetario según la moneda especificada
 * @param value - Valor a formatear
 * @param currency - Código de moneda (default: BOB)
 * @param locale - Locale para el formato (default: es-BO)
 * @returns Valor formateado como moneda
 */
export function formatCurrency(
  value: number,
  currency: string = 'BOB',
  locale: string = 'es-BO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un valor monetario con decimales
 * @param value - Valor a formatear
 * @param currency - Código de moneda (default: BOB)
 * @param decimals - Número de decimales (default: 2)
 * @param locale - Locale para el formato (default: es-BO)
 * @returns Valor formateado como moneda
 */
export function formatCurrencyWithDecimals(
  value: number,
  currency: string = 'BOB',
  decimals: number = 2,
  locale: string = 'es-BO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formatea un porcentaje
 * @param value - Valor a formatear
 * @param decimals - Número de decimales (default: 1)
 * @returns Valor formateado como porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea una fecha sin incluir hora
 * @param date - Fecha a formatear (string o Date)
 * @param locale - Locale para el formato (default: es-ES)
 * @returns Fecha formateada (ej: 17 de diciembre de 2025)
 */
export function formatDateOnly(date: string | Date, locale: string = 'es-ES'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
