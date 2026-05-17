// Application Layer: Compras service
// Encapsulates URL building and navigation logic for compras

import { router } from '@inertiajs/react';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseService } from '@/domain/entities/generic';
import type {
    Compra,
    CompraFormData,
    FiltrosCompras,
    EstadisticasCompras
} from '@/domain/entities/compras';
import NotificationService from '@/infrastructure/services/notification.service';

export class ComprasService implements BaseService<Compra, CompraFormData> {
    indexUrl(params?: { query?: Filters }): string {
        const baseUrl = '/compras';
        if (params?.query) {
            const queryString = new URLSearchParams(
                Object.entries(params.query).map(([k, v]) => [k, String(v)])
            ).toString();
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    createUrl(): string {
        return '/compras/create';
    }

    showUrl(id: Id): string {
        return `/compras/${id}`;
    }

    editUrl(id: Id): string {
        return `/compras/${id}/edit`;
    }

    storeUrl(): string {
        return '/compras';
    }

    updateUrl(id: Id): string {
        return `/compras/${id}`;
    }

    destroyUrl(id: Id): string {
        return `/compras/${id}`;
    }

    /**
     * Navegar al listado de compras con filtros
     */
    search(filters: FiltrosCompras): void {
        // Limpiar filtros vacíos
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );

        router.get('/compras', cleanFilters, {
            preserveState: true,
            replace: true,
            onError: (errors) => {
                NotificationService.error('Error al realizar la búsqueda');
                console.error('Search errors:', errors);
            }
        });
    }

    /**
     * Limpiar todos los filtros
     */
    clearFilters(): void {
        router.get('/compras', {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Aplicar ordenamiento
     */
    sort(field: string, direction: 'asc' | 'desc' = 'desc'): void {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', field);
        currentParams.set('sort_dir', direction);

        router.get(`/compras?${currentParams.toString()}`, {}, {
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

        router.get(`/compras?${currentParams.toString()}`, {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Eliminar compra con confirmación
     */
    destroy(id: Id): void {
        if (!confirm('¿Estás seguro de que deseas eliminar esta compra?')) {
            return;
        }

        const loadingToast = NotificationService.loading('Eliminando compra...');

        router.delete(this.destroyUrl(id), {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast);
                NotificationService.success('Compra eliminada correctamente');
                // Recargar solo los datos de compras
                router.reload({ only: ['compras'] });
            },
            onError: (errors) => {
                NotificationService.dismiss(loadingToast);
                NotificationService.error('Error al eliminar la compra');
                console.error('Delete errors:', errors);
            }
        });
    }

    /**
     * Crear nueva compra
     */
    create(data: CompraFormData): void {
        const loadingToast = NotificationService.loading('Creando compra...');

        router.post(this.storeUrl(), data, {
            preserveState: true,
            onSuccess: (page) => {
                NotificationService.dismiss(loadingToast);
                NotificationService.success('Compra creada correctamente');
                // Redirigir a la vista de la compra creada
                if (page.props && 'compra' in page.props) {
                    router.visit(`/compras/${(page.props.compra as Compra).id}`);
                }
            },
            onError: (errors) => {
                NotificationService.dismiss(loadingToast);
                NotificationService.error('Error al crear la compra');
                console.error('Create errors:', errors);
            }
        });
    }

    /**
     * Actualizar compra existente
     */
    update(id: Id, data: CompraFormData): void {
        const loadingToast = NotificationService.loading('Actualizando compra...');

        router.put(this.updateUrl(id), data, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast);
                NotificationService.success('Compra actualizada correctamente');
            },
            onError: (errors) => {
                NotificationService.dismiss(loadingToast);
                NotificationService.error('Error al actualizar la compra');
                console.error('Update errors:', errors);
            }
        });
    }

    /**
     * Validación específica para compras
     *
     * Incluye validaciones de coherencia de cálculos similares al backend
     * @see app/Http/Requests/StoreCompraRequest.php
     *
     * @param data Datos del formulario de compra
     * @param options Opciones adicionales con entidades para validar estado activo
     */
    validateData(
        data: CompraFormData,
        options?: {
            proveedores?: Array<{ id: number | string; activo: boolean; nombre: string }>;
            monedas?: Array<{ id: number | string; activo: boolean; nombre: string }>;
            productos?: Array<{ id: number | string; activo: boolean; nombre: string }>;
        }
    ): string[] {
        const errors: string[] = [];

        // Validar fecha
        if (!data.fecha) {
            errors.push('La fecha es requerida');
        }

        // Validar proveedor
        if (!data.proveedor_id || data.proveedor_id === '') {
            errors.push('El proveedor es requerido');
        }

        // Validar moneda
        if (!data.moneda_id || data.moneda_id === '') {
            errors.push('La moneda es requerida');
        }

        // Validar estado documento
        if (!data.estado_documento_id || data.estado_documento_id === '') {
            errors.push('El estado del documento es requerido');
        }

        // Validar detalles
        if (!data.detalles || data.detalles.length === 0) {
            errors.push('Debe agregar al menos un producto');
        } else {
            // Validar cada detalle
            data.detalles.forEach((detalle, index) => {
                if (!detalle.producto_id || detalle.producto_id === '') {
                    errors.push(`Producto ${index + 1}: Debe seleccionar un producto`);
                }

                const cantidad = Number(detalle.cantidad);
                if (!cantidad || cantidad <= 0) {
                    errors.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
                }

                const precio = Number(detalle.precio_unitario);
                if (!precio || precio <= 0) {
                    errors.push(`Producto ${index + 1}: El precio debe ser mayor a 0`);
                }

                // Validar fecha de vencimiento si se proporciona
                if (detalle.fecha_vencimiento && detalle.fecha_vencimiento !== '') {
                    const fechaVencimiento = new Date(detalle.fecha_vencimiento);
                    const hoy = new Date();

                    if (fechaVencimiento < hoy) {
                        errors.push(`Producto ${index + 1}: La fecha de vencimiento no puede ser anterior a hoy`);
                    }
                }
            });

            // ✅ Validar coherencia de cálculos
            const erroresCoherencia = this.validateCalculationCoherence(data);
            errors.push(...erroresCoherencia);
        }

        // ✅ NUEVO: Validar entidades activas
        if (options) {
            const erroresEntidades = this.validateActiveEntities(data, options);
            errors.push(...erroresEntidades);
        }

        return errors;
    }

    /**
     * Validar que las entidades estén activas (similar al backend)
     *
     * @see app/Http/Requests/StoreCompraRequest.php:168-199
     */
    private validateActiveEntities(
        data: CompraFormData,
        options: {
            proveedores?: Array<{ id: number | string; activo: boolean; nombre: string }>;
            monedas?: Array<{ id: number | string; activo: boolean; nombre: string }>;
            productos?: Array<{ id: number | string; activo: boolean; nombre: string }>;
        }
    ): string[] {
        const errors: string[] = [];

        // Validar proveedor activo
        if (options.proveedores && data.proveedor_id) {
            const proveedor = options.proveedores.find(
                p => String(p.id) === String(data.proveedor_id)
            );

            if (proveedor && !proveedor.activo) {
                errors.push(
                    `El proveedor '${proveedor.nombre}' está desactivado. ` +
                    `Active el proveedor antes de continuar.`
                );
            }
        }

        // Validar moneda activa
        if (options.monedas && data.moneda_id) {
            const moneda = options.monedas.find(
                m => String(m.id) === String(data.moneda_id)
            );

            if (moneda && !moneda.activo) {
                errors.push(
                    `La moneda '${moneda.nombre}' está desactivada. ` +
                    `Active la moneda antes de continuar.`
                );
            }
        }

        // Validar productos activos
        if (options.productos && data.detalles) {
            data.detalles.forEach((detalle, index) => {
                const producto = options.productos?.find(
                    p => String(p.id) === String(detalle.producto_id)
                );

                if (producto && !producto.activo) {
                    errors.push(
                        `Producto ${index + 1}: El producto '${producto.nombre}' no está activo.`
                    );
                }
            });
        }

        return errors;
    }

    /**
     * Validar coherencia de cálculos (similar al backend)
     *
     * @see app/Http/Requests/StoreCompraRequest.php:75-144
     */
    private validateCalculationCoherence(data: CompraFormData): string[] {
        const errors: string[] = [];

        // 1. Validar coherencia de subtotales de detalles
        data.detalles.forEach((detalle, index) => {
            const cantidad = Number(detalle.cantidad) || 0;
            const precioUnitario = Number(detalle.precio_unitario) || 0;
            const descuento = Number(detalle.descuento) || 0;
            const subtotal = Number(detalle.subtotal) || 0;

            const subtotalCalculado = (cantidad * precioUnitario) - descuento;

            // Tolerancia de 0.01 por redondeos (igual que backend)
            if (Math.abs(subtotalCalculado - subtotal) > 0.01) {
                errors.push(
                    `Producto ${index + 1}: El subtotal (${subtotal.toFixed(2)}) no coincide ` +
                    `con el cálculo (${subtotalCalculado.toFixed(2)})`
                );
            }

            // Validar que el descuento no exceda el subtotal antes del descuento
            if (descuento > (cantidad * precioUnitario)) {
                errors.push(
                    `Producto ${index + 1}: El descuento (${descuento.toFixed(2)}) no puede ` +
                    `ser mayor al subtotal (${(cantidad * precioUnitario).toFixed(2)})`
                );
            }
        });

        // 2. Validar coherencia del subtotal general
        if ('subtotal' in data) {
            const subtotalCalculado = data.detalles.reduce((sum, detalle) => {
                return sum + (Number(detalle.subtotal) || 0);
            }, 0);
            const subtotalDeclarado = Number(data.subtotal) || 0;

            if (Math.abs(subtotalCalculado - subtotalDeclarado) > 0.01) {
                errors.push(
                    `El subtotal (${subtotalDeclarado.toFixed(2)}) no coincide con la suma ` +
                    `de los detalles (${subtotalCalculado.toFixed(2)})`
                );
            }
        }

        // 3. Validar coherencia del total
        if ('total' in data && 'subtotal' in data) {
            const subtotal = Number(data.subtotal) || 0;
            const descuento = Number(data.descuento) || 0;
            const impuesto = Number(data.impuesto) || 0;
            const total = Number(data.total) || 0;

            // Por ahora no se suma impuesto al total en la validación
            const totalCalculado = subtotal - descuento;

            if (Math.abs(totalCalculado - total) > 0.01) {
                errors.push(
                    `El total (${total.toFixed(2)}) no coincide con el cálculo ` +
                    `(subtotal: ${subtotal.toFixed(2)} - descuento: ${descuento.toFixed(2)} ` +
                    `= ${totalCalculado.toFixed(2)})`
                );
            }
        }

        // 4. Validar que el descuento no exceda el subtotal
        if ('descuento' in data && 'subtotal' in data) {
            const subtotal = Number(data.subtotal) || 0;
            const descuento = Number(data.descuento) || 0;

            if (descuento > subtotal) {
                errors.push(
                    `El descuento (${descuento.toFixed(2)}) no puede ser mayor ` +
                    `al subtotal (${subtotal.toFixed(2)})`
                );
            }
        }

        return errors;
    }

    /**
     * Calcular totales de la compra
     */
    calculateTotals(detalles: CompraFormData['detalles']): {
        subtotal: number;
        total: number;
    } {
        const subtotal = detalles.reduce((acc, detalle) => {
            const cantidad = Number(detalle.cantidad) || 0;
            const precio = Number(detalle.precio_unitario) || 0;
            return acc + (cantidad * precio);
        }, 0);

        return {
            subtotal,
            total: subtotal, // En el futuro se pueden agregar descuentos e impuestos
        };
    }

    /**
     * Formatear estado de compra con colores
     */
    getEstadoColor(estado: string): string {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'completada':
            case 'aprobada':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'cancelada':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    }

    /**
     * Formatear número de compra para display
     */
    formatNumeroCompra(numero: string): string {
        return numero.startsWith('C-') ? numero : `C-${numero}`;
    }

    /**
     * Obtener resumen de estadísticas para dashboard
     */
    getEstadisticasResumen(estadisticas: EstadisticasCompras): {
        totalCompras: string;
        montoTotal: string;
        promedioCompra: string;
        variacionMensual: {
            compras: number;
            monto: number;
        };
    } {
        return {
            totalCompras: estadisticas.total_compras.toLocaleString('es-ES'),
            montoTotal: new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'BOB'
            }).format(estadisticas.monto_total),
            promedioCompra: new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'BOB'
            }).format(estadisticas.promedio_compra),
            variacionMensual: {
                compras: Math.round(estadisticas.mes_actual.variacion_compras),
                monto: Math.round(estadisticas.mes_actual.variacion_monto),
            }
        };
    }
}

const comprasService = new ComprasService();
export default comprasService;
