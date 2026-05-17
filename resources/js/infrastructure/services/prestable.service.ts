// Data Layer: Prestable service
// Patrón consolidado: Métodos HTTP directo para modales y componentes
import axios from 'axios';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Id } from '@/domain/entities/shared';
import type { Prestable, NuevoPrestable, PrestableStock } from '@/domain/entities/prestamos';

export class PrestableService extends GenericService<Prestable, NuevoPrestable> {
    constructor() {
        super('prestables');
    }

    // ========================================
    // Métodos HTTP directo para CRUD
    // ========================================

    async getAll() {
        const { data } = await axios.get('/api/prestables?per_page=1000');
        // data.data es un objeto con paginación, la array está en data.data.data
        const response = data.data as any;
        return (response.data || response) as Prestable[];
    }

    async getById(id: Id) {
        const { data } = await axios.get(`/api/prestables/${id}`);
        return data.data as Prestable;
    }

    async create(payload: NuevoPrestable) {
        console.log('📤 ENVIANDO AL BACKEND:', JSON.stringify(payload, null, 2));
        console.log('📍 URL: /api/prestables');
        try {
            console.log('⏳ Esperando respuesta del servidor...');
            const response = await axios.post('/api/prestables', payload);
            console.log('✅ RESPUESTA RECIBIDA:', response);
            console.log('📥 DATA:', JSON.stringify(response.data, null, 2));
            return response.data.data as Prestable;
        } catch (error: any) {
            console.error('❌ ERROR COMPLETO:', error);
            console.error('❌ Error config:', error?.config);
            console.error('❌ Error status:', error?.response?.status);
            console.error('❌ Error statusText:', error?.response?.statusText);
            console.error('❌ Error data:', error?.response?.data);
            console.error('❌ Error message:', error?.message);
            console.error('❌ Error network:', error?.code);
            throw error;
        }
    }

    async update(id: Id, payload: Partial<NuevoPrestable>) {
        const { data } = await axios.put(`/api/prestables/${id}`, payload);
        return data.data as Prestable;
    }

    async remove(id: Id) {
        await axios.delete(`/api/prestables/${id}`);
    }

    // ========================================
    // Métodos específicos del dominio
    // ========================================

    async obtenerStock(id: Id) {
        const { data } = await axios.get(`/api/prestables/${id}/stock`);
        return data.data as PrestableStock[];
    }

    async incrementarStock(id: Id, almacenId: Id, cantidad: number) {
        const { data } = await axios.post(`/api/prestables/${id}/stock/incrementar`, {
            almacen_id: almacenId,
            cantidad,
        });
        return data.data;
    }
}

const prestableService = new PrestableService();
export default prestableService;
