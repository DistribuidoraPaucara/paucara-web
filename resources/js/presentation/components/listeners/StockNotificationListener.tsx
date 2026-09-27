import { useEffect } from 'react';
import { useStockNotification } from '@/application/hooks/useStockNotification';

/**
 * Componente que escucha notificaciones de nuevo stock
 *
 * Este componente debe ser renderizado en un lugar siempre visible
 * como en el layout principal (AppLayout) para que funcione globalmente
 *
 * Uso:
 * <StockNotificationListener />
 */
export function StockNotificationListener() {
    // El hook se encarga de escuchar el evento y mostrar notificaciones
    useStockNotification();

    // El componente no renderiza nada, solo maneja listeners
    return null;
}
