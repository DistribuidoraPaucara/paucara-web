import axios from 'axios';

/**
 * Configuración de Axios para funcionar con Inertia.js + Laravel Sanctum
 *
 * Permite autenticación tanto con sesiones (CSRF) como con tokens Bearer.
 * - Para sesiones (web): Se usa automáticamente con XSRF-TOKEN en cookies
 * - Para API (Sanctum): Se puede usar Bearer token en Authorization header
 */
export function configureAxios() {
    // Configurar axios para enviar cookies con cada solicitud
    // Necesario para que Laravel lea el XSRF token de las cookies
    axios.defaults.withCredentials = true;

    // Configurar el interceptor de solicitud
    axios.interceptors.request.use((config) => {
        // ✅ MEJORA: Normalizar URLs para evitar contenido mixto (Mixed Content)
        // Convierte http:// a rutas relativas si están en el mismo dominio
        if (config.url && config.url.startsWith('http://')) {
            try {
                const url = new URL(config.url);
                const currentUrl = new URL(window.location.href);

                // Si es el mismo dominio, convertir a URL relativa
                if (url.hostname === currentUrl.hostname) {
                    config.url = url.pathname + url.search + url.hash;
                    console.warn(`[Axios] URL normalizada: http:// → ${config.url}`);
                }
            } catch (e) {
                console.warn('[Axios] Error parseando URL:', config.url, e);
            }
        }

        // Obtener CSRF token de las cookies
        const csrfToken = getXsrfToken();
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        // Si hay un token Bearer almacenado, agregarlo también
        const bearerToken = sessionStorage.getItem('auth_token');
        if (bearerToken) {
            config.headers.Authorization = `Bearer ${bearerToken}`;
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Configurar el interceptor de respuesta para manejar errores 401
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Si la solicitud tiene el flag skipErrorHandler, no redirigir automáticamente
                // Esto permite al componente manejar el error manualmente
                const skipErrorHandler = error.config?.skipErrorHandler;

                if (!skipErrorHandler) {
                    // Si no autenticado, limpiar tokens y redirigir al login
                    sessionStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_token'); // También limpiar localStorage por compatibilidad
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        }
    );
}

/**
 * Obtiene el token XSRF de las cookies de Inertia.js
 * Laravel coloca el token en la cookie 'XSRF-TOKEN'
 */
function getXsrfToken(): string | null {
    const name = 'XSRF-TOKEN';

    // Buscar la cookie XSRF-TOKEN
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            const token = cookie.substring((name + '=').length);
            try {
                return decodeURIComponent(token);
            } catch (e) {
                return token;
            }
        }
    }

    // Si no encuentra la cookie, intentar obtenerla del meta tag (alternativa)
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    if (metaToken && metaToken.getAttribute('content')) {
        return metaToken.getAttribute('content');
    }

    return null;
}
