// Domain: Mermas de Inventario
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { Producto } from './productos';
import type { Almacen } from './almacenes';

export interface DetalleMerma extends BaseEntity {
    id: Id;
    merma_id: Id;
    producto_id: Id;
    cantidad: number;
    costo_unitario?: number | null;
    costo_total?: number | null;
    lote?: string | null;
    fecha_vencimiento?: string | null;
    observaciones?: string | null;

    // Relaciones
    producto: Producto;
}

export interface MermaInventario extends BaseEntity {
    id: Id;
    numero: string;
    fecha: string;
    almacen_id: Id;
    tipo_merma: TipoMerma;
    motivo: string;
    observaciones?: string | null;
    total_productos: number;
    total_cantidad: number;
    total_costo?: number | null;
    usuario_id: Id;
    estado: EstadoMerma;
    fecha_aprobacion?: string | null;
    aprobado_por_id?: Id;

    // Relaciones
    almacen: Almacen;
    usuario: {
        id: Id;
        name: string;
    };
    aprobado_por?: {
        id: Id;
        name: string;
    };
    detalles: DetalleMerma[];
}

export type TipoMerma = 'VENCIMIENTO' | 'DETERIORO' | 'ROBO' | 'PERDIDA' | 'DANO' | 'OTROS';

export type EstadoMerma = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface FiltrosMermas {
    tipo_merma?: TipoMerma;
    estado?: EstadoMerma;
    almacen_id?: Id;
    fecha_desde?: string;
    fecha_hasta?: string;
    usuario_id?: Id;
}

export interface NuevaMerma extends BaseFormData {
    almacen_id: Id;
    tipo_merma: TipoMerma;
    motivo: string;
    observaciones?: string;
    detalles: {
        producto_id: Id;
        cantidad: number;
        costo_unitario?: number;
        lote?: string;
        fecha_vencimiento?: string;
        observaciones?: string;
    }[];
}
