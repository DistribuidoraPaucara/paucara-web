import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimir
 * @see app/Http/Controllers/ReporteVentasController.php:1009
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/ventas/reporte-productos-vendidos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimir
 * @see app/Http/Controllers/ReporteVentasController.php:1009
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimir
 * @see app/Http/Controllers/ReporteVentasController.php:1009
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimir
 * @see app/Http/Controllers/ReporteVentasController.php:1009
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:708
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
export const imprimirDirecto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: imprimirDirecto.url(options),
    method: 'post',
})

imprimirDirecto.definition = {
    methods: ["post"],
    url: '/ventas/reporte-productos-vendidos/imprimir-directo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:708
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
imprimirDirecto.url = (options?: RouteQueryOptions) => {
    return imprimirDirecto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:708
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
imprimirDirecto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: imprimirDirecto.url(options),
    method: 'post',
})
const reporteProductosVendidos = {
    imprimirDirecto,
}

export default reporteProductosVendidos