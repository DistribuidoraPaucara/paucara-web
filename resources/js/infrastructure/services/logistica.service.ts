// Application Layer: Logistica service
// Encapsulates URL building and API calls for logistics operations (entregas, proformas)

import { router } from '@inertiajs/react';
import axios from 'axios';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseService } from '@/domain/entities/generic';
import type {
    EntregaLogistica,
    ProformaAppExterna,
    ProformaFilterParams,
    EnvioFilterParams,
    AprobarProformaData,
    RechazarProformaData,
} from '@/domain/entities/logistica';
import NotificationService from '@/infrastructure/services/notification.service';

// Aliases for backward compatibility
export type Entrega = EntregaLogistica;
export type Proforma = ProformaAppExterna;

export interface FiltrosEntregas extends Filters {
    estado?: string;
    chofer_id?: Id | '';
    vehiculo_id?: Id | '';
    fecha_desde?: string;
    fecha_hasta?: string;
}

export interface FiltrosProformas extends Filters {
    estado?: string;
    cliente_id?: Id | '';
    fecha_desde?: string;
    fecha_hasta?: string;
}

export interface AsignarEntregaData {
    chofer_id: Id;
    vehiculo_id: Id;
}

export interface ActualizarEstadoEntregaData {
    estado: string;
    comentario?: string;
    motivo?: string;
}


