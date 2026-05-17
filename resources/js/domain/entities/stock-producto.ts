// Domain: Stock de Productos
import type { Id } from './shared';
import type { BaseEntity } from './generic';
import type { Producto } from './productos';
import type { Almacen } from './almacenes';

export interface StockProducto extends BaseEntity {
    id: Id;
    producto_id: Id;
    almacen_id: Id;
    cantidad: number;
    cantidad_disponible?: number; // ✅ Stock disponible (cantidad - reservadas)
    stock_minimo: number;
    fecha_vencimiento?: string | null;
    lote?: string | null;
    precio_promedio?: number;

    // Relaciones
    producto: Producto;
    almacen: Almacen;
}
