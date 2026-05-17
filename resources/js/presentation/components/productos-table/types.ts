import type { Producto } from '@/domain/entities/ventas';

// ✅ Tipos generales de ProductosTable (2026-03-28: Refactorización)
export interface DetalleProducto {
    id?: number | string;
    numero?: number | string; // ✅ NUEVO: Número de línea o identificador
    producto_id: number | string;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
    lote?: string;
    fecha_vencimiento?: string;
    precio_costo?: number; // ✅ NUEVO: Precio de costo registrado
    unidad_venta_id?: number | string; // ✅ NUEVO: Unidad de venta para productos fraccionados
    conversiones?: Array<{
        unidad_destino_id: number | string;
        unidad_destino_nombre?: string;
        factor_conversion: number;
    }>; // ✅ NUEVO: Conversiones disponibles
    es_fraccionado?: boolean; // ✅ NUEVO: Indica si el producto es fraccionado
    unidad_medida_id?: number | string; // ✅ NUEVO: Unidad base del producto
    unidad_medida_nombre?: string; // ✅ NUEVO: Nombre de la unidad base
    tipo_precio_id?: number | string | null; // ✅ MODIFICADO: Permite null cuando cliente es GENERAL
    tipo_precio_nombre?: string | null; // ✅ MODIFICADO: Permite null cuando cliente es GENERAL
    tipo_precio_id_recomendado?: number | string | null; // ✅ NUEVO: ID de tipo de precio recomendado del backend
    tipo_precio_nombre_recomendado?: string | null; // ✅ NUEVO: Nombre de tipo de precio recomendado del backend
    producto?: {
        id: number | string;
        nombre: string;
        codigo?: string;
        codigo_barras?: string;
        precio_venta?: number;
        precio_compra?: number;
        precio_costo?: number; // ✅ NUEVO: Precio de costo
        peso?: number; // ✅ NUEVO: Peso del producto en kg
        es_fraccionado?: boolean;
        sku?: string; // ✅ NUEVO 2026-03-06
        marca?: { id?: number; nombre?: string } | null; // ✅ NUEVO 2026-03-06: Mantener como objeto
        unidad?: { id?: number; codigo?: string; nombre?: string } | null; // ✅ NUEVO 2026-03-06: Mantener como objeto
        conversiones?: Array<{
            unidad_destino_id: number | string;
            unidad_destino_nombre?: string;
            factor_conversion: number;
        }>;
        // ✅ NUEVO: Incluir precios disponibles para selección de tipo de precio
        precios?: Array<{
            id: number | string;
            tipo_precio_id: number | string;
            nombre: string;
            precio: number;
        }>;
    };
}

export interface ProductosTableProps {
    productos: Producto[]; // Ahora solo para referencia de IDs (podría no usarse)
    detalles: DetalleProducto[];
    onAddProduct: (producto: Producto) => void;
    onUpdateDetail: (index: number, field: keyof DetalleProducto, value: number | string) => void;
    onRemoveDetail: (index: number) => void;
    onTotalsChange: (detalles: DetalleProducto[]) => void;
    tipo: 'compra' | 'venta';
    errors?: Record<string, string>;
    showLoteFields?: boolean; // Para mostrar campos de lote y fecha de vencimiento en compras
    almacen_id?: number; // ✅ NUEVO: Almacén para búsqueda API
    cliente_id?: number | null; // ✅ NUEVO: Cliente para filtrar tipos_precio (LICORERIA vs VENTA)
    isClienteGeneral?: boolean; // ✅ NUEVO: Indicar si es cliente GENERAL para seleccionar tipo de precio LICORERIA
    manuallySelectedTipoPrecio?: Record<number, boolean>; // ✅ NUEVO: Track cuáles fueron selecciones manuales del usuario
    isCalculatingPrices?: boolean; // ✅ NUEVO: Mostrar indicador de carga al calcular precios
    readOnly?: boolean; // ✅ NUEVO: Deshabilitar edición de detalles (para APROBADO+)
    onUpdateDetailUnidadConPrecio?: (index: number, unidadId: number, precio: number) => void; // ✅ NUEVO: Actualizar unidad y precio juntos
    onManualTipoPrecioChange?: (index: number) => void; // ✅ NUEVO: Notificar cuando usuario selecciona manualmente un tipo de precio
    onComboItemsChange?: (detailIndex: number, items: any[]) => void; // ✅ NUEVO: Notificar cuando cambian los items opcionales del combo
    default_tipo_precio_id?: number | string; // ✅ NUEVO: ID del tipo de precio por defecto (fallback cuando no hay tipo asignado)
    carritoCalculado?: any; // ✅ NUEVO (2026-02-17): Datos de rangos aplicados para actualizar precios automáticamente
    onDetallesActualizados?: (detalles: DetalleProducto[]) => void; // ✅ NUEVO (2026-02-17): Callback cuando se actualizan detalles por cambios de rangos
    es_farmacia?: boolean; // ✅ NUEVO: Indicador para mostrar/ocultar campos de medicamentos en sugerencias
}
