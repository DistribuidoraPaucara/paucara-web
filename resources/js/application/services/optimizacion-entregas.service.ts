/**
 * Servicio para creación en lote de entregas con optimización
 * PHASE 2: Integración con API de entregas masivas
 */

import type { Id } from '@/domain/entities/shared';

export interface CrearLoteRequest {
    venta_ids: Id[];
    vehiculo_id: Id;
    chofer_id: Id;
    entregador_id?: Id | null;
    zona_id?: Id | null;
    observaciones?: string;
    // Campos opcionales para caso single (unificación de flujos)
    fecha_programada?: string;
    direccion_entrega?: string;
}

export interface VentaEnEntrega {
    id: number;
    numero: string;
    cliente: string;
    total: number;
}

export interface CrearLoteResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        numero_entrega: string;
        estado: string;
        fecha_asignacion: string;
        vehiculo: {
            id: number;
            placa: string;
        };
        chofer: {
            id: number;
            nombre: string;
        };
        entregador?: {
            id: number;
            name: string;
        };
        ventas_count: number;
        ventas: VentaEnEntrega[];
        peso_kg: number;
        volumen_m3: number;
    };
    errors?: Record<string, string[]>;
}

class OptimizacionEntregasService {
    private readonly API_ENDPOINT = '/api/entregas/crear-consolidada';

    /**
     * Crear entrega consolidada
     * Crea 1 entrega con múltiples ventas asociadas en la tabla pivot
     */
    async crearLote(request: CrearLoteRequest): Promise<CrearLoteResponse> {
        try {
            console.log('🚀 POST /api/entregas/crear-consolidada con datos:', {
                venta_ids: request.venta_ids,
                vehiculo_id: request.vehiculo_id,
                chofer_id: request.chofer_id,
                entregador_id: request.entregador_id,
                zona_id: request.zona_id,
                observaciones: request.observaciones,
                fecha_programada: request.fecha_programada,
                direccion_entrega: request.direccion_entrega,
            });

            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify(request),
            });

            console.log('📨 Respuesta recibida - Status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();

                console.error('❌ Error en respuesta:', {
                    status: response.status,
                    message: errorData.message,
                    error: errorData.error,
                    errors: errorData.errors,
                    fullResponse: errorData,
                });

                // Prioridad de mensajes: message > error > errors > status
                const errorMessage =
                    errorData.message ||
                    errorData.error ||
                    (errorData.errors ? JSON.stringify(errorData.errors) : null) ||
                    `Error ${response.status}: ${response.statusText}`;

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ Entrega consolidada creada exitosamente:', {
                id: data.data?.id,
                numero_entrega: data.data?.numero_entrega,
                ventas_count: data.data?.ventas_count,
            });

            return data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error en crearLote:', message);
            throw new Error(message);
        }
    }

    /**
     * 🔧 NUEVO: Actualizar entrega existente (reemplazar datos)
     * PATCH /api/entregas/{entrega_id}
     */
    async actualizarEntrega(entregaId: Id, request: CrearLoteRequest): Promise<CrearLoteResponse> {
        try {
            const endpoint = `/api/entregas/${entregaId}`;
            console.log('🔧 PATCH /api/entregas/' + entregaId + ' con datos:', {
                venta_ids: request.venta_ids,
                vehiculo_id: request.vehiculo_id,
                chofer_id: request.chofer_id,
                entregador_id: request.entregador_id,
                zona_id: request.zona_id,
                observaciones: request.observaciones,
                fecha_programada: request.fecha_programada,
                direccion_entrega: request.direccion_entrega,
            });

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify(request),
            });

            console.log('📨 Respuesta recibida - Status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();

                console.error('❌ Error en respuesta:', {
                    status: response.status,
                    message: errorData.message,
                    error: errorData.error,
                    errors: errorData.errors,
                    fullResponse: errorData,
                });

                const errorMessage =
                    errorData.message ||
                    errorData.error ||
                    (errorData.errors ? JSON.stringify(errorData.errors) : null) ||
                    `Error ${response.status}: ${response.statusText}`;

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ Entrega actualizada exitosamente:', {
                id: data.data?.id,
                numero_entrega: data.data?.numero_entrega,
                ventas_count: data.data?.ventas_count,
            });

            return data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error en actualizarEntrega:', message);
            throw new Error(message);
        }
    }

    /**
     * Obtener el token CSRF del documento
     */
    private getCsrfToken(): string {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') || '';
    }
}

export const optimizacionEntregasService = new OptimizacionEntregasService();
