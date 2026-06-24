import type { Id, ApiResponse } from '~/domain/entities/shared';
import type {
    PrestamoEvento,
    NuevoPrestamoEvento,
    DevolucionEvento,
} from '~/domain/entities/prestamos';

const BASE_URL = '/api/prestamos-evento';

export const prestamoEventoService = {
    /**
     * Crear nuevo préstamo a evento
     */
    async crear(payload: NuevoPrestamoEvento): Promise<PrestamoEvento> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data: ApiResponse<PrestamoEvento> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error creando préstamo a evento');
        }

        return data.data;
    },

    /**
     * Obtener detalles de un préstamo
     */
    async obtener(id: Id): Promise<PrestamoEvento> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data: ApiResponse<PrestamoEvento> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error obteniendo préstamo');
        }

        return data.data;
    },

    /**
     * Alias para obtener (compatible con RegistrarDevolucionGenerico)
     */
    async getById(id: Id): Promise<PrestamoEvento> {
        return this.obtener(id);
    },

    /**
     * Listar préstamos con paginación
     */
    async listar(filtros?: {
        id?: string;
        chofer_id?: Id;
        estado?: string;
        nombre_evento?: string;
        encargado_evento?: string;
        nombre_cliente?: string;
        nombre_chofer?: string;
        vehiculo_asignado?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        per_page?: number;
        page?: number;
    }): Promise<{
        data: PrestamoEvento[];
        pagination: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
        };
    }> {
        const params = new URLSearchParams();

        if (filtros?.id) {
            params.append('id', filtros.id);
        }
        if (filtros?.chofer_id) {
            params.append('chofer_id', String(filtros.chofer_id));
        }
        if (filtros?.estado) {
            params.append('estado', filtros.estado);
        }
        if (filtros?.nombre_evento) {
            params.append('nombre_evento', filtros.nombre_evento);
        }
        if (filtros?.encargado_evento) {
            params.append('encargado_evento', filtros.encargado_evento);
        }
        if (filtros?.nombre_cliente) {
            params.append('nombre_cliente', filtros.nombre_cliente);
        }
        if (filtros?.nombre_chofer) {
            params.append('nombre_chofer', filtros.nombre_chofer);
        }
        if (filtros?.vehiculo_asignado) {
            params.append('vehiculo_asignado', filtros.vehiculo_asignado);
        }
        if (filtros?.fecha_desde) {
            params.append('fecha_desde', filtros.fecha_desde);
        }
        if (filtros?.fecha_hasta) {
            params.append('fecha_hasta', filtros.fecha_hasta);
        }
        if (filtros?.per_page) {
            params.append('per_page', String(filtros.per_page));
        }
        if (filtros?.page) {
            params.append('page', String(filtros.page));
        }

        const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data: any = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error listando préstamos');
        }

        // Manejar respuesta paginada de Laravel
        // data = {success: true, data: {data: [...], links, meta}}
        if (data.data?.data && Array.isArray(data.data.data)) {
            return {
                data: data.data.data,
                pagination: {
                    current_page: data.data.meta?.current_page || 1,
                    last_page: data.data.meta?.last_page || 1,
                    per_page: data.data.meta?.per_page || 15,
                    total: data.data.meta?.total || 0,
                    from: data.data.meta?.from || 1,
                    to: data.data.meta?.to || 0,
                },
            };
        }

        return {
            data: Array.isArray(data) ? data : [],
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 15,
                total: Array.isArray(data) ? data.length : 0,
                from: 1,
                to: Array.isArray(data) ? data.length : 0,
            },
        };
    },

    /**
     * Registrar devolución
     */
    async devolver(
        id: Id,
        datos: {
            fecha_devolucion: string;
            monto_cobrado_daño_total?: number;
            monto_garantia_devuelta_total?: number;
            observaciones?: string;
            almacen_id?: Id;
            devolucion_automatica?: boolean;
            detalles: Array<{
                prestamo_evento_detalle_id: Id;
                cantidad_devuelta: number;
                cantidad_dañada_parcial?: number;
                cantidad_dañada_total?: number;
                monto_cobrado_daño?: number;
                monto_garantia_devuelta?: number;
                // ✅ NUEVO: Almacenes específicos para este detalle
                devolucion_almacenes?: Array<{
                    almacenes_prestables_id: Id;
                    cantidad_devuelta: number;
                    cantidad_dañada_total: number;
                }>;
            }>;
        }
    ): Promise<DevolucionEvento> {
        const response = await fetch(`${BASE_URL}/${id}/devolver`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });

        const data: ApiResponse<DevolucionEvento> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error registrando devolución');
        }

        return data.data;
    },

    /**
     * Alias para devolver (compatible con RegistrarDevolucionGenerico)
     */
    async registrarDevolucion(id: Id, payload: any): Promise<DevolucionEvento> {
        return this.devolver(id, payload);
    },

    /**
     * Anular préstamo
     */
    async anular(id: Id, razon?: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}/anular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razon_anulacion: razon }),
        });

        const data: ApiResponse<any> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error anulando préstamo');
        }
    },
};

export default prestamoEventoService;
