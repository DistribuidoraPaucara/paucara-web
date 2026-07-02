import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteController::impresionReportes
 * @see app/Http/Controllers/ReporteController.php:226
 * @route '/reportes/impresion'
 */
export const impresionReportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: impresionReportes.url(options),
    method: 'get',
})

impresionReportes.definition = {
    methods: ["get","head"],
    url: '/reportes/impresion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteController::impresionReportes
 * @see app/Http/Controllers/ReporteController.php:226
 * @route '/reportes/impresion'
 */
impresionReportes.url = (options?: RouteQueryOptions) => {
    return impresionReportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteController::impresionReportes
 * @see app/Http/Controllers/ReporteController.php:226
 * @route '/reportes/impresion'
 */
impresionReportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: impresionReportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteController::impresionReportes
 * @see app/Http/Controllers/ReporteController.php:226
 * @route '/reportes/impresion'
 */
impresionReportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: impresionReportes.url(options),
    method: 'head',
})

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
const ReporteController = { impresionReportes, ventasPorProducto }

export default ReporteController