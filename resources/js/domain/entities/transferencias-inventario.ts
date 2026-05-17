// Domain: Transferencias de Inventario
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { Producto } from './productos';
import type { Almacen } from './almacenes';
import type { Vehiculo, Chofer } from './vehiculos';
import type { StockProducto } from './stock-producto';

export interface DetalleTransferencia extends BaseEntity {
    id: Id;
    transferencia_id: Id;
    producto_id: Id;
    cantidad: number;
    cantidad_recibida?: number | null;
    lote?: string | null;
    fecha_vencimiento?: string | null;
    observaciones?: string | null;

    // Relaciones
    producto: Producto;
    stock_producto?: StockProducto;
}

export interface TransferenciaInventario extends BaseEntity {
    id: Id;
    numero: string;
    fecha: string;
    almacen_origen_id: Id;
    almacen_destino_id: Id;
    vehiculo_id?: Id;
    chofer_id?: Id;
    usuario_id: Id;
    fecha_envio?: string | null;
    fecha_recepcion?: string | null;
    estado: EstadoTransferencia;
    observaciones?: string | null;
    total_productos: number;
    total_cantidad: number;
    motivo_cancelacion?: string | null;

    // Relaciones
    almacen_origen: Almacen;
    almacen_destino: Almacen;
    vehiculo?: Vehiculo;
    chofer?: Chofer;
    creado_por: {
        id: Id;
        name: string;
    };
    detalles: DetalleTransferencia[];
}

export type EstadoTransferencia = 'BORRADOR' | 'ENVIADO' | 'RECIBIDO' | 'CANCELADO';

export interface FiltrosTransferencias {
    estado?: EstadoTransferencia;
    almacen_origen?: Id;
    almacen_destino?: Id;
    fecha_desde?: string;
    fecha_hasta?: string;
    search?: string;
}

export interface NuevaTransferencia extends BaseFormData {
    almacen_origen_id: Id;
    almacen_destino_id: Id;
    vehiculo_id?: Id;
    chofer_id?: Id;
    observaciones?: string;
    detalles: {
        producto_id: Id;
        cantidad: number;
        lote?: string;
        fecha_vencimiento?: string;
    }[];
}
