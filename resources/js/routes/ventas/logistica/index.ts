import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
export const show = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/logistica',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return show.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const logistica = {
    show,
}

export default logistica