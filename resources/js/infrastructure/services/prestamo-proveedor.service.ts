// Data Layer: Prestamo Proveedor service
import axios from 'axios';
import type { Id, Pagination } from '@/domain/entities/shared';
import type {
    PrestamoProveedor,
    NuevoPrestamoProveedor,
    DatosDevolucionProveedor,
    FiltrosPrestamosProveedor,
} from '@/domain/entities/prestamos';

export class PrestamoProveedorService {
    constructor() {}

    // ========================================
    // CRUD básico
    // ========================================

    async getAll(filtros?: FiltrosPrestamosProveedor & { page?: number; per_page?: number }) {
        const { data } = await axios.get('/api/prestamos-proveedor', {
            params: { ...filtros, per_page: filtros?.per_page || 50 }
        });
        return data.data as Pagination<PrestamoProveedor>;
    }

    async getById(id: Id) {
        const { data } = await axios.get(`/api/prestamos-proveedor/${id}`);
        return data.data as PrestamoProveedor;
    }

    async crear(payload: NuevoPrestamoProveedor) {
        const { data } = await axios.post('/api/prestamos-proveedor', payload);
        return data.data as PrestamoProveedor;
    }

    // ========================================
    // Devoluciones
    // ========================================

    async registrarDevolucion(id: Id, payload: DatosDevolucionProveedor) {
        const { data } = await axios.post(`/api/prestamos-proveedor/${id}/devolver`, payload);
        return data.data as PrestamoProveedor;
    }

    // ========================================
    // Filtros específicos
    // ========================================

    async getActivosProveedor(proveedorId: Id) {
        const { data } = await axios.get('/api/prestamos-proveedor', {
            params: { proveedor_id: proveedorId, estado: 'ACTIVO' },
        });
        return data.data as Pagination<PrestamoProveedor>;
    }

    async getDeuda(proveedorId: Id) {
        const { data } = await axios.get('/api/prestamos-proveedor', {
            params: { proveedor_id: proveedorId },
        });
        const prestamos = data.data as Pagination<PrestamoProveedor>;

        // Calcular deuda total
        const deudaTotal = (prestamos.data || [])
            .filter((p) => p.estado !== 'COMPLETAMENTE_DEVUELTO')
            .reduce((sum, p) => {
                const devuelto = (p.devoluciones || []).reduce((s, d) => s + d.cantidad_devuelta, 0);
                const faltante = Math.max(0, p.cantidad - devuelto);
                return sum + faltante * (p.precio_unitario || 0);
            }, 0);

        return deudaTotal;
    }
}

const prestamoProveedorService = new PrestamoProveedorService();
export default prestamoProveedorService;
