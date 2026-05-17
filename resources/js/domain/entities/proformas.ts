// Domain: proformas
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { Cliente } from './clientes';
import type { Usuario } from './usuarios';
import type { EstadoDocumento } from './estados-documento';
import type { Moneda } from './monedas';
import type { Producto } from './productos';

/**
 * Dirección de entrega
 */
export interface Direccion {
    id: Id;
    direccion: string;
    latitud?: number;
    longitud?: number;
    observaciones?: string;
}

/**
 * Datos de pago para aprobación de proforma
 */
export interface PaymentData {
    con_pago: boolean; // Flag indicando si el cliente realizó un pago
    tipo_pago_id?: number; // ID del tipo de pago (efectivo, transferencia, etc.)
    politica_pago?: 'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'MEDIO_MEDIO' | 'CREDITO'; // ✅ ACTUALIZADO: Incluir CREDITO
    monto_pagado?: number; // Monto pagado por el cliente
    fecha_pago?: string; // Fecha del pago
    numero_recibo?: string; // Número de recibo o comprobante
    numero_transferencia?: string; // Número de transferencia (si aplica)
}

export interface Proforma extends BaseEntity {
    id: Id;
    numero: string;
    fecha: string;
    fecha_vencimiento: string;
    estado: string; // Estado del documento (PENDIENTE, APROBADA, RECHAZADA, CONVERTIDA, VENCIDA)
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string;
    cliente_id: Id;
    cliente_nombre: string;
    usuario_id?: Id;
    usuario_creador_id?: Id; // ID del usuario que creó la proforma
    estado_documento_id?: Id;
    // ✅ NUEVO: Estado logístico ID (PENDIENTE, EN_TRÁNSITO, ENTREGADA, etc.)
    estado_proforma_id?: Id;
    // ✅ NUEVO: Preventista asignado
    preventista_id?: Id;
    moneda_id?: Id;
    moneda?: Moneda; // ✅ NUEVO: Objeto de moneda con código y símbolo
    canal_origen?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL';
    canal?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL'; // Campo devuelto por el backend
    tipo_entrega?: 'DELIVERY' | 'PICKUP'; // ✅ NUEVO: Tipo de entrega
    politica_pago?: 'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'MEDIO_MEDIO' | 'CREDITO'; // ✅ NUEVO: Política de pago
    estado_pago?: 'PENDIENTE' | 'PAGADO' | 'PARCIAL'; // ✅ NUEVO: Estado de pago
    items_count?: number; // ✅ NUEVO: Cantidad de items
    requiere_envio?: boolean;

    // Solicitud de entrega del cliente (inicial)
    fecha_entrega_solicitada?: string;
    hora_entrega_solicitada?: string;
    hora_entrega_solicitada_fin?: string; // ✅ Fin del rango de horario solicitado
    direccion_entrega_solicitada_id?: Id;
    direccion_solicitada?: Direccion; // ✅ Relación a dirección solicitada

    // Confirmación de entrega del vendedor (después de coordinación)
    fecha_entrega_confirmada?: string;
    hora_entrega_confirmada?: string;
    hora_entrega_confirmada_fin?: string; // ✅ Fin del rango de horario confirmado
    direccion_entrega_confirmada_id?: Id;
    direccion_confirmada?: Direccion; // ✅ Relación a dirección confirmada

    // Auditoría de coordinación
    coordinacion_completada?: boolean;
    comentario_coordinacion?: string;

    // Control mejorado de coordinación (NUEVOS)
    coordinacion_actualizada_en?: string;
    coordinacion_actualizada_por_id?: Id;
    coordinacion_actualizada_por?: Usuario;
    motivo_cambio_entrega?: string;
    numero_intentos_contacto?: number;
    fecha_ultimo_intento?: string;
    resultado_ultimo_intento?: string;

    // Datos de entrega realizada (NUEVOS)
    entregado_en?: string;
    entregado_a?: string;
    observaciones_entrega?: string;