/**
 * Normalized API Response Format
 *
 * All list/paginated responses should follow this structure:
 * {
 *   data: T[],
 *   total: number,
 *   per_page: number,
 *   current_page: number
 * }
 *
 * All action responses should follow this structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any
 * }
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    last_page?: number;
    from?: number;
    to?: number;
}

export interface ActionResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export class LogisticaService implements BaseService<Entrega, AsignarEntregaData> {
    /**
     * Normalize paginated API responses to consistent format
     *
     * Handles multiple response formats:
     * 1. Direct pagination: { data, total, per_page, current_page }
     * 2. Success wrapper: { success, data, meta }
     * 3. Legacy format: any other format
     */
    private static normalizePaginatedResponse<T>(response: any, currentPage: number = 1): PaginatedResponse<T> {
        // Format 1: Already normalized (data at root level with pagination fields)
        if (response.data && Array.isArray(response.data) && response.total !== undefined) {
            return {
                data: response.data,
                total: response.total,
                per_page: response.per_page || 15,
                current_page: response.current_page || currentPage,
                last_page: response.last_page,
                from: response.from,
                to: response.to,
            };
        }

        // Format 2: Success wrapper with pagination object
        if (response.success && response.data && Array.isArray(response.data) && response.pagination) {
            return {
                data: response.data,
                total: response.pagination.total || response.data.length,
                per_page: response.pagination.per_page || 15,
                current_page: response.pagination.current_page || currentPage,
                last_page: response.pagination.last_page,
                from: response.pagination.from,
                to: response.pagination.to,
            };
        }

        // Format 3: Success wrapper with meta object
        if (response.success && response.data && Array.isArray(response.data) && response.meta) {
            return {
                data: response.data,
                total: response.meta.total || response.data.length,
                per_page: response.meta.per_page || 15,
                current_page: response.meta.current_page || currentPage,
                last_page: response.meta.last_page,
                from: response.meta.from,
                to: response.meta.to,
            };
        }

        // Format 4: Fallback
        return {
            data: Array.isArray(response) ? response : response.data || [],
            total: response.total || 0,
            per_page: response.per_page || 15,
            current_page: currentPage,
        };
    }

    /**
     * Normalize action API responses to consistent format
     */
    private static normalizeActionResponse<T = any>(response: any): ActionResponse<T> {
        if (typeof response === 'object' && response.success !== undefined) {
            return {
                success: response.success,
                message: response.message || (response.success ? 'Operación exitosa' : 'Error'),
                data: response.data,
            };
        }

        return {
            success: true,
            message: 'Operación completada',
            data: response,
        };
    }

    // BaseService implementations
    indexUrl(params?: { query?: Filters }): string {
        const baseUrl = '/api/encargado/entregas/asignadas';
        if (params?.query) {
            const queryString = new URLSearchParams(
                Object.entries(params.query).map(([k, v]) => [k, String(v)])
            ).toString();
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    createUrl(): string {
        return '/logistica/entregas/create';
    }

    showUrl(id: Id): string {
        return `/logistica/entregas/${id}`;
    }

    editUrl(id: Id): string {
        return `/logistica/entregas/${id}/edit`;
    }

    storeUrl(): string {
        return '/api/entregas';
    }

    updateUrl(id: Id): string {
        return `/api/entregas/${id}`;
    }

    destroyUrl(id: Id): string {
        return `/api/entregas/${id}`;
    }

    /**
     * Navegar al listado de entregas asignadas
     */
    navigateToAsignadas(filters?: FiltrosEntregas): void {
        if (filters) {
            this.searchEntregas(filters);
        } else {
            router.get('/logistica/entregas-asignadas', {}, {
                preserveState: true,
            });
        }
    }

    /**
     * Navegar al listado de entregas en tránsito
     */
    navigateToEnTransito(filters?: FiltrosEntregas): void {
        if (filters) {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) =>
                    value !== '' && value != null && value !== undefined
                )
            );
            router.get('/logistica/entregas-en-transito', cleanFilters, {
                preserveState: true,
                replace: true,
            });
        } else {
            router.get('/logistica/entregas-en-transito', {}, {
                preserveState: true,
            });
        }
    }

    /**
     * Búsqueda de entregas con filtros
     */
    searchEntregas(filters: FiltrosEntregas): void {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );

        router.get('/logistica/entregas-asignadas', cleanFilters, {
            preserveState: true,
            replace: true,
            onError: (errors) => {
                NotificationService.error('Error al realizar la búsqueda');
                console.error('Search errors:', errors);
            }
        });
    }

    /**
     * Búsqueda de entregas en tránsito
     */
    searchEntregasEnTransito(filters: FiltrosEntregas): void {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );

        router.get('/logistica/entregas-en-transito', cleanFilters, {
            preserveState: true,
            replace: true,
            onError: (errors) => {
                NotificationService.error('Error al realizar la búsqueda');
                console.error('Search errors:', errors);
            }
        });
    }

    /**
     * Limpiar filtros de entregas
     */
    clearFilters(): void {
        router.get('/logistica/entregas-asignadas', {}, {
            preserveState: true,
            replace: true,
        });
    }

    /**
     * Obtener entregas asignadas (API call)
     * Normaliza la respuesta a formato estándar de paginación
     */
    async obtenerEntregasAsignadas(page: number = 1, filters?: FiltrosEntregas): Promise<PaginatedResponse<Entrega>> {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== '' && value != null && value !== undefined) {
                        params.append(key, String(value));
                    }
                });
            }

            const response = await fetch(`/api/encargado/entregas/asignadas?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener entregas asignadas');
            }

            const result = await response.json();
            return LogisticaService.normalizePaginatedResponse<Entrega>(result, page);
        } catch (error) {
            console.error('Error obteniendo entregas asignadas:', error);
            NotificationService.error('Error al obtener entregas');
            throw error;
        }
    }

    /**
     * Obtener entregas en tránsito (API call)
     * Normaliza la respuesta a formato estándar de paginación
     */
    async obtenerEntregasEnTransito(page: number = 1, filters?: FiltrosEntregas): Promise<PaginatedResponse<Entrega>> {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== '' && value != null && value !== undefined) {
                        params.append(key, String(value));
                    }
                });
            }

            const response = await fetch(`/api/encargado/entregas/activas?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener entregas en tránsito');
            }

            const result = await response.json();
            return LogisticaService.normalizePaginatedResponse<Entrega>(result, page);
        } catch (error) {
            console.error('Error obteniendo entregas en tránsito:', error);
            NotificationService.error('Error al obtener entregas');
            throw error;
        }
    }

    /**
     * Obtener proformas pendientes de aprobación (API call)
     */
    /**
     * Obtener proformas pendientes
     *
     * Usa el endpoint /api/proformas con filtro de estado PENDIENTE
     * El backend filtra automáticamente por rol:
     * - Cliente: Solo sus proformas
     * - Preventista: Solo las que él creó
     * - Logística/Admin/Cajero: Todas las proformas
     *
     * Normaliza la respuesta a formato estándar de paginación
     */
    async obtenerProformasPendientes(page: number = 1, filters?: FiltrosProformas): Promise<PaginatedResponse<Proforma>> {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('estado', 'PENDIENTE'); // Filtrar solo pendientes

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== '' && value != null && value !== undefined) {
                        params.append(key, String(value));
                    }
                });
            }

            const response = await fetch(`/api/proformas?${params}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener proformas pendientes');
            }

            const result = await response.json();

            // Normalizar respuesta a formato consistente
            return LogisticaService.normalizePaginatedResponse<Proforma>(result, page);
        } catch (error) {
            console.error('Error obteniendo proformas pendientes:', error);
            NotificationService.error('Error al obtener proformas');
            throw error;
        }
    }

    /**
     * Asignar chofer y vehículo a una entrega
     */
    async asignarEntrega(entregaId: Id, data: AsignarEntregaData): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const response = await axios.post(`/api/encargado/entregas/${entregaId}/asignar`, data);
            NotificationService.success('Entrega asignada exitosamente');
            return response.data;
        } catch (error: any) {
            console.error('Error asignando entrega:', error);
            const message = error.response?.data?.message || 'Error al asignar entrega';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Aprobar una proforma
     */
    async aprobarProforma(proformaId: Id, data: AprobarProformaData | string = ''): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            // Soportar llamadas antiguas con solo comentario string
            const payload = typeof data === 'string' ? { comentario: data } : data;

            const response = await axios.post(`/api/encargado/proformas/${proformaId}/aprobar`, payload);
            NotificationService.success('Proforma aprobada exitosamente');
            return response.data;
        } catch (error: any) {
            console.error('Error aprobando proforma:', error);
            const message = error.response?.data?.message || 'Error al aprobar proforma';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Rechazar una proforma
     */
    async rechazarProforma(proformaId: Id, motivo: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            if (!motivo || motivo.trim() === '') {
                throw new Error('El motivo de rechazo es obligatorio');
            }

            const response = await axios.post(`/api/proformas/${proformaId}/rechazar`, { comentario: motivo });
            NotificationService.success('Proforma rechazada');
            return response.data;
        } catch (error: any) {
            console.error('Error rechazando proforma:', error);
            const message = error.response?.data?.message || 'Error al rechazar proforma';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Obtener ubicaciones de una entrega para mapa
     */
    async obtenerUbicacionesEntrega(entregaId: Id): Promise<{
        ubicaciones: Array<{
            latitud: number;
            longitud: number;
            timestamp: string;
        }>;
        ultima_ubicacion: {
            latitud: number;
            longitud: number;
            velocidad?: number;
            timestamp: string;
        } | null;
    }> {
        try {
            const response = await fetch(`/api/tracking/ubicaciones/${entregaId}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener ubicaciones');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo ubicaciones:', error);
            throw error;
        }
    }

    /**
     * Obtener ETA de una entrega
     */
    async obtenerETA(entregaId: Id, latDestino: number, lngDestino: number): Promise<{
        distancia_km: number;
        tiempo_estimado_minutos: number;
        tiempo_estimado_formato: string;
        velocidad_actual_kmh: number;
        ubicacion_actual: { latitud: number; longitud: number };
        ubicacion_destino: { latitud: number; longitud: number };
    }> {
        try {
            const params = new URLSearchParams({
                entrega_id: String(entregaId),
                lat_destino: String(latDestino),
                lng_destino: String(lngDestino),
            });

            const response = await fetch(`/api/tracking/calcular-eta?${params}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al calcular ETA');
            }

            return await response.json();
        } catch (error) {
            console.error('Error calculando ETA:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas del dashboard de logística
     *
     * NOTA: El endpoint /api/logistica/dashboard/stats no está implementado.
     * Las estadísticas se obtienen desde el servidor web mediante Inertia.
     * Este método devuelve null para indicar que no hay datos adicionales disponibles.
     *
     * @returns null - Las estadísticas se obtienen del servidor web, no desde API
     */
    async obtenerDashboardStats(): Promise<null> {
        // El endpoint no existe, devolver null
        // El dashboard obtiene sus datos desde el servidor via Inertia
        return null;
    }

    /**
     * Obtener estadísticas básicas de entregas
     * (método legacy, mantener por compatibilidad)
     */
    async obtenerEstadisticas(): Promise<{
        entregas_asignadas: number;
        entregas_en_transito: number;
        entregas_entregadas_hoy: number;
        proformas_pendientes: number;
        entregas_con_novedad: number;
    }> {
        try {
            const response = await fetch('/api/encargado/dashboard/stats', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo estadísticas');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas específicas de proformas
     *
     * Retorna estadísticas detalladas de proformas filtradas por rol del usuario:
     * - Cliente: Solo sus proformas
     * - Preventista: Solo las que él creó
     * - Logística/Admin/Cajero: Todas las proformas
     */
    async obtenerEstadisticasProformas(): Promise<{
        success: boolean;
        data: {
            total: number;
            por_estado: {
                pendiente: number;
                aprobada: number;
                rechazada: number;
                convertida: number;
                vencida: number;
            };
            montos_por_estado: {
                pendiente: number;
                aprobada: number;
                rechazada: number;
                convertida: number;
                vencida: number;
            };
            por_canal: {
                app_externa: number;
                web: number;
                presencial: number;
            };
            alertas: {
                vencidas: number;
                por_vencer: number;
            };
            monto_total: number;
        };
    }> {
        try {
            const response = await fetch('/api/proformas/estadisticas', {
                credentials: 'include', // FIX: Include session cookies for authentication
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo estadísticas de proformas');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo estadísticas de proformas:', error);
            NotificationService.error('Error al obtener estadísticas de proformas');
            throw error;
        }
    }

    /**
     * Obtener vehículos disponibles para asignar
     */
    async obtenerVehiculosDisponibles(): Promise<Array<{
        id: Id;
        placa: string;
        marca: string;
        modelo: string;
        estado: string;
    }>> {
        try {
            const response = await fetch('/api/vehiculos/disponibles', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo vehículos');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo vehículos:', error);
            NotificationService.error('Error al obtener vehículos disponibles');
            throw error;
        }
    }

    /**
     * Obtener choferes disponibles para asignar
     */
    async obtenerChoferesDisponibles(): Promise<Array<{
        id: Id;
        nombre: string;
        email: string;
        telefono?: string;
    }>> {
        try {
            const response = await fetch('/api/choferes/disponibles', {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo choferes');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo choferes:', error);
            NotificationService.error('Error al obtener choferes disponibles');
            throw error;
        }
    }

    /**
     * Validar datos de asignación
     */
    validateAsignarEntrega(data: AsignarEntregaData): string[] {
        const errors: string[] = [];

        if (!data.chofer_id || data.chofer_id === 0) {
            errors.push('Debe seleccionar un chofer');
        }

        if (!data.vehiculo_id || data.vehiculo_id === 0) {
            errors.push('Debe seleccionar un vehículo');
        }

        return errors;
    }

    /**
     * Validar motivo de rechazo
     */
    validateRechazarProforma(motivo: string): string[] {
        const errors: string[] = [];

        if (!motivo || motivo.trim() === '') {
            errors.push('El motivo de rechazo es obligatorio');
        }

        if (motivo.length < 10) {
            errors.push('El motivo debe tener al menos 10 caracteres');
        }

        if (motivo.length > 500) {
            errors.push('El motivo no puede exceder 500 caracteres');
        }

        return errors;
    }

    /**
     * Marcar llegada a destino para una entrega
     * Requiere coordenadas GPS del destino
     */
    async marcarLlegada(entregaId: Id, data: {
        latitud: number;
        longitud: number;
    }): Promise<ActionResponse<Entrega>> {
        try {
            const response = await axios.post(
                `/api/encargado/entregas/${entregaId}/marcar-llegada`,
                data
            );
            NotificationService.success('Llegada marcada correctamente');
            return response.data;
        } catch (error: any) {
            console.error('Error marcando llegada:', error);
            const message = error.response?.data?.message || 'Error al marcar llegada';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Confirmar entrega con firma digital y fotos
     */
    async confirmarEntrega(entregaId: Id, data: {
        firma_digital?: string; // Base64
        fotos?: string[]; // Array de base64
        observaciones?: string;
    }): Promise<ActionResponse<Entrega>> {
        try {
            const response = await axios.post(
                `/api/encargado/entregas/${entregaId}/confirmar-entrega`,
                data
            );
            NotificationService.success('Entrega confirmada exitosamente');
            return response.data;
        } catch (error: any) {
            console.error('Error confirmando entrega:', error);
            const message = error.response?.data?.message || 'Error al confirmar entrega';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Confirmar entrega de una venta específica dentro de una entrega
     * @param entregaId - ID de la entrega
     * @param ventaId - ID de la venta a confirmar
     * @param data - Datos de confirmación (firma, fotos, contexto de entrega)
     */
    async confirmarVentaEnEntrega(
        entregaId: Id,
        ventaId: Id,
        data: {
            firma_digital_base64?: string; // Base64
            fotos?: string[]; // Array de base64
            observaciones?: string;
            // ✅ NUEVO: Contexto de entrega
            tienda_abierta?: boolean;      // ¿Tienda estaba abierta?
            cliente_presente?: boolean;     // ¿Cliente presente?
            motivo_rechazo?: 'TIENDA_CERRADA' | 'CLIENTE_AUSENTE' | 'CLIENTE_RECHAZA' | 'DIRECCION_INCORRECTA' | 'CLIENTE_NO_IDENTIFICADO' | 'OTRO';
            // ✅ FASE 1: Confirmación de Pago
            estado_pago?: 'PAGADO' | 'PARCIAL' | 'NO_PAGADO';
            monto_recibido?: number;       // Dinero recibido del cliente
            tipo_pago_id?: Id;             // FK a tipos_pago
            motivo_no_pago?: string;       // Razón si NO pagó
            // ✅ FASE 2: Foto de comprobante
            foto_comprobante?: string;     // Base64 foto del dinero o comprobante
        }
    ): Promise<ActionResponse<any>> {
        try {
            const response = await axios.post(
                `/api/chofer/entregas/${entregaId}/ventas/${ventaId}/confirmar-entrega`,
                data
            );
            NotificationService.success('Venta entregada exitosamente');
            return response.data;
        } catch (error: any) {
            console.error('Error confirmando venta:', error);
            const message = error.response?.data?.message || 'Error al confirmar venta';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * ✅ NUEVO: Finalizar entrega (después de todas las ventas entregadas)
     * @param entregaId - ID de la entrega
     * @param data - Datos de finalización (firma, fotos, observaciones, monto recolectado)
     */
    async finalizarEntrega(
        entregaId: Id,
        data: {
            firma_digital_base64?: string; // Base64
            fotos?: string[]; // Array de base64
            observaciones?: string;
            monto_recolectado?: number; // Dinero recolectado
        }
    ): Promise<ActionResponse<Entrega>> {
        try {
            const response = await axios.post(
                `/api/chofer/entregas/${entregaId}/finalizar-entrega`,
                data
            );
            NotificationService.success('Entrega finalizada exitosamente');
            return response.data;
        } catch (error: any) {
            console.error('Error finalizando entrega:', error);
            const message = error.response?.data?.message || 'Error al finalizar entrega';
            NotificationService.error(message);
            throw error;
        }
    }

    /**
     * Reportar novedad en una entrega
     */
    async reportarNovedad(entregaId: Id, data: {
        motivo: string;
        descripcion?: string;
        foto?: string; // Base64
    }): Promise<ActionResponse<Entrega>> {
        try {
            if (!data.motivo || data.motivo.trim() === '') {
                throw new Error('El motivo de novedad es obligatorio');
            }

            const response = await axios.post(
                `/api/encargado/entregas/${entregaId}/reportar-novedad`,
                data
            );
            NotificationService.success('Novedad reportada correctamente');
            return response.data;
        } catch (error: any) {
            console.error('Error reportando novedad:', error);
            const message = error.response?.data?.message || 'Error al reportar novedad';
            NotificationService.error(message);
            throw error;
        }
    }
}

// Singleton instance
const logisticaService = new LogisticaService();
export default logisticaService;
