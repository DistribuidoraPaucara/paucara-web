import type {
  EstadoRotacion,
  EstadoStock,
  EstadoVencimiento,
  StockItem,
} from '@/domain/entities/reportes';
import {
  ESTADO_ROTACION_CONFIG,
  ESTADO_STOCK_CONFIG,
  ESTADO_VENCIMIENTO_CONFIG,
} from '@/domain/entities/reportes';
import { TrendingDown, TrendingUp, Package2, AlertTriangle, Clock } from 'lucide-react';

/**
 * Formatea un número con separadores de miles según la localización
 */
export function formatNumber(value: number, locale: string = 'es-BO'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(
  dateString: string,
  locale: string = 'es-BO',
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Date(dateString).toLocaleDateString(locale, defaultOptions);
}

/**
 * Formatea una fecha sin hora
 */
export function formatDateOnly(dateString: string, locale: string = 'es-BO'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatea un número como moneda
 */
export function formatCurrency(
  value: number,
  currency: string = 'BOB',
  locale: string = 'es-BO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formatea un número con decimales especificados
 */
export function formatDecimal(
  value: number,
  decimals: number = 2,
  locale: string = 'es-BO'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Obtiene el color del badge para un tipo de movimiento
 */
export function getTipoMovimientoColor(tipo: string): 'default' | 'secondary' | 'destructive' {
  if (tipo.includes('entrada') || tipo.includes('compra') || tipo.includes('devolucion')) {
    return 'default';
  }
  if (tipo.includes('salida') || tipo.includes('venta') || tipo.includes('merma')) {
    return 'destructive';
  }
  return 'secondary';
}

/**
 * Obtiene el icono para un tipo de movimiento
 */
export function getTipoMovimientoIcon(
  tipo: string
): React.ComponentType<{ className?: string }> {
  if (tipo.includes('entrada') || tipo.includes('compra') || tipo.includes('devolucion')) {
    return TrendingUp;
  }
  if (tipo.includes('salida') || tipo.includes('venta') || tipo.includes('merma')) {
    return TrendingDown;
  }
  return Package2;
}

/**
 * Obtiene la configuración de badge para un índice de rotación
 */
export function getRotacionBadge(
  indice: number
): { badge: string; label: string; nivel: EstadoRotacion } {
  if (indice >= 6) {
    return {
      badge: ESTADO_ROTACION_CONFIG.alta.badge,
      label: ESTADO_ROTACION_CONFIG.alta.label,
      nivel: 'alta' as EstadoRotacion,
    };
  } else if (indice >= 3) {
    return {
      badge: ESTADO_ROTACION_CONFIG.media.badge,
      label: ESTADO_ROTACION_CONFIG.media.label,
      nivel: 'media' as EstadoRotacion,
    };
  } else {
    return {
      badge: ESTADO_ROTACION_CONFIG.baja.badge,
      label: ESTADO_ROTACION_CONFIG.baja.label,
      nivel: 'baja' as EstadoRotacion,
    };
  }
}

/**
 * Obtiene el estado del stock para un item
 */
export function getStockStatus(
  item: StockItem
): {
  status: EstadoStock;
  color: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
} {
  const { cantidad, producto } = item;

  if (producto.stock_minimo > 0 && cantidad < producto.stock_minimo) {
    return {
      status: 'bajo' as EstadoStock,
      color: 'destructive',
      icon: TrendingDown,
      label: ESTADO_STOCK_CONFIG.bajo.label,
    };
  }

  if (producto.stock_maximo > 0 && cantidad > producto.stock_maximo) {
    return {
      status: 'alto' as EstadoStock,
      color: 'outline',
      icon: TrendingUp,
      label: ESTADO_STOCK_CONFIG.alto.label,
    };
  }

  return {
    status: 'normal' as EstadoStock,
    color: 'secondary',
    icon: Package2,
    label: ESTADO_STOCK_CONFIG.normal.label,
  };
}

/**
 * Obtiene el estado de vencimiento de un producto
 */
export function getVencimientoStatus(
  fechaVencimiento: string
): {
  estado: EstadoVencimiento;
  color: 'default' | 'secondary' | 'destructive';
  className: string;
  dias: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
} {
  const hoy = new Date();
  const fechaVenc = new Date(fechaVencimiento);
  const diasDiferencia = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 3600 * 24));

  if (diasDiferencia < 0) {
    return {
      estado: 'VENCIDO' as EstadoVencimiento,
      color: 'destructive',
      className: ESTADO_VENCIMIENTO_CONFIG.VENCIDO.className,
      dias: Math.abs(diasDiferencia),
      icon: AlertTriangle,
      label: ESTADO_VENCIMIENTO_CONFIG.VENCIDO.label,
    };
  } else if (diasDiferencia <= 30) {
    return {
      estado: 'PRÓXIMO A VENCER' as EstadoVencimiento,
      color: 'default',
      className: ESTADO_VENCIMIENTO_CONFIG['PRÓXIMO A VENCER'].className,
      dias: diasDiferencia,
      icon: Clock,
      label: ESTADO_VENCIMIENTO_CONFIG['PRÓXIMO A VENCER'].label,
    };
  } else {
    return {
      estado: 'VIGENTE' as EstadoVencimiento,
      color: 'secondary',
      className: ESTADO_VENCIMIENTO_CONFIG.VIGENTE.className,
      dias: diasDiferencia,
      icon: Package2,
      label: ESTADO_VENCIMIENTO_CONFIG.VIGENTE.label,
    };
  }
}

/**
 * Calcula los días de diferencia entre hoy y una fecha dada
 */
export function calcularDiasDiferencia(fechaVencimiento: string): number {
  const hoy = new Date();
  const fechaVenc = new Date(fechaVencimiento);
  return Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
}
