'use client';

import { useEffect } from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { WebSocketProvider, useWebSocketContext } from '@/application/contexts/WebSocketContext';
import { useAuth } from '@/application/hooks/use-auth';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * Componente interno que usa el WebSocketContext
 * Debe estar dentro del WebSocketProvider
 */
function AppLayoutContent({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { user } = useAuth();
    const { isConnected, error } = useWebSocketContext();

    // Logging de estado de conexión
    useEffect(() => {
        if (error && user) {
            console.error(`❌ Error de conexión WebSocket: ${error}`);
        }
    }, [isConnected, error, user]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            {/* React Hot Toast Container */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: 'red',
                        },
                    },
                }}
            />
        </AppLayoutTemplate>
    );
}

/**
 * Layout principal que envuelve la aplicación con WebSocketProvider
 * Esto asegura una única conexión WebSocket global
 */
export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <WebSocketProvider autoConnect={true}>
            <AppLayoutContent breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutContent>
        </WebSocketProvider>
    );
}
