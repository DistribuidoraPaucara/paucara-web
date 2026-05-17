// Data Layer: Prestamo Cliente service
import axios from 'axios';
import type { Id, Pagination } from '@/domain/entities/shared';
import type {
    PrestamoCliente,
    DevolucionCliente,
    NuevoPrestamoCliente,
    DatosDevolucionCliente,
    FiltrosPrestamosCliente,
} from '@/domain/entities/prestamos';

export class PrestamoClienteService {
    constructor() {}

    // ========================================
    // CRUD básico
    // ========================================

    async getAll(filtros?: FiltrosPrestamosCliente & { page?: number; per_page?: number }) {
        const { data } = await axios.get('/api/prestamos-cliente', {
            params: { ...filtros, per_page: filtros?.per_page || 50 }
        });
        return data.data as Pagination<PrestamoCliente>;
    }

    async getById(id: Id) {
        const { data } = await axios.get(`/api/prestamos-cliente/${id}`);
        return data.data as PrestamoCliente;
    }

    async crear(payload: NuevoPrestamoCliente) {
        const { data } = await axios.post('/api/prestamos-cliente', payload);
        return data.data as PrestamoCliente;
    }

    // ========================================
    // Devoluciones
    // ========================================

    async registrarDevolucion(id: Id, payload: DatosDevolucionCliente) {
        const { data } = await axios.post(`/api/prestamos-cliente/${id}/devolver`, payload);
        return data.data as DevolucionCliente;
    }

    // ========================================
    // Filtros específicos
    // ========================================

    async getPendientesChofer(choferId: Id) {
        const { data } = await axios.get('/api/prestamos-cliente', {
            params: { chofer_id: choferId, estado: 'ACTIVO' },
        });
        return data.data as Pagination<PrestamoCliente>;
    }

    async getActivosCliente(clienteId: Id) {
        const { data } = await axios.get('/api/prestamos-cliente', {
            params: { cliente_id: clienteId, estado: 'ACTIVO' },
        });
        return data.data as Pagination<PrestamoCliente>;
    }
}

const prestamoClienteService = new PrestamoClienteService();
export default prestamoClienteService;