    // Relaciones
    cliente: Cliente; // ✅ OBLIGATORIO - Una proforma siempre tiene un cliente
    usuario?: Usuario;
    usuarioCreador?: Usuario; // Usuario del sistema que creó la proforma
    usuario_creador?: { id: Id; name: string; email: string }; // Datos del usuario creador desde backend
    estado_documento?: EstadoDocumento;
    // ✅ NUEVO: Estado logístico con detalles (icono, color, nombre, etc.)
    estado_logistica?: {
        id: Id;
        codigo: string;
        nombre: string;
        icono: string;
        color: string;
        categoria: string;
        descripcion?: string;
        activo: boolean;
        visual?: { color: string; icono: string };
    };
    detalles: ProformaDetalle[]; // ✅ OBLIGATORIO - Una proforma siempre tiene detalles
    // ✅ NUEVO: Relación a venta cuando está CONVERTIDA
    venta?: {
        id: Id;
        numero: string;
        fecha?: string;
        total?: number;
    };

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ProformaDetalle extends BaseEntity {
    id: Id;
    proforma_id: Id;
    producto_id: Id;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
    tipo_precio_id?: number | null; // ✅ NUEVO: ID del tipo de precio seleccionado
    producto?: Producto; // Relación opcional - puede no venir desde el backend
    // Campos directos cuando no viene la relación
    producto_nombre?: string;
    sku?: string;
}

export interface ProformaFormData extends BaseFormData {
    id?: Id;
    numero: string;
    fecha: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string;
    cliente_id: Id;
    usuario_id: Id;
    estado_documento_id: Id;
    moneda_id: Id;
    canal_origen?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL';
    requiere_envio?: boolean;
    detalles: ProformaDetalleFormData[];
}

export interface ProformaDetalleFormData extends BaseFormData {
    id?: Id;
    producto_id: Id;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
    tipo_precio_id?: number | null; // ✅ NUEVO: ID del tipo de precio seleccionado
}

// ============================================
// UTILIDADES DE DOMINIO
// ============================================

/**
 * Mapeo de estados de proforma a etiquetas y variantes visuales
 */
export const PROFORMA_ESTADOS = {
    BORRADOR: { label: 'Borrador', variant: 'outline' as const },
    PENDIENTE: { label: 'Pendiente', variant: 'default' as const },
    APROBADA: { label: 'Aprobada', variant: 'default' as const },
    RECHAZADA: { label: 'Rechazada', variant: 'destructive' as const },
    CONVERTIDA: { label: 'Convertida', variant: 'default' as const },
    VENCIDA: { label: 'Vencida', variant: 'destructive' as const },
} as const;

/**
 * Obtener etiqueta y variante visual para un estado de proforma
 * @param estado Estado de la proforma
 * @returns Objeto con label y variant para mostrar en Badge
 */
export function getEstadoBadge(estado: string) {
    return PROFORMA_ESTADOS[estado as keyof typeof PROFORMA_ESTADOS]
        || { label: 'Desconocido', variant: 'secondary' as const };
}

/**
 * Motivos de rechazo de proformas - Única fuente de verdad
 */
export const MOTIVOS_RECHAZO_PROFORMA = [
    { value: 'cliente_cancelo', label: 'Cliente canceló el pedido' },
    { value: 'sin_disponibilidad', label: 'No hay disponibilidad para la fecha solicitada' },
    { value: 'sin_respuesta', label: 'Cliente no contestó llamadas' },
    { value: 'fuera_cobertura', label: 'Dirección fuera de cobertura' },
    { value: 'stock_insuficiente', label: 'Stock insuficiente' },
    { value: 'otro', label: 'Otro motivo (especificar abajo)' },
];

/**
 * Validaciones de permisos de acciones sobre proformas
 */
export const validacionesProforma = {
    /**
     * Validar si una proforma puede ser aprobada
     */
    puedeAprobar: (proforma: Proforma): boolean => proforma.estado === 'PENDIENTE',

    /**
     * Validar si una proforma puede ser rechazada
     */
    puedeRechazar: (proforma: Proforma): boolean => proforma.estado === 'PENDIENTE',

    /**
     * Validar si una proforma puede ser convertida a venta
     */
    puedeConvertir: (proforma: Proforma): boolean => proforma.estado === 'APROBADA',

    /**
     * Validar si una proforma puede tener coordinación de entrega
     */
    puedeCoordinar: (proforma: Proforma): boolean => proforma.estado === 'APROBADA',
};
