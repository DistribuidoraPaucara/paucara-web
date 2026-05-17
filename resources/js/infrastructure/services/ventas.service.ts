// Application Layer: Ventas service
// Encapsulates URL building and navigation logic for ventas

import { router } from '@inertiajs/react';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseService } from '@/domain/entities/generic';
import type {
    Venta,
    VentaFormData,
    FiltrosVentas
} from '@/domain/entities/ventas';
import { ResumenStock } from '@/infrastructure/services/stock.service';
import NotificationService from '@/infrastructure/services/notification.service';

export class VentasService implements BaseService<Venta, VentaFormData> {
    indexUrl(params?: { query?: Filters }): string {
        const baseUrl = '/ventas';
        if (params?.query) {
            const queryString = new URLSearchParams(
                Object.entries(params.query).map(([k, v]) => [k, String(v)])
            ).toString();
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    createUrl(): string {
        return '/ventas/create';
    }

    showUrl(id: Id): string {
        return `/ventas/${id}`;
    }

    editUrl(id: Id): string {
        return `/ventas/${id}/edit`;
    }

    storeUrl(): string {
        return '/ventas';
    }

    updateUrl(id: Id): string {
        return `/ventas/${id}`;
    }

    destroyUrl(id: Id): string {
        return `/ventas/${id}`;
    }

    /**
     * Navegar al listado de ventas con filtros
     */
    search(filters: Filters): void {
        // Limpiar filtros vacíos
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );

        console.log('🔍 [VentasService.search] Filtros originales:', filters);
        console.log('🔍 [VentasService.search] Filtros limpios:', cleanFilters);
        console.log('🔍 [VentasService.search] URL Query:', Object.entries(cleanFilters).map(([k, v]) => `${k}=${v}`).join('&'));

        router.get('/ventas', cleanFilters, {
            preserveState: true,
            replace: true,
            onError: (errors) => {
                NotificationService.error('Error al realizar la búsqueda');
                console.error('Search errors:', errors);
            }
        });
    }

    /**
     * Búsqueda específica para ventas con filtros tipados
     */
    searchVentas(filters: FiltrosVentas): void {
        console.log('🔍 [VentasService] searchVentas recibido:', filters);
        this.search(filters as Filters);
    }

    /**
     * Limpiar todos los filtros
     */
    clearFilters(): void {
        router.get('/ventas', {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Aplicar ordenamiento
     * ✅ ACTUALIZADO: Usar sort_order en lugar de sort_dir para consistencia con backend
     */
    sort(field: string, direction: 'asc' | 'desc' = 'desc'): void {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', field);
        currentParams.set('sort_order', direction);  // ✅ CAMBIO: sort_dir -> sort_order

        router.get(`/ventas?${currentParams.toString()}`, {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Cambiar página de paginación
     */
    goToPage(page: number): void {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', page.toString());

        router.get(`/ventas?${currentParams.toString()}`, {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Cambiar número de elementos por página
     */
    changePerPage(perPage: number): void {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('per_page', perPage.toString());
        currentParams.delete('page'); // Reset to first page

        router.get(`/ventas?${currentParams.toString()}`, {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Navegar a la creación de una nueva venta
     */
    create(): void {
        router.get(this.createUrl(), {}, {
            onError: (errors) => {
                NotificationService.error('Error al acceder al formulario de creación');
                console.error('Create navigation errors:', errors);
            }
        });
    }

    /**
     * Navegar a la vista de detalle de una venta
     */
    show(id: Id): void {
        router.get(this.showUrl(id), {}, {
            onError: (errors) => {
                NotificationService.error('Error al cargar la venta');
                console.error('Show navigation errors:', errors);
            }
        });
    }

    /**
     * Navegar a la edición de una venta
     */
    edit(id: Id): void {
        router.get(this.editUrl(id), {}, {
            onError: (errors) => {
                NotificationService.error('Error al acceder al formulario de edición');
                console.error('Edit navigation errors:', errors);
            }
        });
    }

    /**
     * Crear una nueva venta
     */
    store(data: VentaFormData, options?: {
        onSuccess?: (venta?: Venta) => void;
        onError?: (errors: Record<string, string[]>) => void;
        preserveScroll?: boolean;
    }): void {
        router.post(this.storeUrl(), data, {
            preserveScroll: options?.preserveScroll ?? false,
            onSuccess: (page) => {
                NotificationService.success('Venta creada exitosamente');
                if (options?.onSuccess) {
                    options.onSuccess(page.props.venta as Venta);
                }
            },
            onError: (errors) => {
                NotificationService.error('Error al crear la venta');
                console.error('Store errors:', errors);
                if (options?.onError) {
                    options.onError(errors as unknown as Record<string, string[]>);
                }
            }
        });
    }

    /**
     * Actualizar una venta existente
     */
    update(id: Id, data: VentaFormData, options?: {
        onSuccess?: (venta?: Venta) => void;
        onError?: (errors: Record<string, string[]>) => void;
        preserveScroll?: boolean;
    }): void {
        router.put(this.updateUrl(id), data, {
            preserveScroll: options?.preserveScroll ?? false,
            onSuccess: (page) => {
                NotificationService.success('Venta actualizada exitosamente');
                if (options?.onSuccess) {
                    options.onSuccess(page.props.venta as Venta);
                }
            },
            onError: (errors) => {
                NotificationService.error('Error al actualizar la venta');
                console.error('Update errors:', errors);
                if (options?.onError) {
                    options.onError(errors as unknown as Record<string, string[]>);
                }
            }
        });
    }

    /**
     * Eliminar una venta
     */
    destroy(id: Id, options?: {
        onSuccess?: () => void;
        onError?: (errors: Record<string, string[]>) => void;
    }): void {
        if (!confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
            return;
        }

        router.delete(this.destroyUrl(id), {
            onSuccess: () => {
                NotificationService.success('Venta eliminada exitosamente');
                if (options?.onSuccess) {
                    options.onSuccess();
                }
            },
            onError: (errors) => {
                NotificationService.error('Error al eliminar la venta');
                console.error('Destroy errors:', errors);
                if (options?.onError) {
                    options.onError(errors as unknown as Record<string, string[]>);
                }
            }
        });
    }

    /**
     * Validar datos de venta
     */
    async validateData(data: VentaFormData): Promise<string[]> {
        const errors: string[] = [];

        // NOTA: El número se genera automáticamente en el backend, no es necesario validarlo aquí

        if (!data.fecha) {
            errors.push('La fecha es obligatoria');
        }

        if (!data.cliente_id || data.cliente_id === 0) {
            errors.push('Debe seleccionar un cliente');
        }

        // NOTA: La moneda se establece automáticamente a BOB en el backend si no se proporciona

        if (!data.estado_documento_id || data.estado_documento_id === 0) {
            errors.push('Debe seleccionar un estado');
        }

        if (!data.detalles || data.detalles.length === 0) {
            errors.push('Debe agregar al menos un producto a la venta');
        }

        if (data.detalles) {
            data.detalles.forEach((detalle, index) => {
                if (!detalle.producto_id || detalle.producto_id === 0) {
                    errors.push(`Producto ${index + 1}: Debe seleccionar un producto`);
                }
                if (!detalle.cantidad || detalle.cantidad <= 0) {
                    errors.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
                }
                if (!detalle.precio_unitario || detalle.precio_unitario < 0) {
                    errors.push(`Producto ${index + 1}: El precio unitario no puede ser negativo`);
                }
            });

            // Validar stock disponible
            try {
                const productosParaValidar = data.detalles.map(detalle => ({
                    producto_id: detalle.producto_id,
                    cantidad: detalle.cantidad,
                }));

                const stockValidation = await this.verificarStockDisponible(productosParaValidar);
                if (!stockValidation.valido) {
                    errors.push(...stockValidation.errores);
                }
            } catch (error) {
                console.error('Error validando stock:', error);
                errors.push('Error al validar disponibilidad de stock');
            }
        }

        if (data.subtotal < 0) {
            errors.push('El subtotal no puede ser negativo');
        }

        if (data.descuento < 0) {
            errors.push('El descuento no puede ser negativo');
        }

        if (data.impuesto < 0) {
            errors.push('El impuesto no puede ser negativo');
        }

        if (data.total < 0) {
            errors.push('El total no puede ser negativo');
        }

        return errors;
    }

    /**
     * Duplicar una venta existente
     */
    duplicate(id: Id): void {
        router.post(`/ventas/${id}/duplicate`, {}, {
            onSuccess: () => {
                NotificationService.success('Venta duplicada exitosamente');
            },
            onError: (errors) => {
                NotificationService.error('Error al duplicar la venta');
                console.error('Duplicate errors:', errors);
            }
        });
    }

    /**
     * Cambiar estado de una venta
     */
    changeStatus(id: Id, estadoId: Id): void {
        router.patch(`/ventas/${id}/status`, { estado_documento_id: estadoId }, {
            onSuccess: () => {
                NotificationService.success('Estado de venta actualizado exitosamente');
            },
            onError: (errors) => {
                NotificationService.error('Error al cambiar el estado de la venta');
                console.error('Change status errors:', errors);
            }
        });
    }

    /**
     * Exportar ventas a PDF
     */
    exportPdf(filters?: FiltrosVentas): void {
        const cleanFilters = filters ? Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        ) : {};

        const queryString = new URLSearchParams(
            Object.entries(cleanFilters).map(([k, v]) => [k, String(v)])
        ).toString();

        window.open(`/ventas/export/pdf?${queryString}`, '_blank');
    }

    /**
     * Exportar ventas a Excel
     */
    exportExcel(filters?: FiltrosVentas): void {
        const cleanFilters = filters ? Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        ) : {};

        const queryString = new URLSearchParams(
            Object.entries(cleanFilters).map(([k, v]) => [k, String(v)])
        ).toString();

        window.open(`/ventas/export/excel?${queryString}`, '_blank');
    }

    /**
     * Obtener estadísticas en tiempo real
     */
    fetchStats(): void {
        router.get('/ventas/stats', {}, {
            preserveState: true,
            only: ['estadisticas'],
            onError: (errors) => {
                console.error('Stats fetch errors:', errors);
            }
        });
    }

    /**
     * Verificar stock disponible para múltiples productos
     *
     * @route POST /api/ventas/verificar-stock
     * @see routes/api.php:132
     * @see VentaController::verificarStock()
     */
    async verificarStockDisponible(productos: Array<{
        producto_id: Id;
        cantidad: number;
    }>, almacenId: Id = 1): Promise<{
        valido: boolean;
        errores: string[];
        detalles: Array<{
            producto_id: Id;
            cantidad_solicitada: number;
            stock_disponible: number;
            suficiente: boolean;
        }>;
    }> {
        try {
            const response = await fetch('/api/ventas/verificar-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productos: productos,
                    almacen_id: almacenId,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la validación de stock');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error verificando stock:', error);
            throw error;
        }
    }

    /**
     * Obtener stock disponible de un producto específico
     *
     * @route GET /api/ventas/{producto}/stock
     * @see routes/api.php:133
     * @see VentaController::obtenerStockProducto()
     */
    async obtenerStockProducto(productoId: Id, almacenId: Id = 1): Promise<{
        producto_id: Id;
        almacen_id: Id;
        stock_total: number;
        lotes: Array<{
            id: Id;
            lote: string;
            cantidad: number;
            fecha_vencimiento: string | null;
            dias_vencimiento: number | null;
        }>;
    }> {
        try {
            const response = await fetch(`/api/ventas/${productoId}/stock?almacen_id=${almacenId}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo stock del producto');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error obteniendo stock:', error);
            throw error;
        }
    }

    /**
     * Obtener productos con stock bajo
     *
     * @route GET /api/ventas/productos/stock-bajo
     * @see routes/api.php:134
     * @see VentaController::productosStockBajo()
     */
    async obtenerProductosStockBajo(): Promise<Array<{
        id: Id;
        nombre: string;
        stock_minimo: number;
        stock_actual: number;
        almacenes: Array<{
            almacen: string;
            cantidad: number;
        }>;
    }>> {
        try {
            const response = await fetch('/api/ventas/productos/stock-bajo', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo productos con stock bajo');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error obteniendo productos con stock bajo:', error);
            throw error;
        }
    }

    /**
     * Obtener resumen de stock para una venta específica
     *
     * @route GET /ventas/{venta}/stock/resumen
     * @see routes/web.php:162
     * @see VentaController::obtenerResumenStock()
     */
    async obtenerResumenStock(ventaId: Id): Promise<ResumenStock | null> {
        try {
            const response = await fetch(`/ventas/${ventaId}/stock/resumen`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo resumen de stock');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error obteniendo resumen de stock:', error);
            throw error;
        }
    }

    /**
     * Navegar a la página de gestión de stock
     */
    navigateToStockManagement(): void {
        router.get('/inventario/stock-bajo', {}, {
            onError: (errors) => {
                NotificationService.error('Error al acceder a la gestión de stock');
                console.error('Stock management navigation errors:', errors);
            }
        });
    }
}

// Singleton instance
const ventasService = new VentasService();
export default ventasService;
