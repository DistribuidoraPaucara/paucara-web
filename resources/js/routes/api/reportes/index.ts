import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:26
 * @route '/api/reportes/productos-vendidos'
 */
export const productosVendidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})

productosVendidos.definition = {
    methods: ["get","head"],
    url: '/api/reportes/productos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:26
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.url = (options?: RouteQueryOptions) => {
    return productosVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:26
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:26
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosVendidos.url(options),
    method: 'head',
})
const reportes = {
    productosVendidos,
}

export default reportes