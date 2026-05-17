// Domain Entities - Barrel export
// Individual imports recommended to avoid naming conflicts

// Base types and shared entities
export * from './generic';
export * from './shared';

// Business entities - import individually to avoid conflicts
// Example: import { Cliente } from '@/domain/entities/clientes';
// import { Producto } from '@/domain/entities/productos';

// Inventory entities (NEW - Consolidated from /types/inventario)
export * from './vehiculos';
export * from './stock-producto';
export * from './transferencias-inventario';
export * from './mermas-inventario';

// Logistics entities (NEW - Consolidated from dashboard types)
export * from './logistica';

// Financial entities (NEW - Box/Cash management)
export * from './cajas';

// Lending entities (NEW - Basket/Packaging loans)
export * from './prestamos';

// movimientos-inventario already exported above (contains MovimientoUnificado)

// Available entities:
// - almacenes, categorias, clientes, compras, envios
// - estados-documento, localidades, marcas, monedas
// - movimientos-inventario, productos, proformas, proveedores
// - tipos-documento, tipos-pago, tipos-precio, unidades
// - usuarios, vehiculos, ventas
// - NUEVO: stock-producto, transferencias-inventario, mermas-inventario
// - NUEVO: logistica (para dashboard y operaciones de logística)
// - NUEVO: cajas (para gestión de cajas y operaciones financieras)
