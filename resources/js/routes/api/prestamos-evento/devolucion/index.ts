import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
export const imprimir = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimir.url = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                                devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return imprimir.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimir.get = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimir.head = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
    const imprimirForm = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
        imprimirForm.get = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
        imprimirForm.head = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
const devolucion = {
    imprimir,
}

export default devolucion