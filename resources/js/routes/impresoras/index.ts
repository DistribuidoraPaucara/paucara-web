import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:953
 * @route '/api/ventas/impresoras/disponibles'
 */
export const disponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})

disponibles.definition = {
    methods: ["get","head"],
    url: '/api/ventas/impresoras/disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:953
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.url = (options?: RouteQueryOptions) => {
    return disponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:953
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:953
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disponibles.url(options),
    method: 'head',
})
const impresoras = {
    disponibles,
}

export default impresoras