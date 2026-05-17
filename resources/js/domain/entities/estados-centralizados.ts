/**
 * Entidades para Estados Logísticos Centralizados
 *
 * Este módulo define las estructuras de tipos para el sistema
 * de estados centralizados en la base de datos Laravel.
 *
 * Fase 3: Frontend React/TypeScript Integration
 *
 * @module domain/entities/estados-centralizados
 */

/**
 * Categorías de Estados disponibles en el sistema
 * Corresponde a las categorías en la tabla estados_logistica
 */
export type CategoriaEstado =
    | 'proforma'
    | 'venta_logistica'
    | 'entrega'
    | 'vehiculo'
    | 'pago';

/**
 * Interfaz para un Estado Logístico
 *
 * Representa una fila de la tabla estados_logistica con todos
 * sus atributos y metadatos.
 */
export interface Estado {
    id: number;
    categoria: CategoriaEstado;
    codigo: string;
    nombre: string;
    descripcion?: string;
    color: string;
    icono?: string;
    orden: number;
    es_estado_final: boolean;
    permite_edicion: boolean;
    requiere_aprobacion: boolean;
    metadatos?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

/**
 * Respuesta de API para estados de una categoría
 * Incluye metadatos sobre la categoría y timestamp
 */
export interface EstadosCategoriaResponse {
    data: Estado[];
    meta: {
        categoria: CategoriaEstado;
        total: number;
        timestamp: string;
    };
}

/**
 * Respuesta genérica de API para operaciones de estados
 */
export interface EstadoResponse {
    data: Estado;
    message?: string;
}

/**
 * Respuesta de validación de transición de estado
 */
export interface ValidarTransicionResponse {
    data: {
        valida: boolean;
        razon?: string;
        estado_siguiente?: Estado;
    };
    message?: string;
}

/**
 * Estructura interna de cache en localStorage
 * Almacena todos los estados de todas las categorías con TTL
 */
export interface EstadosCache {
    categorias: Partial<Record<CategoriaEstado, Estado[]>>;
    timestamp: number;
    ttl: number;
}

/**
 * Opciones para el hook useEstados
 */
export interface UseEstadosOptions {
    fallback?: Estado[];
    onlyActive?: boolean;
}

/**
 * Retorno del hook useEstados
 */
export interface UseEstadosReturn {
    estados: Estado[];
    isLoading: boolean;
    error: Error | null;
    getEstadoPorCodigo: (codigo: string) => Estado | undefined;
    getEstadoLabel: (codigo: string) => string;
    getEstadoColor: (codigo: string) => string | undefined;
    isEstadoFinal: (codigo: string) => boolean;
}

/**
 * Contexto de Estados para React Context API
 */
export interface EstadosContextState {
    estados: Partial<Record<CategoriaEstado, Estado[]>>;
    isLoading: boolean;
    isInitialized: boolean;
    error: Error | null;
    refreshEstados: () => Promise<void>;
    clearCache: () => void;
    getEstadosPorCategoria: (categoria: CategoriaEstado) => Estado[];
    getEstadoPorCodigo: (categoria: CategoriaEstado, codigo: string) => Estado | undefined;
}

/**
 * Mapeo de categorías a sus estados permitidos
 * Usado para type-checking en tiempo de compilación
 */
export interface CategoriasEstadosMap {
    proforma: Estado[];
    venta_logistica: Estado[];
    entrega: Estado[];
    vehiculo: Estado[];
    pago: Estado[];
}

/**
 * Fallback estados para PROFORMA
 * Se usa como respaldo cuando la API no está disponible
 */
export const FALLBACK_ESTADOS_PROFORMA: Estado[] = [
    {
        id: 1,
        categoria: 'proforma',
        codigo: 'BORRADOR',
        nombre: 'Borrador',
        color: '#9CA3AF',
        orden: 0,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 2,
        categoria: 'proforma',
        codigo: 'PENDIENTE',
        nombre: 'Pendiente',
        color: '#6B7280',
        orden: 1,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 3,
        categoria: 'proforma',
        codigo: 'APROBADA',
        nombre: 'Aprobada',
        color: '#10B981',
        orden: 2,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 4,
        categoria: 'proforma',
        codigo: 'RECHAZADA',
        nombre: 'Rechazada',
        color: '#EF4444',
        orden: 3,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 5,
        categoria: 'proforma',
        codigo: 'CONVERTIDA',
        nombre: 'Convertida a Venta',
        color: '#3B82F6',
        orden: 4,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 6,
        categoria: 'proforma',
        codigo: 'VENCIDA',
        nombre: 'Vencida',
        color: '#F59E0B',
        orden: 5,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
];

/**
 * Fallback estados para ENTREGA
 * Se usa como respaldo cuando la API no está disponible
 * SINCRONIZADO con EstadosLogisticaSeeder.php (línea 45-58)
 */
export const FALLBACK_ESTADOS_ENTREGA: Estado[] = [
    {
        id: 1,
        categoria: 'entrega',
        codigo: 'PROGRAMADO',
        nombre: 'Programado',
        color: '#FFC107',
        icono: 'hourglass',
        orden: 1,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 2,
        categoria: 'entrega',
        codigo: 'ASIGNADA',
        nombre: 'Asignada a Chofer',
        color: '#0275D8',
        icono: 'assignment',
        orden: 2,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 3,
        categoria: 'entrega',
        codigo: 'PREPARACION_CARGA',
        nombre: 'Preparación de Carga',
        color: '#9C27B0',
        icono: 'inventory',
        orden: 3,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 4,
        categoria: 'entrega',
        codigo: 'EN_CARGA',
        nombre: 'En Carga',
        color: '#673AB7',
        icono: 'local-shipping',
        orden: 4,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 5,
        categoria: 'entrega',
        codigo: 'LISTO_PARA_ENTREGA',
        nombre: 'Listo para Entrega',
        color: '#3F51B5',
        icono: 'check-circle',
        orden: 5,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 6,
        categoria: 'entrega',
        codigo: 'EN_CAMINO',
        nombre: 'En Camino',
        color: '#2196F3',
        icono: 'directions-car',
        orden: 6,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 7,
        categoria: 'entrega',
        codigo: 'EN_TRANSITO',
        nombre: 'En Tránsito',
        color: '#03A9F4',
        icono: 'near-me',
        orden: 7,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 8,
        categoria: 'entrega',
        codigo: 'LLEGO',
        nombre: 'Llegó a Destino',
        color: '#00BCD4',
        icono: 'location-on',
        orden: 8,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 9,
        categoria: 'entrega',
        codigo: 'ENTREGADO',
        nombre: 'Entregado',
        color: '#28A745',
        icono: 'check-circle',
        orden: 9,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 10,
        categoria: 'entrega',
        codigo: 'NOVEDAD',
        nombre: 'Con Novedad',
        color: '#FF9800',
        icono: 'error',
        orden: 10,
        es_estado_final: false,
        permite_edicion: true,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 11,
        categoria: 'entrega',
        codigo: 'RECHAZADO',
        nombre: 'Rechazado',
        color: '#F44336',
        icono: 'cancel',
        orden: 11,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
    {
        id: 12,
        categoria: 'entrega',
        codigo: 'CANCELADA',
        nombre: 'Cancelada',
        color: '#6C757D',
        icono: 'ban',
        orden: 12,
        es_estado_final: true,
        permite_edicion: false,
        requiere_aprobacion: false,
        created_at: '',
        updated_at: '',
    },
];
