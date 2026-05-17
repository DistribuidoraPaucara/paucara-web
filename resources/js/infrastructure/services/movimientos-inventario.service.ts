// Application Layer: MovimientosInventario service
// Encapsulates URL building and navigation logic for movimientos inventario

import { router } from '@inertiajs/react';
import Controllers from '@/actions/App/Http/Controllers';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseService } from '@/domain/entities/generic';
import type {
    MovimientoInventario,
    MovimientoInventarioFormData,
    MovimientoInventarioFilters,
    MovimientoTipo
} from '@/domain/entities/movimientos-inventario';
import NotificationService from '@/infrastructure/services/notification.service';

export class MovimientosInventarioService implements BaseService<MovimientoInventario, MovimientoInventarioFormData> {

    // URLs base para movimientos de inventario
    indexUrl(params?: { query?: Filters }): string {
        return Controllers.InventarioController.movimientos(params).url;
    }

    createUrl(): string {
        // Para crear movimientos generalmente se usa ajuste
        return Controllers.InventarioController.ajusteForm().url;
    }

    storeUrl(): string {
        return Controllers.InventarioController.procesarAjuste().url;
    }

    // Métodos específicos para movimientos de inventario
    reportesUrl(): string {
        return Controllers.InventarioController.reportes().url;
    }

    // Métodos de navegación y búsqueda
    search(filters: Filters): void {
        router.get(this.indexUrl({ query: filters }), {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['movimientos', 'filtros', 'totales'],
            onError: (errors) => {
                NotificationService.error('Error al realizar la búsqueda');
                console.error('Search errors:', errors);
            }
        });
    }

    // Método específico para filtros de movimientos
    searchMovimientos(filters: MovimientoInventarioFilters): void {
        this.search(filters as Filters);
    }

    // Navegar a la página principal de movimientos
    goToIndex(filters?: MovimientoInventarioFilters): void {
        router.get(this.indexUrl({ query: filters as Filters }));
    }

    // Navegar a crear ajuste de stock
    goToCreate(): void {
        router.get(this.createUrl());
    }

    // Navegar a reportes
    goToReportes(): void {
        router.get(this.reportesUrl());
    }

    // Crear ajuste de stock
    createAjuste(data: {
        producto_id: Id;
        almacen_id: Id;
        cantidad: number;
        tipo_ajuste: 'entrada' | 'salida';
        motivo: string;
        observaciones?: string;
    }): void {
        const loadingToast = NotificationService.loading('Procesando ajuste...');

        router.post(this.storeUrl(), data, {
            onSuccess: () => {
                NotificationService.dismiss(loadingToast);
                NotificationService.success('Ajuste procesado exitosamente');
            },
            onError: (errors) => {
                NotificationService.dismiss(loadingToast);
                NotificationService.error('Error al procesar el ajuste');
                console.error('Ajuste errors:', errors);
            }
        });
    }

    // Filtrar por tipo de movimiento
    filterByTipo(tipo: MovimientoTipo | ''): void {
        this.searchMovimientos({ tipo });
    }

    // Filtrar por almacén
    filterByAlmacen(almacen_id: Id | ''): void {
        this.searchMovimientos({ almacen_id });
    }

    // Filtrar por producto
    filterByProducto(producto_id: Id | ''): void {
        this.searchMovimientos({ producto_id });
    }

    // Filtrar por rango de fechas
    filterByDateRange(fecha_inicio?: string, fecha_fin?: string): void {
        this.searchMovimientos({ fecha_inicio, fecha_fin });
    }

    // Filtrar por usuario
    filterByUser(usuario_id: Id | ''): void {
        this.searchMovimientos({ usuario_id });
    }

    // Filtrar por documento
    filterByDocument(numero_documento: string): void {
        this.searchMovimientos({ numero_documento });
    }

    // Combinar múltiples filtros
    filterMultiple(filters: MovimientoInventarioFilters): void {
        this.searchMovimientos(filters);
    }

    // Limpiar todos los filtros
    clearFilters(): void {
        this.searchMovimientos({});
    }

    // Exportar movimientos (si se implementa en el futuro)
    export(filters?: MovimientoInventarioFilters): void {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        params.append('export', 'true');

        window.location.href = `${this.indexUrl()}?${params.toString()}`;
    }

    // Métodos de utilidad para formateo
    static formatCantidad(cantidad: number): string {
        const signo = cantidad >= 0 ? '+' : '';
        return `${signo}${cantidad.toLocaleString('es-ES')}`;
    }

    static formatFecha(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatFechaCorta(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    // Métodos que no aplican para movimientos (readonly)
    editUrl(_id: Id): string {
        throw new Error('Los movimientos de inventario no son editables');
    }

    updateUrl(_id: Id): string {
        throw new Error('Los movimientos de inventario no son editables');
    }

    destroyUrl(_id: Id): string {
        throw new Error('Los movimientos de inventario no son eliminables');
    }

    destroy(_id: Id): void {
        NotificationService.warning('Los movimientos de inventario no pueden ser eliminados');
    }

    // Validación de datos del formulario (requerido por BaseService)
    validateData(data: MovimientoInventarioFormData): string[] {
        const errors: string[] = [];

        // Validaciones básicas
        if (!data.tipo) {
            errors.push('El tipo de movimiento es requerido');
        }

        if (!data.stock_producto_id) {
            errors.push('El producto y almacén son requeridos');
        }

        if (!data.cantidad || data.cantidad <= 0) {
            errors.push('La cantidad debe ser mayor a 0');
        }

        // Validaciones específicas por tipo de movimiento
        const tiposVenta: MovimientoTipo[] = ['SALIDA_VENTA'];
        const tiposCompra: MovimientoTipo[] = ['ENTRADA_COMPRA'];
        const tiposDocumento = [...tiposVenta, ...tiposCompra];

        if (tiposDocumento.includes(data.tipo)) {
            if (!data.numero_documento?.trim()) {
                errors.push('El número de documento es requerido para este tipo de movimiento');
            }
        }

        // Validaciones específicas para salidas
        const tiposSalida: MovimientoTipo[] = ['SALIDA_VENTA', 'SALIDA_AJUSTE', 'SALIDA_MERMA'];
        if (tiposSalida.includes(data.tipo)) {
            if (!data.observacion?.trim()) {
                errors.push('La observación es requerida para movimientos de salida');
            }
        }

        return errors;
    }
}

// Instancia por defecto del servicio
const movimientosInventarioService = new MovimientosInventarioService();
export default movimientosInventarioService;
