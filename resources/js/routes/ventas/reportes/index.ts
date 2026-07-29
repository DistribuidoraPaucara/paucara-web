import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
export const ventasPorProducto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasPorProducto.url(options),
    method: 'get',
})

ventasPorProducto.definition = {
    methods: ["get","head"],
    url: '/ventas/reportes/ventas-por-producto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
ventasPorProducto.url = (options?: RouteQueryOptions) => {
    return ventasPorProducto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
ventasPorProducto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasPorProducto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
ventasPorProducto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasPorProducto.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
    const ventasPorProductoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ventasPorProducto.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
        ventasPorProductoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ventasPorProducto.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteController::ventasPorProducto
 * @see app/Http/Controllers/ReporteController.php:19
 * @route '/ventas/reportes/ventas-por-producto'
 */
        ventasPorProductoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ventasPorProducto.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ventasPorProducto.form = ventasPorProductoForm
const reportes = {
    ventasPorProducto,
}

export default reportes