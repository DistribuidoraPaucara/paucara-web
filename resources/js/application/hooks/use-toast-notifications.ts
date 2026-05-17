import toast from 'react-hot-toast';
import type { UseEntregaNotificationsOptions } from './use-entrega-notifications';

/**
 * Hook que integra useEntregaNotifications con react-hot-toast
 * Convierte las notificaciones del hook en toast visuales
 */
export function useToastNotifications() {
    const showNotification = (data: {
        title: string;
        description: string;
        type?: 'info' | 'success' | 'warning' | 'error' | 'default';
        duration?: number;
    }) => {
        const message = `${data.title}\n${data.description}`;

        switch (data.type) {
            case 'success':
                toast.success(message, { duration: data.duration || 4000 });
                break;
            case 'error':
                toast.error(message, { duration: data.duration || 4000 });
                break;
            case 'warning':
                toast(message, {
                    icon: '⚠️',
                    duration: data.duration || 4000,
                    style: {
                        borderRadius: '8px',
                        background: '#fbbf24',
                        color: '#000',
                    },
                });
                break;
            case 'info':
            case 'default':
            default:
                toast(message, {
                    duration: data.duration || 4000,
                    style: {
                        borderRadius: '8px',
                        background: '#e5e7eb',
                        color: '#1f2937',
                    },
                });
                break;
        }
    };

    return { showNotification };
}
