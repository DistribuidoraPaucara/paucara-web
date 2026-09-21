import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
export const imprimir = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimir.url = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                }

    return imprimir.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimir.get = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimir.head = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
    const imprimirForm = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
        imprimirForm.get = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
        imprimirForm.head = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
const devoluciones = {
    imprimir,
}

export default devoluciones