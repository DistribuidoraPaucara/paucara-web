// Application Layer: Stock service para ventas
// Encapsula las operaciones de verificación y gestión de stock

import { router } from '@inertiajs/react';
import NotificationService from '@/infrastructure/services/notification.service';

export interface StockValidation {
    valido: boolean;
    errores: string[];
    detalles: Array<{
        producto_id: number;
        producto_nombre: string;
        cantidad_solicitada: number;
        stock_disponible: number;
        diferencia: number;
    }>;
}

export interface ProductoStock {
    producto_id: number;
    almacen_id: number;
    stock_total: number;
    lotes: Array<{
        id: number;
        lote: string;
        cantidad: number;
        fecha_vencimiento: string | null;
        dias_vencimiento: number | null;
    }>;
}

export interface ProductoStockBajo {
    id: number;
    nombre: string;
    stock_minimo: number;
    stock_actual: number;
    almacenes: Array<{
        almacen: string;
        cantidad: number;
    }>;
}

export interface ResumenStock {
    total_productos: number;
    productos_sin_stock: number;
    productos_stock_bajo: number;
    valor_total_stock: number;
}

export interface VerificarStockRequest {
    productos: Array<{
        producto_id: number;
        cantidad: number;
    }>;
    almacen_id?: number;
}

export class StockService {
    /**
     * Verificar stock disponible para múltiples productos
     */
    async verificarStock(request: VerificarStockRequest): Promise<StockValidation | null> {
        try {
            const response = await fetch('/ventas/stock/verificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error('Error en la verificación de stock');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            NotificationService.error('Error al verificar stock');
            console.error('Stock verification error:', error);
            return null;
        }
    }

    /**
     * Obtener stock disponible de un producto específico
     */
    async obtenerStockProducto(productoId: number, almacenId?: number): Promise<ProductoStock | null> {
        try {
            const params = new URLSearchParams();
            if (almacenId) {
                params.append('almacen_id', almacenId.toString());
            }

            const response = await fetch(`/ventas/stock/producto/${productoId}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener stock del producto');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            NotificationService.error('Error al obtener stock del producto');
            console.error('Get product stock error:', error);
            return null;
        }
    }

    /**
     * Obtener productos con stock bajo
     */
    async obtenerProductosStockBajo(): Promise<ProductoStockBajo[]> {
        try {
            const response = await fetch('/ventas/stock/bajo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener productos con stock bajo');
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            NotificationService.error('Error al obtener productos con stock bajo');
            console.error('Get low stock products error:', error);
            return [];
        }
    }

    /**
     * Obtener resumen de stock de una venta
     */
    async obtenerResumenStock(ventaId: number): Promise<ResumenStock | null> {
        try {
            const response = await fetch(`/ventas/${ventaId}/stock/resumen`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener resumen de stock');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            NotificationService.error('Error al obtener resumen de stock');
            console.error('Get stock summary error:', error);
            return null;
        }
    }

    /**
     * Navegar a la página de productos con stock bajo
     */
    navigateToStockBajo(): void {
        router.get('/inventario/stock-bajo', {}, {
            onError: (errors) => {
                NotificationService.error('Error al acceder a productos con stock bajo');
                console.error('Navigation errors:', errors);
            }
        });
    }
}

// Instancia singleton del servicio
const stockService = new StockService();
export default stockService;
