/**
 * Domain: Inventario Inicial
 *
 * Tipos y entidades para la carga inicial de inventario
 */

import type { Producto } from './productos';
import type { Almacen } from './almacenes';
import type { Id } from './shared';

// Re-export domain types for convenience
export type { Producto, Almacen };

export interface TipoAjuste {
    id: Id;
    clave: string;
    label: string;
    descripcion: string;
}

export interface InventarioItem {
    producto_id: number | '';
    almacen_id: number | '';
    cantidad: number | '';
    lote?: string;
    fecha_vencimiento?: string;
    observaciones?: string;
}

export interface CargarInventarioInicialPayload {
    items: InventarioItem[];
}

export interface InventarioInicialPageProps {
    productos: Producto[];
    almacenes: Almacen[];
    tipoInventarioInicial: TipoAjuste;
}

/**
 * Item del borrador de inventario inicial
 * Representa un producto x almacén en el borrador
 */
export interface InventarioInicialBorradorItem {
    id?: Id;
    producto_id: Id;
    almacen_id: Id;
    cantidad?: number | null;
    lote?: string | null;
    fecha_vencimiento?: string | null;
    stock_producto_id?: Id; // Referencia al stock existente
    es_actualizacion?: boolean; // Indica si actualiza un stock existente
    producto?: Producto;
    almacen?: Almacen;
}

/**
 * Payload para guardar un item del borrador
 */
export interface GuardarInventarioInicialItemPayload {
    producto_id: Id;
    almacen_id: Id;
    cantidad?: number | null;
    lote?: string | null;
    fecha_vencimiento?: string | null;
}

/**
 * Props para el componente AlmacenRegistroRow
 */
export interface AlmacenRegistroRowProps {
    producto: Producto;
    almacen: Almacen;
    item?: InventarioInicialBorradorItem;
    onGuardarItem: (
        productoId: Id,
        almacenId: Id,
        cantidad?: number,
        lote?: string,
        fechaVencimiento?: string
    ) => Promise<void>;
    mostrarNombreAlmacen?: boolean;
}
