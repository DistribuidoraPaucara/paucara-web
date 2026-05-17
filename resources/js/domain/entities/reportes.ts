import type { BaseEntity } from './generic';
import type { Id } from './shared';

// =============== GANANCIAS REPORT ===============

export interface ProductoGanancia {
  id: number;
  nombre: string;
  categoria?: {
    nombre: string;
  };
}

export interface TipoPrecioGanancia {
  id: number;
  nombre: string;
  color: string;
  configuracion: {
    icono?: string;
  };
}

export interface Ganancia {
  producto: ProductoGanancia;
  tipo_precio: TipoPrecioGanancia;
  precio_venta: number;
  precio_costo: number;
  ganancia: number;
  porcentaje_ganancia: number;
  fecha_actualizacion: string;
}

export interface GananciasEstadisticas {
  total_productos: number;
  ganancia_total: number;
  ganancia_promedio: number;
  porcentaje_promedio: number;
  mejor_ganancia: number;
  peor_ganancia: number;
}

export interface GananciasFilterOptions {
  fecha_desde?: string;
  fecha_hasta?: string;
  tipo_precio_id?: number;
  categoria_id?: number;
}

export interface GananciasPageProps {
  ganancias: Ganancia[];
  estadisticas: GananciasEstadisticas;
  filtros: GananciasFilterOptions;
  tipos_precio: Array<{
    id: number;
    nombre: string;
    color: string;
  }>;
  categorias: Array<{
    id: number;
    nombre: string;
  }>;
  error?: string;
}

// =============== REPORT ENUMS & CONSTANTS ===============

export enum EstadoGanancia {
  EXCELENTE = 'excelente',      // >= 30%
  BUENO = 'bueno',               // >= 15% && < 30%
  REGULAR = 'regular',           // >= 5% && < 15%
  BAJO = 'bajo',                 // >= 0% && < 5%
  PERDIDA = 'perdida',           // < 0%
}

export const ESTADO_GANANCIA_CONFIG = {
  [EstadoGanancia.EXCELENTE]: {
    label: 'Excelente',
    icon: '🔥',
    badge: 'bg-green-100 text-green-800',
    textColor: 'text-green-600',
    minPercent: 30,
  },
  [EstadoGanancia.BUENO]: {
    label: 'Bueno',
    icon: '✅',
    badge: 'bg-green-50 text-green-700',
    textColor: 'text-green-500',
    minPercent: 15,
  },
  [EstadoGanancia.REGULAR]: {
    label: 'Regular',
    icon: '⚠️',
    badge: 'bg-yellow-50 text-yellow-700',
    textColor: 'text-yellow-600',
    minPercent: 5,
  },
  [EstadoGanancia.BAJO]: {
    label: 'Bajo',
    icon: '⚡',
    badge: 'bg-orange-50 text-orange-700',
    textColor: 'text-orange-600',
    minPercent: 0,
  },
  [EstadoGanancia.PERDIDA]: {
    label: 'Pérdida',
    icon: '❌',
    badge: 'bg-red-50 text-red-700',
    textColor: 'text-red-600',
    minPercent: -Infinity,
  },
};

// =============== COLOR MAPPING ===============

export const TIPO_PRECIO_COLOR_MAP = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  pink: 'bg-pink-100 text-pink-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
  teal: 'bg-teal-100 text-teal-800',
} as const;

// =============== MOVIMIENTOS REPORT ===============

export interface StockProductoMovimiento {
  producto: {
    id: number;
    nombre: string;
  };
  almacen: {
    id: number;
    nombre: string;
  };
}

export interface MovimientoInventario {
  id: number;
  tipo: string;
  cantidad: number;
  fecha: string;
  motivo?: string;
  numero_referencia?: string;
  observaciones?: string;
  stock_producto: StockProductoMovimiento;
  user?: {
    id: number;
    name: string;
  };
}

export interface MovimientosEstadisticas {
  total_entradas: number;
  total_salidas: number;
  movimientos_por_tipo: Record<string, number>;
}

export interface MovimientosFilterOptions {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo?: string;
  almacen_id?: number;
  producto_id?: number;
}

