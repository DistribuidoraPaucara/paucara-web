/**
 * Helper para detectar y calcular prestables de una venta
 */

export interface PrestamoProducto {
    prestable_id: number;
    cantidad: number;
    prestable?: {
        id: number;
        nombre: string;
        codigo: string;
        capacidad: number;
        tipo: string;
        embase_asociado_id?: number;
        embaseAsociado?: {
            id: number;
            nombre: string;
            capacidad: number;
        };
    };
}

export interface DetalleVentaPrestable {
    producto_id: number;
    cantidad: number;
    producto?: {
        id: number;
        nombre: string;
        sku: string;
        prestables?: PrestamoProducto[];
    };
}

/**
 * Detecta si algún detalle de venta tiene productos con prestables relacionados
 */
export function tieneProductosPrestables(detalles: DetalleVentaPrestable[]): boolean {
    return detalles.some(
        (detalle) => detalle.producto?.prestables && detalle.producto.prestables.length > 0
    );
}

/**
 * Calcula los prestables a pre-cargar en la pantalla de préstamo
 * Agrupa canastillas y embases con sus cantidades
 */
export function calcularPrestamesParaVenta(detalles: DetalleVentaPrestable[]) {
    const prestables: Record<number, { cantidad: number; tipo: string; nombre: string }> = {};

    detalles.forEach((detalle) => {
        if (!detalle.producto?.prestables) return;

        // Para cada producto, iterar sus prestables relacionados
        detalle.producto.prestables.forEach((prestamoProducto) => {
            const prestable = prestamoProducto.prestable;
            if (!prestable) return;

            const prestableId = prestable.id;
            const cantidadProducto = detalle.cantidad;

            // Inicializar o sumar cantidad
            if (!prestables[prestableId]) {
                prestables[prestableId] = {
                    cantidad: cantidadProducto,
                    tipo: prestable.tipo,
                    nombre: prestable.nombre,
                };
            } else {
                prestables[prestableId].cantidad += cantidadProducto;
            }

            // Si es canastilla, agregar embase automáticamente
            if (prestable.embase_asociado_id && prestable.embaseAsociado) {
                const embaseId = prestable.embaseAsociado.id;
                const cantidadEmbases = cantidadProducto * prestable.embaseAsociado.capacidad;

                if (!prestables[embaseId]) {
                    prestables[embaseId] = {
                        cantidad: cantidadEmbases,
                        tipo: 'EMBASE',
                        nombre: prestable.embaseAsociado.nombre,
                    };
                } else {
                    prestables[embaseId].cantidad += cantidadEmbases;
                }
            }
        });
    });

    // Convertir a array para pasar en query params
    return Object.entries(prestables).map(([id, data]) => ({
        prestable_id: Number(id),
        cantidad: data.cantidad,
        tipo: data.tipo,
        nombre: data.nombre,
    }));
}

/**
 * Abre la pantalla de crear préstamo en una nueva pestaña del navegador
 * Determina automáticamente si es evento o cliente basándose en cliente.codigo
 */
export function abrirPantallaPrestamoEnNuevaVentana(
    clienteId: number,
    clienteCodigo: string | undefined,
    ventaId: number,
    prestables: Array<{ prestable_id: number; cantidad: number; tipo: string; nombre: string }>,
    direccionClienteId?: number
): void {
    // Determinar tipo de préstamo
    const esEvento = clienteCodigo === 'EVENTO';
    const rutaBase = esEvento ? '/prestamos/eventos/crear' : '/prestamos/clientes/crear';

    // ✅ DEBUG: Mostrar decisión de tipo de préstamo
    console.group('%c🎯 DECISIÓN DE TIPO DE PRÉSTAMO', 'color: #ff6b6b; font-weight: bold; font-size: 13px');
    console.log('Código del cliente:', clienteCodigo);
    console.log('Es EVENTO:', esEvento);
    console.log('Ruta a abrir:', rutaBase);
    console.log('Cliente ID:', clienteId);
    console.log('Venta ID:', ventaId);
    console.log('Total prestables:', prestables.length);
    console.groupEnd();

    // Preparar query params
    const params = new URLSearchParams({
        venta_id: String(ventaId),
        cliente_id: String(clienteId),
        prestables: JSON.stringify(prestables),
    });

    if (direccionClienteId) {
        params.append('direccion_cliente_id', String(direccionClienteId));
    }

    // Abrir en nueva pestaña (sin parámetros de tamaño para usar pestaña, no ventana separada)
    const url = `${rutaBase}?${params.toString()}`;
    window.open(url, '_blank');
}

/**
 * Abre la pantalla de crear préstamo a proveedor en una nueva pestaña del navegador
 * Usado cuando se crea una compra con productos que tienen prestables relacionados
 */
export function abrirPantallaPrestamoProveedorEnNuevaVentana(
    proveedorId: number,
    compraId: number,
    prestables: Array<{ prestable_id: number; cantidad: number; tipo: string; nombre: string }>
): void {
    // ✅ DEBUG: Mostrar información de apertura
    console.group('%c🎯 ABRIENDO PRÉSTAMO A PROVEEDOR', 'color: #ff6b6b; font-weight: bold; font-size: 13px');
    console.log('Proveedor ID:', proveedorId);
    console.log('Compra ID:', compraId);
    console.log('Total prestables:', prestables.length);
    console.log('Prestables:', prestables);
    console.groupEnd();

    // Preparar query params
    const params = new URLSearchParams({
        compra_id: String(compraId),
        proveedor_id: String(proveedorId),
        prestables: JSON.stringify(prestables),
    });

    // Abrir en nueva pestaña
    const url = `/prestamos/proveedores/crear?${params.toString()}`;
    window.open(url, '_blank');
}
