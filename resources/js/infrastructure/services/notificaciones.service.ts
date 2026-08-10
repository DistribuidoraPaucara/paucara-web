import axios from 'axios';

export interface Role {
    id: number;
    name: string;
    display_name?: string;
}

export interface NotificacionRecurrente {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: 'promocion' | 'evento' | 'informativo' | 'oferta';
    frecuencia: 'una_vez' | 'diario' | 'semanal' | 'mensual';
    hora_envio: string;
    dias_semana?: string[];
    dia_mes?: number;
    fecha_inicio: string;
    fecha_fin?: string;
    activo: boolean;
    total_enviadas: number;
    vistas: number;
    ultimo_envio?: string;
    usuario_id: number;
    roles?: Role[];
    usuario?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
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

export interface ResponseListado {
    notificaciones: NotificacionRecurrente[];
    estadisticas: Estadisticas;
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
    async crear(datos: Partial<NotificacionRecurrente>) {
        const { data } = await axios.post(API_URL, datos);
        return data.data || data;
    },

    // Obtener detalle
    async obtener_por_id(id: number): Promise<NotificacionRecurrente> {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data.data || data;
    },

    // Actualizar notificación
    async actualizar(id: number, datos: Partial<NotificacionRecurrente>) {
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
