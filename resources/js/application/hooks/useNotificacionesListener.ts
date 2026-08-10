import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

interface NotificacionRecibida {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    total_enviadas: number;
    vistas: number;
    timestamp: string;
}

export function useNotificacionesListener(
    onNotificacion?: (data: NotificacionRecibida) => void
) {
    const handleNotificacion = useCallback((data: NotificacionRecibida) => {
        // Log
        console.log('📢 Notificación recurrente recibida:', data);

        // Toast visual
        const iconos: Record<string, string> = {
            promocion: '🎁',
            evento: '🎉',
            oferta: '🏷️',
            informativo: 'ℹ️',
        };
        const icono = iconos[data.tipo] || '📢';

        toast.info(
            <div>
                <div className="font-bold">{icono} {data.titulo}</div>
                <div className="text-sm text-gray-600">{data.descripcion}</div>
                <div className="text-xs text-gray-500 mt-2">
                    Enviada a {data.total_enviadas} usuarios
                </div>
            </div>,
            {
                position: 'top-right',
                autoClose: 5000,
            }
        );

        // Callback personalizado
        if (onNotificacion) {
            onNotificacion(data);
        }
    }, [onNotificacion]);

    useEffect(() => {
        // Verificar si Echo/Pusher está disponible
        if (typeof window !== 'undefined' && (window as any).Echo) {
            const echo = (window as any).Echo;

            // Suscribirse al canal público
            const channel = echo.channel('notificaciones-recurrentes');

            // Escuchar el evento de notificación
            channel.listen('notificacion-recurrente:emitida', handleNotificacion);

            // Cleanup
            return () => {
                channel.stopListening('notificacion-recurrente:emitida');
            };
        }
    }, [handleNotificacion]);
}

/**
 * Hook alternativo para monitorear notificaciones globalmente
 * Útil para actualizar badges, contadores, etc en layouts
 */
export function useNotificacionesMonitor() {
    const [ultimaNotificacion, setUltimaNotificacion] =
        React.useState<NotificacionRecibida | null>(null);
    const [contador, setContador] = React.useState(0);

    const handleNotificacion = useCallback((data: NotificacionRecibida) => {
        setUltimaNotificacion(data);
        setContador((c) => c + 1);

        // Resetear contador después de 3 segundos
        setTimeout(() => setContador(0), 3000);
    }, []);

    useNotificacionesListener(handleNotificacion);

    return {
        ultimaNotificacion,
        contador,
    };
}
