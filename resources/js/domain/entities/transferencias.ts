import type { BaseEntity, BaseFormData, Id } from './generic';

export interface Almacen {
    id: number;
    nombre: string;
    direccion?: string;
    ubicacion_fisica?: string;
    requiere_transporte_externo?: boolean;
}

export interface Vehiculo {
    id: number;
    placa: string;
    marca?: string;
    modelo?: string;
}

export interface Chofer {
    id: number;
    licencia: string;
    user: {
        name: string;
    };
}

export interface Producto {
    id: number;
    nombre: string;
    codigo: string;
    stock_disponible?: number;
    stock_por_almacen?: { [almacenId: string]: number };
}

export interface DetalleTransferencia {
    producto_id: number;
    cantidad: number;
    lote?: string;
    fecha_vencimiento?: string;
}

export interface DetalleTransferenciaForm extends DetalleTransferencia {
    // Form-specific fields if needed
}

export interface Transferencia extends BaseEntity {
    id: Id;
    almacen_origen_id: Id;
    almacen_destino_id: Id;
    vehiculo_id?: Id;
    chofer_id?: Id;
    observaciones?: string;
    detalles: DetalleTransferencia[];
    requiere_transporte: boolean;
    estado: string;
}

export interface TransferenciaFormData extends BaseFormData {
    almacen_origen_id: string | Id;
    almacen_destino_id: string | Id;
    vehiculo_id: string | '';
    chofer_id: string | '';
    observaciones: string;
    detalles: DetalleTransferenciaForm[];
}

export interface FiltrosTransferencias {
    q?: string;
    almacen_origen_id?: string;
    almacen_destino_id?: string;
    estado?: string;
}
