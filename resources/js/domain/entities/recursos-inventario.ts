/**
 * Domain Entities: Recursos de Inventario
 *
 * Entidades centrales del dominio de inventario:
 * - Productos
 * - Proveedores
 * - Clientes
 *
 * Estas entidades se usan en toda la aplicación para mantener
 * consistencia en las estructuras de datos.
 */

/**
 * Producto - Entidad de dominio para artículos de inventario
 */
export interface Producto {
    id: number;
    sku: string;
    nombre: string;
    codigo_barras?: string;
    categoria_id?: number;
}

/**
 * Proveedor - Entidad de dominio para proveedores
 */
export interface Proveedor {
    id: number;
    nombre: string;
}

/**
 * Cliente - Entidad de dominio para clientes
 */
export interface Cliente {
    id: number;
    nombre: string;
}
