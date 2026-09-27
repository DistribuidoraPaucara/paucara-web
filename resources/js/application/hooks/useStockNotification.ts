import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useWebSocketContext } from '@/application/contexts/WebSocketContext';

interface StockNotification {
    titulo: string;
    compra_numero: string;
    proveedor: {
        id: number;
        nombre: string;
    };
    productos: Array<{
        producto_id: number;
        producto_nombre: string;
        sku: string;
        cantidad_llegada?: number;  // Solo si no es cliente
        lote?: string;
        fecha_vencimiento?: string;
    }>;
    cantidad_productos: number;
    cantidad_total_items?: number;  // Solo si no es cliente
    show_quantities?: boolean;       // Flag para clientes
    fecha_ingreso: string;
}

/**
 * Hook para escuchar notificaciones de nuevo stock disponible
 *
 * Comportamiento:
 * - Usuarios internos: ven cantidades, lotes, vencimientos
 * - Clientes: solo ven "hay nuevo stock" sin detalles
 */
export function useStockNotification() {
    const { on, off } = useWebSocketContext();

    useEffect(() => {
        const handleStockDisponible = (data: StockNotification) => {
            console.log('📦 [useStockNotification] Evento recibido:', data);

            // Mensaje simplificado: solo nombre, SKU y cantidad
            const productosSimple = data.productos
                .map(p => `${p.producto_nombre} (SKU: ${p.sku}) - ${p.cantidad_llegada || '?'} unidades`)
                .join('\n');

            toast.success(
                `📦 Nuevo Stock\n${productosSimple}`,
                {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            console.log('✅ Notificación de stock mostrada (simplificada)');
        };

        // Escuchar el evento
        on('stock.disponible', handleStockDisponible);

        console.log('🎧 [useStockNotification] Listener agregado para stock.disponible');

        // Cleanup
        return () => {
            off('stock.disponible', handleStockDisponible);
            console.log('🎧 [useStockNotification] Listener removido');
        };
    }, [on, off]);
}
