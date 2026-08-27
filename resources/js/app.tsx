import '../css/app.css';
import '../css/react-colorful.css';
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
import { NotificationsProvider } from '@/application/contexts/notifications-context';
import { WebSocketProvider } from '@/application/contexts/WebSocketContext';

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

// ✅ NUEVO: Obtener token CSRF de Sanctum antes de hacer peticiones
// Esto configura la cookie XSRF-TOKEN que axios usa en todas las peticiones
const initializeCsrfToken = async () => {
    try {
        await fetch('/sanctum/csrf-cookie', {
            credentials: 'include',
            method: 'GET',
        });
        // console.log('✅ CSRF token inicializado desde /sanctum/csrf-cookie');
    } catch (error) {
        console.error('⚠️ Error inicializando CSRF token:', error);
    }
};

// Inicializar CSRF token antes de crear la app
initializeCsrfToken();

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./presentation/pages/${name}.tsx`, import.meta.glob('./presentation/pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // ✅ IMPORTANTE: Las props de la página están en props.initialPage.props, no en props
        const pageProps = (props.initialPage?.props as any) || {};
        const authData = pageProps.auth || {};

        console.log('📋 [app.tsx] Inertia Config:', props);
        console.log('📋 [app.tsx] Page Props:', pageProps);
        console.log('🔐 [app.tsx] Auth Data:', authData);

        // ✅ Obtener datos del usuario de las props de Inertia
        const userId = authData.user?.id || undefined;
        const userRoles = authData.roles || [];

        // ✅ NUEVO: Si no hay usuario pero hay token guardado, LIMPIAR (logout detectado)
        if (!userId && typeof window !== 'undefined') {
            const oldToken = sessionStorage.getItem('auth_token');
            if (oldToken) {
                sessionStorage.removeItem('auth_token');
                console.log('✅ [app.tsx] Token limpiado: Logout detectado (no hay usuario)');
            }
        }

        // ✅ NUEVO: Intentar obtener token SINCRONAMENTE
        // 1. Primero desde props de Inertia
        let sanctumToken = authData.sanctumToken;
        console.log('🔐 [app.tsx] Token desde props:', sanctumToken ? 'SI' : 'NO');

        // 2. Si no está en props, buscar en sessionStorage
        if (!sanctumToken && typeof window !== 'undefined') {
            sanctumToken = sessionStorage.getItem('auth_token');
            if (sanctumToken) {
                console.log('🔐 [app.tsx] Token desde sessionStorage: SI');
            }
        }

        // 3. Si aún no hay token pero el usuario está autenticado, obtenerlo del endpoint SINCRONAMENTE
        if (!sanctumToken && userId && typeof window !== 'undefined') {
            console.log('🔐 [app.tsx] Intentando obtener token del endpoint (sincronamente)...');

            // Hacer petición SINCRÓNA usando XMLHttpRequest o esperar con async
            // Para que funcione, necesitamos crear una Promesa que resuelva antes de renderizar
            // Pero setup() no es async, así que haremos una petición "pseudo-sincróna"
            // usando XMLHttpRequest con async=false (deprecated pero funciona)
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/api/auth/sanctum-token', false); // false = sincróno
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.withCredentials = true; // Incluir cookies
                xhr.send();

                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success && data.token) {
                        sanctumToken = data.token;
                        sessionStorage.setItem('auth_token', sanctumToken);
                        console.log('✅ [app.tsx] Token obtenido del endpoint (sincronamente)');
                    }
                } else {
                    console.warn('⚠️ [app.tsx] Error en endpoint:', xhr.status);
                }
            } catch (err) {
                console.error('❌ [app.tsx] Error obteniendo token:', err);
            }
        }

        // 4. Guardar token en sessionStorage
        if (sanctumToken && typeof window !== 'undefined') {
            sessionStorage.setItem('auth_token', sanctumToken);
        }

        console.log('🔐 [app.tsx] Valores finales:');
        console.log(`   userId: ${userId}`);
        console.log(`   userRoles: ${userRoles.join(', ')}`);
        console.log(`   sanctumToken: ${sanctumToken ? sanctumToken.substring(0, 20) + '...' : 'undefined'}`);

        // ✅ Configurar canales a suscribirse según roles
        const channels = [];

        // Siempre suscribirse al canal personal
        if (userId) {
            channels.push(`user_${userId}`);
        }

        // Suscribirse a canales según roles
        if (userRoles.includes('admin') || userRoles.includes('Admin')) {
            channels.push('admin.proformas');
            channels.push('admin.entregas');
            // ✅ NUEVO: Suscribirse a canal de rol para notificaciones multi-canal
            channels.push('admins');
        }
        if (userRoles.includes('manager') || userRoles.includes('Manager')) {
            channels.push('admin.proformas'); // Managers ven proformas también
            // ✅ NUEVO: Managers también reciben notificaciones como admins
            channels.push('admins');
        }
        if (userRoles.includes('cajero') || userRoles.includes('Cajero')) {
            channels.push('admin.proformas'); // Cajeros ven proformas también
            // ✅ NUEVO: Cajeros también reciben notificaciones como admins
            channels.push('admins');
        }
        if (userRoles.includes('preventista') || userRoles.includes('Preventista')) {
            channels.push('preventista.proformas');
            // ✅ NUEVO: Suscribirse a canal de rol para notificaciones multi-canal
            channels.push('preventistas');
        }
        // ✅ NUEVO: Suscribirse a canal de choferes
        if (userRoles.includes('chofer') || userRoles.includes('Chofer') || userRoles.includes('driver') || userRoles.includes('Driver')) {
            channels.push('choferes');
        }

        root.render(
            <>
                <WebSocketProvider
                    autoConnect={true}
                    sanctumToken={sanctumToken}
                    userId={userId}
                    channels={channels}
                >
                    <EstadosProvider>
                        <NotificationsProvider userId={userId} userRoles={userRoles}>
                            <App {...props} />
                        </NotificationsProvider>
                    </EstadosProvider>
                </WebSocketProvider>
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
