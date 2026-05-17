// Data Layer: Reportes Prestamos service
import axios from 'axios';
import type { Id } from '@/domain/entities/shared';
import type {
    Prestable,
    PrestamoCliente,
    PrestamoProveedor,
    ReporteResumen,
} from '@/domain/entities/prestamos';

export class ReportesPrestamosService {
    constructor() {}

    // ========================================
    // Reportes generales
    // ========================================

    async getResumen(almacenId?: Id) {
        const { data } = await axios.get('/api/reportes/resumen-prestamos', {
            params: almacenId ? { almacen_id: almacenId } : {},
        });
        return data.data as ReporteResumen;
    }

    // ========================================
    // Stock
    // ========================================

    async getStock(almacenId?: Id) {
        const { data } = await axios.get('/api/reportes/stock-prestables', {
            params: almacenId ? { almacen_id: almacenId } : {},
        });
        return data.data as Array<{
            prestable: Prestable;
            cantidad_disponible: number;
            cantidad_en_prestamo: number;
            cantidad_vendida: number;
        }>;
    }

    async getStockBajo(almacenId?: Id) {
        const { data } = await axios.get('/api/reportes/stock-bajo-prestables', {
            params: almacenId ? { almacen_id: almacenId } : {},
        });
        return data.data as Prestable[];
    }

    // ========================================
    // Préstamos a clientes
    // ========================================

    async getPrestamosCliente() {
        const { data } = await axios.get('/api/reportes/prestamos/cliente');
        return data.data as PrestamoCliente[];
    }

    async getDevolucionesPendientes() {
        const { data } = await axios.get('/api/reportes/devoluciones-pendientes');
        return data.data as Array<
            PrestamoCliente & {
                dias_vencidos: number;
                cantidad_pendiente: number;
            }
        >;
    }

    // ========================================
    // Deudas con proveedores
    // ========================================

    async getDeudas() {
        const { data } = await axios.get('/api/reportes/deudas-proveedores');
        return data.data as Array<{
            proveedor: {
                id: Id;
                nombre: string;
            };
            total_deuda: number;
            prestamos_activos: number;
        }>;
    }
}

const reportesPrestamosService = new ReportesPrestamosService();
export default reportesPrestamosService;
