/**
 * Entidades de dominio para carga masiva de productos
 */

/**
 * Fila raw parseada del CSV
 */
export interface FilaProductoCSV {
  fila: number;
  nombre: string;
  descripcion?: string;
  principio_activo?: string;
  uso_de_medicacion?: string;
  sku?: string;
  codigo_barra?: string;
  proveedor_nombre?: string;
  unidad_medida_nombre?: string;
  cantidad: number;
  precio_costo?: number;
  precio_venta?: number;
  lote?: string;
  fecha_vencimiento?: string;
  categoria_nombre?: string;
  marca_nombre?: string;
  almacen_id?: number;
  almacen_nombre?: string;
}

/**
 * Fila validada con información de validación
 */
export interface FilaProductoValidada extends FilaProductoCSV {
  validacion: {
    es_valido: boolean;
    errores: string[];
    advertencias: string[];
  };
  producto_existente?: {
    id: number;
    nombre: string;
    sku: string;
    accion: 'crear' | 'actualizar';
    // Nuevos campos para detalle de producto existente
    criterio_deteccion?: 'codigo_barra' | 'nombre';
    stock_total?: number;
    stock_almacen_destino?: number;
    detalles_por_almacen?: Array<{
      almacen: string;
      cantidad: number;
      lotes: number;
    }>;
    preview_suma?: number;
    preview_reemplazo?: number;
  };
  // Acción de stock elegida por el usuario
  accion_stock?: 'sumar' | 'reemplazar';
}

/**
 * Resultado de validación de todas las filas
 */
export interface ResultadoValidacion {
  es_valido: boolean;
  cantidad_filas: number;
  cantidad_validas: number;
  cantidad_errores: number;
  filas_validadas: FilaProductoValidada[];
  resumen_errores: {
    tipo: string;
    cantidad: number;
    ejemplos: string[];
  }[];
}

/**
 * Producto listo para procesar
 */
export interface ProductoParaProcesar {
  nombre: string;
  descripcion?: string;
  principio_activo?: string;
  uso_de_medicacion?: string;
  sku?: string;
  codigo_barra?: string;
  proveedor_nombre?: string;
  unidad_medida_nombre?: string;
  cantidad: number;
  precio_costo?: number;
  precio_venta?: number;
  lote?: string;
  fecha_vencimiento?: string;
  categoria_nombre?: string;
  marca_nombre?: string;
  almacen_id?: number;
  almacen_nombre?: string;
}

/**
 * Payload para enviar al servidor
 */
export interface DatosProductosMasivos {
  nombre_archivo: string;
  datos_csv: string;
  productos: ProductoParaProcesar[];
}

/**
 * Resultado de la carga masiva
 */
export interface ResultadoProductosMasivos {
  success: boolean;
  cargo_id: number;
  cantidad_total: number;
  cantidad_procesados: number;
  cantidad_errores: number;
  resumen?: {
    cantidad_total: number;
    cantidad_procesados: number;
    cantidad_saltadas: number;
    cantidad_errores: number;
  };
  errores: Array<{
    fila: number;
    mensaje: string;
  }>;
  saltados_detalle?: Array<{
    fila: number;
    producto_nombre: string;
    motivo: string;
  }>;
  mensaje: string;
}

/**
 * Estado de una carga masiva
 */
export interface CargoCSVProducto {
  id: number;
  usuario_id: number;
  nombre_archivo: string;
  hash_archivo: string;
  cantidad_filas: number;
  cantidad_validas: number;
  cantidad_errores: number;
  estado: 'pendiente' | 'procesado' | 'cancelado' | 'revertido';
  datos_json: string;
  errores_json: Array<{ fila: number; mensaje: string }> | null;
  cambios_json: Array<{
    fila: number;
    producto_id: number;
    producto_nombre: string;
    accion: 'creado' | 'actualizado';
    stock_anterior: number;
    stock_nuevo: number;
  }> | null;
  revertido_por_usuario_id: number | null;
  fecha_reversion: string | null;
  motivo_reversion: string | null;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
  usuarioReversion?: {
    id: number;
    nombre: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Respuesta de historial de cargas
 */
export interface HistorialCargas {
  data: CargoCSVProducto[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

/**
 * Producto duplicado detectado
 */
export interface DuplicadoDetectado {
  fila: number;
  nombre: string;
  codigo_barras?: string;
  producto_id: number;
  acciones: ('crear' | 'actualizar' | 'agrupar')[];
}

/**
 * Errores detectados en validación
 */
export interface ErroresDetectados {
  campos_vacios: {
    fila: number;
    campos: string[];
  }[];
  valores_invalidos: {
    fila: number;
    campo: string;
    valor: unknown;
    motivo: string;
  }[];
  duplicados: DuplicadoDetectado[];
  advertencias: {
    fila: number;
    mensaje: string;
    tipo: 'precio_bajo' | 'vencimiento_proximo' | 'sin_codigo' | 'otra';
  }[];
}

/**
 * Request para validación con backend
 */
export interface ValidacionBackendRequest {
  productos: Array<{
    nombre: string;
    codigo_barra?: string;
    cantidad: number;
    almacen_id?: number;
    almacen_nombre?: string;
    lote?: string;
  }>;
}

/**
 * Response de validación backend
 */
export interface ValidacionBackendResponse {
  success: boolean;
  resultados: Array<{
    index: number;
    existe: boolean;
    producto_existente?: {
      id: number;
      nombre: string;
      sku: string;
      criterio_deteccion: 'codigo_barra' | 'nombre';
      stock_total: number;
      stock_almacen_destino: number;
      detalles_por_almacen: Array<{
        almacen: string;
        cantidad: number;
        lotes: number;
      }>;
      preview_suma: number;
      preview_reemplazo: number;
    };
  }>;
}
