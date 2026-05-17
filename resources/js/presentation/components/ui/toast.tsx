import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 4000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const styles = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/30',
            border: 'border-green-200 dark:border-green-800',
            icon: '✅',
            textColor: 'text-green-800 dark:text-green-200',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/30',
            border: 'border-red-200 dark:border-red-800',
            icon: '❌',
            textColor: 'text-red-800 dark:text-red-200',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/30',
            border: 'border-yellow-200 dark:border-yellow-800',
            icon: '⚠️',
            textColor: 'text-yellow-800 dark:text-yellow-200',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            border: 'border-blue-200 dark:border-blue-800',
            icon: 'ℹ️',
            textColor: 'text-blue-800 dark:text-blue-200',
        },
    };

    const style = styles[type];

    return (
        <div
            className={`${style.bg} ${style.border} ${style.textColor} border px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 min-h-12`}
            role="alert"
        >
            <span className="text-lg flex-shrink-0 mt-0.5">{style.icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium whitespace-pre-wrap break-words">{message}</p>
            </div>
            <button
                onClick={() => onClose(id)}
                className={`${style.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
