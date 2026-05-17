import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

// ✅ Polyfill para Socket.IO - definir global en navegador
if (typeof (globalThis as any).global === 'undefined') {
    (globalThis as any).global = globalThis;
}

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { initializeTheme } from '@/presentation/hooks/use-appearance';
import { configureAxios } from '@/infrastructure/config/axios.config';
import { EstadosProvider } from '@/application/contexts/EstadosContext';

// Get appName from window props injected by Laravel, fallback to env, then 'Laravel'
const getAppName = (): string => {
    // First, try to get from window.__APP_NAME__ (will be set in the HTML template)
    if (typeof window !== 'undefined' && (window as any).__APP_NAME__) {
        return (window as any).__APP_NAME__;
    }
    // Fallback to environment variable
    return import.meta.env.VITE_APP_NAME || 'Laravel';
};

const appName = getAppName();

// Configurar axios con interceptadores para autenticación
configureAxios();

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./presentation/pages/${name}.tsx`, import.meta.glob('./presentation/pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <EstadosProvider>
                    <App {...props} />
                </EstadosProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
