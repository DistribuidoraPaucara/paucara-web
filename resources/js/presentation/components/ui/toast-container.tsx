import React from 'react';
import Toast, { ToastProps } from './toast';

interface ToastContainerProps {
    toasts: Array<Omit<ToastProps, 'onClose'>>;
    onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] space-y-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
