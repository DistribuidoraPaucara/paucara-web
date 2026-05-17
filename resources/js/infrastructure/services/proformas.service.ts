// Infrastructure Layer: Proformas Service
// Encapsulates URL building and API interaction logic for proformas

import { router } from '@inertiajs/react';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseService } from '@/domain/entities/generic';
import type { Proforma, ProformaFormData } from '@/domain/entities/proformas';
import NotificationService from '@/infrastructure/services/notification.service';

/**
 * Servicio para gestionar proformas
 * Proporciona métodos para realizar operaciones CRUD y acciones específicas
 *
 * Sigue el patrón de Inertia.js para navegación y POST/PUT/DELETE
 */
export class ProformasService implements BaseService<Proforma, ProformaFormData> {
    /**
     * URL para listar proformas
     */
    indexUrl(params?: { query?: Filters }): string {
        const baseUrl = '/proformas';
        if (params?.query) {
            const queryString = new URLSearchParams(
                Object.entries(params.query).map(([k, v]) => [k, String(v)])
            ).toString();
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    /**
     * URL para crear una nueva proforma
     */
    createUrl(): string {
        return '/proformas/create';
    }

    /**
     * URL para ver detalle de una proforma
     */
    showUrl(id: Id): string {
        return `/proformas/${id}`;
    }

    /**
     * URL para editar una proforma
     */
    editUrl(id: Id): string {
        return `/proformas/${id}/edit`;
    }

    /**
     * URL para almacenar una nueva proforma
     */
    storeUrl(): string {
        return '/proformas';
    }

    /**
     * URL para actualizar una proforma existente
     */
    updateUrl(id: Id): string {
        return `/proformas/${id}`;
    }

    /**
     * URL para eliminar una proforma
     */
    destroyUrl(id: Id): string {
        return `/proformas/${id}`;
    }

    // ============================================
    // ACCIONES ESPECÍFICAS DE PROFORMA
    // ============================================

    /**
     * URL para aprobar una proforma
     * POST /proformas/{id}/aprobar (web endpoint for ReservaStock compatibility)
     */
    aprobarUrl(id: Id): string {
        return `/proformas/${id}/aprobar`;
    }

    /**
     * URL para rechazar una proforma
     * POST /proformas/{id}/rechazar (web endpoint for ReservaStock compatibility)
     */
    rechazarUrl(id: Id): string {
        return `/proformas/${id}/rechazar`;
    }

    /**
     * URL para convertir una proforma a venta
     * POST /proformas/{id}/convertir-venta (web endpoint for ReservaStock compatibility)
     */
    convertirVentaUrl(id: Id): string {
        return `/proformas/${id}/convertir-venta`;
    }

    /**
     * URL para guardar la coordinación de entrega
     * POST /api/proformas/{id}/coordinar
     */
    coordinarUrl(id: Id): string {
        return `/api/proformas/${id}/coordinar`;
    }

    // ============================================
    // MÉTODOS DE BÚSQUEDA Y NAVEGACIÓN
    // ============================================

    /**
     * Buscar proformas con filtros
     */
    search(filters: Filters): void {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );

        router.get('/proformas', cleanFilters, {
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
        router.get('/proformas', {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Navegar a la vista de detalle
     */
    show(id: Id): void {
        router.get(this.showUrl(id), {}, {
            onError: (errors) => {
                NotificationService.error('Error al cargar la proforma');
                console.error('Show navigation errors:', errors);
            }
        });
    }

    /**
     * Navegar a la edición
     */
    edit(id: Id): void {
        router.get(this.editUrl(id), {}, {
            onError: (errors) => {
                NotificationService.error('Error al acceder al formulario de edición');
                console.error('Edit navigation errors:', errors);
            }
        });
    }

    // ============================================
    // MÉTODOS DE VALIDACIÓN
    // ============================================

    /**
     * Validar datos de proforma
     */
    async validateData(data: ProformaFormData): Promise<string[]> {
        const errors: string[] = [];

        if (!data.numero) {
            errors.push('El número de proforma es obligatorio');
        }

        if (!data.fecha) {
            errors.push('La fecha es obligatoria');
        }

        if (!data.cliente_id || data.cliente_id === 0) {
            errors.push('Debe seleccionar un cliente');
        }

        if (!data.detalles || data.detalles.length === 0) {
            errors.push('Debe agregar al menos un producto a la proforma');
        }

        if (data.subtotal < 0) {
            errors.push('El subtotal no puede ser negativo');
        }

        if (data.descuento < 0) {
            errors.push('El descuento no puede ser negativo');
        }

        if (data.total < 0) {
            errors.push('El total no puede ser negativo');
        }

        return errors;
    }
}

// Singleton instance
const proformasService = new ProformasService();
export default proformasService;
