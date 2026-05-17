/**
 * Domain: Ajustes Masivos de Inventario
 *
 * Centralized domain entities for bulk inventory adjustments
 * Includes: CSV parsing, validation, batch processing, and related types
 */

import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

/**
 * Tipos de operación disponibles para ajustes masivos
 */
export type TipoOperacionEnum =
    | 'ENTRADA_AJUSTE'
    | 'SALIDA_AJUSTE'
    | 'ENTRADA_COMPRA'
    | 'SALIDA_VENTA'
    | 'SALIDA_MERMA';

/**
 * Dirección del movimiento
 */
export type DireccionMovimiento = 'entrada' | 'salida';

/**
 * Configuración de tipo de operación
 */
export interface TipoOperacion extends BaseEntity {
    id: Id;
    clave: TipoOperacionEnum;
    label: string;
    descripcion?: string;
    direccion: DireccionMovimiento;
    requiere_tipo_motivo: string | null; // Nombre del tipo de motivo requerido
    requiere_proveedor: boolean;
    requiere_cliente: boolean;
}

/**
 * Fila de CSV/XLSX sin procesar
 *
 * Representa los datos tal como vienen del archivo antes de validación
 */
export interface FilaAjusteCSV {
    producto: string;              // SKU, nombre o código del producto
    cantidad: string | number;      // Cantidad (debe ser positiva)
    tipo_operacion: string;         // ENTRADA_AJUSTE, SALIDA_AJUSTE, etc.
    tipo_motivo: string;            // Depende del tipo_operacion
    almacen: string;                // Nombre del almacén
    observacion: string;            // Notas adicionales
}

/**
 * Fila validada con IDs resueltos
 *
 * Resultado de procesar una FilaAjusteCSV:
 * - IDs resueltos desde la BD
 * - Validación completada
 * - Errores documentados si existen
 */
export interface FilaAjusteValidada extends FilaAjusteCSV {
    fila: number;                   // Número de fila en el archivo
    valido: boolean;                // ¿Pasó validación?
    errores: string[];              // Lista de errores de validación
    producto_id?: Id;               // ID resuelto del producto
    tipo_operacion_id?: Id;         // ID resuelto de tipo operación
    tipo_motivo_id?: Id;            // ID resuelto del tipo de motivo
    almacen_id?: Id;                // ID resuelto del almacén
    proveedor_id?: Id;              // ID del proveedor (si aplica)
    cliente_id?: Id;                // ID del cliente (si aplica)
}

/**
 * Resumen de validación de un lote completo
 */
export interface ResultadoValidacion {
    filasValidas: FilaAjusteValidada[];
    filasInvalidas: FilaAjusteValidada[];
    totalFilas: number;
    filasConError: number;
    resumen: {
        productosUnicos: number;
        ajustesTotales: number;
        cantidadTotal: number;
    };
}

/**
 * Duplicado detectado en el lote
 *
 * Cuando hay múltiples filas del mismo producto, almacén y tipo de operación
 */
export interface DuplicadoDetectado {
    clave: string;                  // Identificador único: "producto_almacen_operacion"
    producto: string;
    tipo_operacion: string;
    almacen: string;
    cantidad: number;               // Cantidad de la primera fila
    cantidadTotal: number;          // Suma de todas las cantidades
    filas: FilaAjusteValidada[];   // Todas las filas que conforman el duplicado
}

/**
 * Estrategia de resolución de duplicados
 */
export type EstrategiaResolucionDuplicados =
    | 'agrupar'      // Sumar cantidades
    | 'mantener'     // Mantener todas las filas
    | 'cancelar';    // Cancelar procesamiento

/**
 * Configuración para resolución de duplicados
 */
export interface ConfiguracionDuplicados {
    detectar: boolean;
    estrategia: EstrategiaResolucionDuplicados;
    permitirAgrupar: boolean;
}

/**
 * Ajuste individual para procesar
 *
 * Representa un ajuste validado listo para ser guardado en BD
 */
export interface AjusteParaProcesar {
    stock_producto_id: Id;
    tipo_operacion_id: Id;
    tipo_motivo_id?: Id;
    almacen_id: Id;
    cantidad: number;
    observacion: string;
    proveedor_id?: Id;              // Para ENTRADA_COMPRA
    cliente_id?: Id;                // Para SALIDA_VENTA
    tipo_motivo_valor?: string;     // Para tipos de motivo que permiten valores custom
}

/**
 * Datos para procesar ajustes masivos
 *
 * Todo lo que se envía al servidor para procesar el lote
 */
export interface DatosAjusteMasivo {
    nombre_archivo: string;
    datos_csv: FilaAjusteCSV[];
    ajustes: AjusteParaProcesar[];
    usuario_id?: Id;
    observacion_general?: string;
}

/**
 * Resultado de procesamiento de ajustes masivos
 *
 * Respuesta del servidor después de procesar el lote
 */
export interface ResultadoAjusteMasivo {
    procesados: number;
    errores: number;
    mensaje: string;
    id_lote?: Id;                   // ID del lote creado
    detalles?: {
        fila: number;
        error: string;
        producto?: string;
    }[];
}

/**
 * Filtros para búsqueda de ajustes masivos
 */
export interface FiltrosAjustesMasivos {
    estado?: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
    fecha_desde?: string;
    fecha_hasta?: string;
    almacen_id?: Id;
    usuario_id?: Id;
    tipo_operacion?: TipoOperacionEnum;
    search?: string;
    page?: number;
}

/**
 * Resultado paginado de ajustes masivos
 */
export interface PaginatedAjustesMasivos extends BaseEntity {
    data: AjusteMasivoHistorico[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

/**
 * Ajuste masivo en historial
 *
 * Representa un lote procesado históricamente
 */
export interface AjusteMasivoHistorico extends BaseEntity {
    id: Id;
    nombre_archivo: string;
    estado: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO';
    cantidad_filas: number;
    cantidad_procesadas: number;
    cantidad_errores: number;
    usuario_id: Id;
    usuario_nombre?: string;
    fecha_carga: string;
    fecha_procesamiento?: string;
    observacion_general?: string;
}

/**
 * Estado de validación para UI
 */
export interface EstadoValidacion {
    fase: 'cargando' | 'validando' | 'validado' | 'error';
    porcentaje: number;
    mensaje: string;
    resultado?: ResultadoValidacion;
    errores?: string[];
}

/**
 * Configuración para exportar ajustes a CSV
 */
export interface ConfiguracionExportacion {
    incluirEncabezados: boolean;
    incluirFormatos: boolean;
    incluirValidacion: boolean;
    separarPorOperacion: boolean;
}

/**
 * Datos para crear/actualizar un ajuste individual (form data)
 */
export interface AjusteInventarioFormData extends BaseFormData {
    stock_producto_id: Id;
    tipo_operacion_id: Id;
    tipo_motivo_id?: Id;
    almacen_id: Id;
    cantidad: number;
    observacion?: string;
    proveedor_id?: Id;
    cliente_id?: Id;
}

/**
 * Validación de una fila específica
 */
export interface ValidacionFila {
    valida: boolean;
    errores: string[];
    warnings?: string[];
}

/**
 * Plantilla de ejemplo para CSV
 */
export interface PlantillaCSVEjemplo {
    cabeceras: string[];
    filas: FilaAjusteCSV[];
    instrucciones: string;
}