export interface MovimientosPaginatedData {
  data: MovimientoInventario[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface MovimientosPageProps {
  movimientos: MovimientosPaginatedData;
  estadisticas: MovimientosEstadisticas;
  filtros: MovimientosFilterOptions;
  tipos: Record<string, string>;
  almacenes: Array<{
    id: number;
    nombre: string;
  }>;
}

// =============== ROTACION REPORT ===============

export interface RotacionItem {
  producto_id: number;
  total_salidas: number;
  cantidad_vendida: number;
  stock_promedio: number;
  indice_rotacion: number;
  producto: {
    id: number;
    nombre: string;
  };
}

export interface RotacionEstadisticas {
  productos_con_movimiento: number;
  productos_sin_movimiento: number;
  rotacion_promedio: number;
}

export interface RotacionFilterOptions {
  fecha_inicio?: string;
  fecha_fin?: string;
  almacen_id?: string;
  categoria_id?: string;
}

export interface RotacionPaginatedData {
  data: RotacionItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface RotacionPageProps {
  rotacion: RotacionPaginatedData;
  estadisticas: RotacionEstadisticas;
  filtros: RotacionFilterOptions;
  almacenes: Array<{
    id: number;
    nombre: string;
  }>;
  categorias: Array<{
    id: number;
    nombre: string;
  }>;
}

// =============== STOCK ACTUAL REPORT ===============

export interface StockItem {
  id: number;
  cantidad: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
  producto: {
    id: number;
    nombre: string;
    sku: string;
    stock_minimo: number;
    stock_maximo: number;
    categoria?: {
      nombre: string;
    };
  };
  almacen: {
    id: number;
    nombre: string;
  };
}

export interface StockEstadisticas {
  total_productos: number;
  total_stock: number;
  productos_stock_bajo: number;
  productos_stock_alto: number;
  valor_total_inventario: number;
}

export interface StockFilterOptions {
  almacen_id?: number;
  categoria_id?: number;
  stock_bajo?: boolean;
  stock_alto?: boolean;
  busqueda?: string;
}

export interface StockPaginatedData {
  data: StockItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface StockPageProps {
  stock: StockPaginatedData;
  estadisticas: StockEstadisticas;
  filtros: StockFilterOptions;
  almacenes: Array<{
    id: number;
    nombre: string;
  }>;
  categorias: Array<{
    id: number;
    nombre: string;
  }>;
}

// =============== VENCIMIENTOS REPORT ===============

export interface ProductoVencimiento {
  id: number;
  cantidad: number;
  fecha_vencimiento: string;
  producto: {
    id: number;
    nombre: string;
    categoria?: {
      id: number;
      nombre: string;
    };
  };
  almacen: {
    id: number;
    nombre: string;
  };
}

export interface VencimientosEstadisticas {
  productos_vencidos: number;
  productos_proximos_vencer: number;
  valor_productos_vencidos: number;
}

export interface VencimientosFilterOptions {
  almacen_id?: string;
  dias_anticipacion?: number;
  solo_vencidos?: boolean;
}

export interface VencimientosPaginatedData {
  data: ProductoVencimiento[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface VencimientosPageProps {
  productos: VencimientosPaginatedData;
  estadisticas: VencimientosEstadisticas;
  filtros: VencimientosFilterOptions;
  almacenes: Array<{
    id: number;
    nombre: string;
  }>;
}

// =============== INVENTARIO ENUMS & CONSTANTS ===============

export enum EstadoMovimiento {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
}

export enum EstadoRotacion {
  ALTA = 'alta',
  MEDIA = 'media',
  BAJA = 'baja',
}

export enum EstadoStock {
  BAJO = 'bajo',
  NORMAL = 'normal',
  ALTO = 'alto',
}

export enum EstadoVencimiento {
  VENCIDO = 'VENCIDO',
  PROXIMO_A_VENCER = 'PRÓXIMO A VENCER',
  VIGENTE = 'VIGENTE',
}

export const TIPO_MOVIMIENTO_CONFIG = {
  entrada: {
    color: 'default',
    icon: 'TrendingUp',
  },
  salida: {
    color: 'destructive',
    icon: 'TrendingDown',
  },
} as const;

export const ESTADO_ROTACION_CONFIG = {
  [EstadoRotacion.ALTA]: {
    badge: 'bg-green-100 text-green-800',
    label: 'Alta',
  },
  [EstadoRotacion.MEDIA]: {
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'Media',
  },
  [EstadoRotacion.BAJA]: {
    badge: 'bg-red-100 text-red-800',
    label: 'Baja',
  },
} as const;

export const ESTADO_STOCK_CONFIG = {
  [EstadoStock.BAJO]: {
    color: 'destructive',
    icon: 'TrendingDown',
    label: 'Stock Bajo',
  },
  [EstadoStock.NORMAL]: {
    color: 'secondary',
    icon: 'Package2',
    label: 'Normal',
  },
  [EstadoStock.ALTO]: {
    color: 'outline',
    icon: 'TrendingUp',
    label: 'Stock Alto',
  },
} as const;

export const ESTADO_VENCIMIENTO_CONFIG = {
  [EstadoVencimiento.VENCIDO]: {
    className: 'bg-red-100 text-red-800',
    color: 'destructive',
    label: 'VENCIDO',
  },
  [EstadoVencimiento.PROXIMO_A_VENCER]: {
    className: 'bg-yellow-100 text-yellow-800',
    color: 'default',
    label: 'PRÓXIMO A VENCER',
  },
  [EstadoVencimiento.VIGENTE]: {
    className: 'bg-green-100 text-green-800',
    color: 'secondary',
    label: 'VIGENTE',
  },
} as const;

// =============== PRECIOS REPORT ===============

export interface PrecioItem {
  id: number;
  nombre: string;
  precio: number;
  fecha_ultima_actualizacion: string;
  producto: {
    id: number;
    nombre: string;
    categoria?: {
      nombre: string;
    };
  };
  tipo_precio: {
    id: number;
    nombre: string;
    color: string;
    configuracion: {
      icono?: string;
    };
  };
}

export interface PreciosEstadisticas {
  total_precios: number;
  precio_promedio: number;
  precio_minimo: number;
  precio_maximo: number;
  total_productos_con_precio: number;
}

export interface PreciosFilterOptions {
  fecha_desde?: string;
  fecha_hasta?: string;
  tipo_precio_id?: number;
  categoria_id?: number;
  producto_id?: number;
}

export interface PreciosPaginatedData {
  data: PrecioItem[];
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  meta: {
    current_page?: number;
    from?: number;
    last_page?: number;
    per_page?: number;
    to?: number;
    total?: number;
  };
}

export interface PreciosPageProps {
  precios: PreciosPaginatedData;
  estadisticas: PreciosEstadisticas;
  filtros: PreciosFilterOptions;
  tipos_precio: Array<{
    id: number;
    nombre: string;
    color: string;
  }>;
  categorias: Array<{
    id: number;
    nombre: string;
  }>;
}
