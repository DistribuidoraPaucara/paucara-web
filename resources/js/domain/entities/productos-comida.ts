/**
 * Domain Entities: Productos de Comida
 */

export interface Adicional {
    id: number;
    nombre: string;
    descripcion?: string;
    precio_adicional: number;
    orden: number;
    activo: boolean;
}

export interface ProductoComida {
    id: number;
    nombre: string;
    descripcion?: string;
    precio_venta: number;
    es_producto_comida: boolean;
    adicionales?: Adicional[];
}

export interface DetalleComidaVenta {
    producto_id: number;
    nombre_producto: string;
    precio_base: number;
    adicionalesSeleccionados: number[]; // IDs de adicionales
    cantidad: number;
    precio_total: number;
    // Para mostrar en carrito
    adicionales_detalles?: Adicional[];
}

export interface CarritoComida {
    items: DetalleComidaVenta[];
    total: number;
}
