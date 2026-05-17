// Domain: Productos
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { TipoPrecio } from './tipos-precio';

export interface Precio {
  id?: number;
  monto: number;
  tipo_precio_id: number;
  unidad_medida_id?: number | null;
  moneda?: string;
  motivo_cambio?: string;
  fecha_aplicacion?: string;
}

export interface CodigoBarra {
  id?: number;
  codigo: string;
  tipo?: string;
  es_principal?: boolean;
}

export interface Imagen {
  id?: number;
  url?: string;
  file?: File | null;
}

export interface StockAlmacen {
  id?: number; // ✨ NUEVO: ID del registro StockProducto (para identificar si es crear o actualizar)
  almacen_id: number | string;
  almacen_nombre?: string;
  sector_id?: number | string | null;
  sector_nombre?: string | null;
  stock: number;
  cantidad_disponible?: number; // ✨ NUEVO: Cantidad disponible (readonly)
  cantidad_reservada?: number; // ✨ NUEVO: Cantidad reservada (readonly)
  lote?: string | null;
  fecha_vencimiento?: string | null;
}

export interface Producto extends BaseEntity {
  id: Id;
  nombre: string;
  sku?: string | null;
  codigo?: string | null; // Código del producto (usado en vista de proformas)
  descripcion?: string | null;
  peso?: number | null;
  unidad_medida_id?: Id;
  codigo_barras?: string | null;
  codigo_qr?: string | null;
  stock_minimo?: number;
  stock_maximo?: number;
  activo: boolean;
  fecha_creacion?: string | null;
  es_alquilable?: boolean;
  es_combo?: boolean; // Indica si es un combo de productos
  es_fraccionado?: boolean; // ✨ NUEVO: Permite conversiones de unidades
  permite_venta_sin_stock?: boolean; // ✅ NUEVO (2026-05-08): Para servicios/inyectables en farmacias
  principio_activo?: string | null; // ✨ NUEVO: Ingrediente activo para medicamentos
  uso_de_medicacion?: string | null; // ✨ NUEVO: Indicaciones de uso para medicamentos
  visible_app?: boolean; // ✨ NUEVO: Visible en app móvil
  categoria_id?: Id;
  marca_id?: Id;
  proveedor_id?: Id;
  precio_base?: number | null; // Nuevo campo para index / tarjetas
  stock_total?: number; // Total consolidado de stock

  // Relaciones
  categoria: { id: Id; nombre: string }; // ✅ OBLIGATORIO - Todo producto debe tener categoría
  marca: { id: Id; nombre: string }; // ✅ OBLIGATORIO - Todo producto debe tener marca
  proveedor?: { id: Id; nombre: string; razon_social?: string };
  unidad?: { id: Id; codigo: string; nombre: string };

  // Campos complejos del frontend
  perfil?: Imagen | null;
  galeria?: Imagen[];
  precios?: Precio[];
  codigos?: CodigoBarra[] | string; // ✅ ACTUALIZADO: Ahora es array completo de CodigoBarra (antes era string del segundo código)
  codigosBarra?: CodigoBarra[]; // Relación con tabla codigos_barra (alias de codigos)
  almacenes?: StockAlmacen[];
  conversiones?: ConversionUnidad[]; // ✨ NUEVO: Conversiones de unidad
}

export interface ConversionUnidad {
  id?: Id;
  producto_id?: Id;
  unidad_base_id: Id;
  unidad_destino_id: Id;
  factor_conversion: number;
  activo: boolean;
  es_conversion_principal: boolean;
  unidad_base?: { id: Id; codigo: string; nombre: string };
  unidad_destino?: { id: Id; codigo: string; nombre: string };
}

