import axios from 'axios';

export interface Role {
    id: number;
    name: string;
    display_name?: string;
}

export type TipoNotificacion = 'promocion' | 'evento' | 'informativo' | 'oferta';
export type Frecuencia = 'una_vez' | 'diario' | 'semanal' | 'mensual';

export interface HorarioNotificacion {
    id?: number;
    hora: string; // HH:mm (el backend puede devolver HH:mm:ss)
    activo: boolean;
    ultimo_envio?: string | null;
}

export interface NotificacionRecurrente {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: TipoNotificacion;
    frecuencia: Frecuencia;
    hora_envio: string;
    dias_semana?: string[];
    dia_mes?: number | null;
    fecha_inicio: string;
    fecha_fin?: string | null;
    activo: boolean;
    total_enviadas: number;
    vistas: number;
    ultimo_envio?: string;
    usuario_id: number;
    roles?: Role[];
    horarios?: HorarioNotificacion[];
    imagen_url?: string | null;
    usuario?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

// Datos que se envían al crear/actualizar (los mismos campos que valida StoreNotificacionRequest)
export interface NotificacionPayload {
    titulo: string;
    descripcion: string;
    tipo: TipoNotificacion;
    frecuencia: Frecuencia;
    horarios: Pick<HorarioNotificacion, 'id' | 'hora' | 'activo'>[];
    fecha_inicio: string;
    fecha_fin: string | null;
    dias_semana: string[];
    dia_mes: number | null;
    activo: boolean;
    imagen_url: string | null;
    roles: number[]; // IDs
}

export interface FiltrosNotificaciones {
    search?: string;
    tipo?: string;
    frecuencia?: string;
    activo?: boolean;
    per_page?: number;
    page?: number;
}

export interface Estadisticas {
    total: number;
    activas: number;
    inactivas: number;
    proximas: number;
}

export interface Paginacion {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface ResponseListado {
    notificaciones: NotificacionRecurrente[];
    estadisticas: Estadisticas;
    pagination?: Paginacion;
    links?: any;
    meta?: any;
}

const API_URL = '/api/notificaciones';
const API_PUBLIC_URL = '/api/notificaciones/public/list';

const notificacionesService = {
    // Listar notificaciones (versión pública para móviles - sin permisos)
    async obtenerPublic(filtros: FiltrosNotificaciones = {}): Promise<ResponseListado> {
        const params = new URLSearchParams();
        if (filtros.search) params.append('search', filtros.search);
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        if (filtros.frecuencia) params.append('frecuencia', filtros.frecuencia);
        params.append('per_page', String(filtros.per_page || 15));
        params.append('page', String(filtros.page || 1));

        const { data } = await axios.get(`${API_PUBLIC_URL}?${params.toString()}`);
        return data.data || data;
    },

    // Listar notificaciones (versión con permisos para admin)
    async obtener(filtros: FiltrosNotificaciones = {}): Promise<ResponseListado> {
        const params = new URLSearchParams();
        if (filtros.search) params.append('search', filtros.search);
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        if (filtros.frecuencia) params.append('frecuencia', filtros.frecuencia);
        if (filtros.activo !== undefined) params.append('activo', String(filtros.activo));
        params.append('per_page', String(filtros.per_page || 15));
        params.append('page', String(filtros.page || 1));

        const { data } = await axios.get(`${API_URL}?${params.toString()}`);
        return data.data || data;
    },

    // Crear notificación
    async crear(datos: NotificacionPayload) {
        const { data } = await axios.post(API_URL, datos);
        return data.data || data;
    },

    // Obtener detalle
    async obtener_por_id(id: number): Promise<NotificacionRecurrente> {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data.data || data;
    },

    // Actualizar notificación
    async actualizar(id: number, datos: NotificacionPayload) {
        const { data } = await axios.put(`${API_URL}/${id}`, datos);
        return data.data || data;
    },

    // Eliminar notificación
    async eliminar(id: number) {
        const { data } = await axios.delete(`${API_URL}/${id}`);
        return data;
    },

    // Enviar notificación manualmente
    async enviar(id: number) {
        const { data } = await axios.post(`${API_URL}/${id}/enviar`);
        return data.data || data;
    },

    // Obtener roles disponibles
    async obtenerRoles(): Promise<Role[]> {
        const { data } = await axios.get(`${API_URL}/roles/list`);
        return data.data || [];
    },
};

export default notificacionesService;
