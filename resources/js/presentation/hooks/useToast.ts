import { useState, useCallback } from 'react';

export interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 4000) => {
        const id = Date.now().toString();
        const newToast: ToastItem = { id, message, type, duration };
        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message: string, duration?: number) => {
        return addToast(message, 'error', duration || 5000);
    }, [addToast]);

    const warning = useCallback((message: string, duration?: number) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const info = useCallback((message: string, duration?: number) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};
