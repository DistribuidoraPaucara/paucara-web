/**
 * Frontend Routes Configuration
 *
 * Este archivo centraliza las rutas del frontend para fácil referencia y mantenimiento.
 * Utiliza rutas que corresponden con el backend (routes/web.php).
 */

export const routes = {
    // Dashboard
    dashboard: () => '/dashboard',

    // Prestamos
    prestamos: {
        dashboard: () => '/prestamos/dashboard',
        stock: () => '/prestamos/stock',
        alertas: () => '/prestamos/alertas',

        // Clientes
        clientes: {
            index: () => '/prestamos/clientes',
            create: () => '/prestamos/clientes/create',
            show: (id: number | string) => `/prestamos/clientes/${id}`,
            edit: (id: number | string) => `/prestamos/clientes/${id}/edit`,
        },

        // Proveedores
        proveedores: {
            index: () => '/prestamos/proveedores',
            create: () => '/prestamos/proveedores/create',
            show: (id: number | string) => `/prestamos/proveedores/${id}`,
            edit: (id: number | string) => `/prestamos/proveedores/${id}/edit`,
        },
    },
} as const;

/**
 * Helper para generar rutas dinámicas de la aplicación
 * Uso: route('prestamos.dashboard')
 */
export function route(name: string, params?: Record<string, any>): string {
    const parts = name.split('.');
    let current: any = routes;

    for (const part of parts) {
        if (typeof current[part] === 'function') {
            current = current[part](params);
            if (typeof current !== 'string') {
                return current();
            }
            return current;
        }
        current = current[part];
    }

    throw new Error(`Route "${name}" not found`);
}
