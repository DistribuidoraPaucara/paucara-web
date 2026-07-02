import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
export const imprimir = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimir.url = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { devolucion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { devolucion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    devolucion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return imprimir.definition.url
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimir.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimir.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})
const devolucion = {
    imprimir,
}

export default devolucion