export interface ProductoFormData extends BaseFormData {
  id?: Id;
  nombre: string;
  sku?: string | null;
  descripcion?: string | null;
  peso?: number | null;
  unidad_medida_id?: Id | '';
  numero?: string | null;
  fecha_vencimiento?: string | null;
  categoria_id?: Id | '';
  marca_id?: Id | '';
  proveedor_id?: Id | '';
  stock_minimo?: number | null;
  stock_maximo?: number | null;
  limite_venta?: number | null; // ✨ NUEVO: Límite máximo por venta
  activo?: boolean;
  es_combo?: boolean; // Indica si es un combo de productos
  es_fraccionado?: boolean; // ✨ NUEVO: Permite conversiones de unidades
  es_producto_comida?: boolean; // 🍦 NUEVO: Producto de comida/helado sin stock
  permite_venta_sin_stock?: boolean; // ✅ NUEVO (2026-05-08): Para servicios/inyectables en farmacias
  principio_activo?: string | null; // ✨ NUEVO: Ingrediente activo para medicamentos
  uso_de_medicacion?: string | null; // ✨ NUEVO: Indicaciones de uso para medicamentos
  visible_app?: boolean; // ✨ NUEVO: Visible en app móvil
  precios: Precio[];
  codigos: CodigoBarra[];
  almacenes?: StockAlmacen[];
  conversiones?: ConversionUnidad[]; // ✨ NUEVO: Conversiones de unidad (frontend only)
}

// ✅ PageProps para el formulario de producto
export interface ProductoFormPageProps {
  producto?: Producto | null;
  categorias: Array<{ id: number; nombre: string }>;
  marcas: Array<{ id: number; nombre: string }>;
  proveedores: Array<{ id: number; nombre: string; razon_social?: string }>;
  unidades: Array<{ id: number; codigo: string; nombre: string }>;
  tipos_precio: TipoPrecio[];
  configuraciones_ganancias?: { porcentaje_interes_general?: number; tipo_precio_ganancia_id?: number };
  historial_precios?: HistorialPrecio[];
  conversiones?: ConversionUnidad[]; // ✨ NUEVO: Conversiones existentes (si está editando)
  permite_productos_fraccionados?: boolean; // ✨ NUEVO: Indicador de empresa para mostrar/ocultar sección
  es_farmacia?: boolean; // ✨ NUEVO: Indicador de empresa farmacia para mostrar/ocultar campos de medicamentos
}

export interface HistorialPrecio {
  id: number;
  tipo_precio_id: number;
  tipo_precio_nombre: string;
  valor_anterior: number;
  valor_nuevo: number;
  fecha_cambio: string;
  motivo: string;
  usuario: string;
  porcentaje_cambio: number;
}

// Funciones utilitarias para cálculos de precios
export const calcularPrecioConGanancia = (precioCosto: number, porcentajeGanancia: number): number => {
  if (!Number.isFinite(precioCosto) || precioCosto < 0) return 0;
  if (!Number.isFinite(porcentajeGanancia)) return precioCosto;

  return Number((precioCosto * (1 + porcentajeGanancia / 100)).toFixed(2));
};

export const calcularPorcentajeGanancia = (precioVenta: number, precioCosto: number): number => {
  if (!Number.isFinite(precioVenta) || !Number.isFinite(precioCosto) || precioCosto <= 0) return 0;

  return Number((((precioVenta - precioCosto) / precioCosto) * 100).toFixed(2));
};

export const obtenerPrecioCosto = (precios: Precio[], tiposPrecio: Array<{ id?: number; value?: number; label?: string; nombre?: string; codigo?: string }>): number => {
  const tipoCosto = tiposPrecio.find(tp =>
    tp.label?.toLowerCase().includes('costo') ||
    tp.nombre?.toLowerCase().includes('costo') ||
    tp.codigo?.toLowerCase().includes('costo')
  );

  if (!tipoCosto) return 0;

  const precioCosto = precios.find(p =>
    p.tipo_precio_id === tipoCosto.value ||
    p.tipo_precio_id === tipoCosto.id
  );

  return precioCosto?.monto || 0;
};

// =============== FILTROS ===============

export interface FiltrosProductos {
  q?: string;
  categoria_id?: string;
  marca_id?: string;
  activo?: string;
  stock_minimo?: string;
  stock_maximo?: string;
  precio_desde?: string;
  precio_hasta?: string;
  sort_by?: string;
  sort_dir?: string;
  [key: string]: string | undefined;
}

export interface DatosParaFiltrosProductos {
  categorias: Array<{ id: Id; nombre: string }>;
  marcas: Array<{ id: Id; nombre: string }>;
}
