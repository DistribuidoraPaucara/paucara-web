import { usePrestamoNotification } from '@/application/hooks/usePrestamoNotification';

/**
 * Componente que escucha notificaciones de préstamos
 *
 * Este componente debe ser renderizado en un lugar siempre visible
 * como en el layout principal (AppLayout) para que funcione globalmente
 *
 * Eventos que escucha:
 * - prestamo.cliente.anulado: Cuando se anula un préstamo a cliente
 *
 * Uso:
 * <PrestamoNotificationListener />
 */
export function PrestamoNotificationListener() {
    // El hook se encarga de escuchar el evento y mostrar notificaciones
    usePrestamoNotification();

    // El componente no renderiza nada, solo maneja listeners
    return null;
}
