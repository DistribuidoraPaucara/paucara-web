/**
 * Servicio centralizado para la gestión del token CSRF
 * Evita duplicación de código en múltiples lugares de la aplicación
 */

/**
 * Obtiene el token CSRF del meta tag en el HTML
 * @returns El token CSRF o string vacío si no existe
 */
export function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

/**
 * Retorna los headers necesarios para peticiones fetch() que incluyen CSRF
 * @returns Objeto con headers configurados
 */
export function getCsrfHeaders(): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
    };
}
