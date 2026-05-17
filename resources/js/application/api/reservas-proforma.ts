/**
 * API: Reservas Proforma
 * Servicios para obtener y gestionar reservas de proformas
 */

import type { ReservaProforma, ReservaProformaDetalle, ReservaProformaFilters, ReservaProformaResponse } from '@/domain/entities/reservas-proforma';

export const reservasProformaApi = {
    /**
     * Obtener lista de reservas con filtros y paginación
     * GET /api/reservas-proforma
     */
    async obtenerLista(filters?: ReservaProformaFilters): Promise<ReservaProformaResponse> {
        try {
            const params = new URLSearchParams();

            if (filters) {
                if (filters.estado) params.append('estado', filters.estado);
                if (filters.proforma_id) params.append('proforma_id', filters.proforma_id.toString());
                if (filters.proforma_numero) params.append('proforma_numero', filters.proforma_numero);
                if (filters.producto_id) params.append('producto_id', filters.producto_id.toString());
                if (filters.almacen_id) params.append('almacen_id', filters.almacen_id.toString());
                if (filters.cliente_id) params.append('cliente_id', filters.cliente_id.toString());
                if (filters.vencimiento) params.append('vencimiento', filters.vencimiento);
                if (filters.fecha_creacion_desde) params.append('fecha_creacion_desde', filters.fecha_creacion_desde);
                if (filters.fecha_creacion_hasta) params.append('fecha_creacion_hasta', filters.fecha_creacion_hasta);
                if (filters.fecha_vencimiento_desde) params.append('fecha_vencimiento_desde', filters.fecha_vencimiento_desde);
                if (filters.fecha_vencimiento_hasta) params.append('fecha_vencimiento_hasta', filters.fecha_vencimiento_hasta);
                if (filters.ordenamiento) params.append('ordenamiento', filters.ordenamiento);
                if (filters.per_page) params.append('per_page', filters.per_page.toString());
                if (filters.page) params.append('page', filters.page.toString());
                // ✅ NUEVO (2026-02-12): Agregar búsqueda flexible de producto
                if (filters.producto_busqueda) params.append('producto_busqueda', filters.producto_busqueda);
            }

            // ✅ NUEVO (2026-02-12): Logging en consola de parámetros enviados
            console.group('🔍 [ReservasAPI] obtenerLista()');
            console.log('📦 Filtros aplicados:', filters);
            console.log('🌐 URL de solicitud:', `/api/reservas-proforma?${params.toString()}`);
            console.log('📋 Parámetros query:', Object.fromEntries(params));
            console.groupEnd();

            const response = await fetch(`/api/reservas-proforma?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo lista de reservas:', error);
            throw error;
        }
    },

    /**
     * Obtener detalle de una reserva específica
     * GET /api/reservas-proforma/{id}
     */
    async obtenerDetalle(id: number): Promise<{ success: boolean; data: ReservaProformaDetalle }> {
        try {
            const response = await fetch(`/api/reservas-proforma/${id}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo detalle de reserva:', error);
            throw error;
        }
    },

    /**
     * Liberar una reserva activa
     * POST /api/reservas-proforma/{id}/liberar
     */
    async liberar(id: number): Promise<{ success: boolean; message: string; data: ReservaProforma }> {
        try {
            // Obtener token CSRF del meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch(`/api/reservas-proforma/${id}/liberar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error liberando reserva:', error);
            throw error;
        }
    },
};
