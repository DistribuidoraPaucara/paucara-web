import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/ventas/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})
const ImpresionVentasController = { imprimir }

export default ImpresionVentasController