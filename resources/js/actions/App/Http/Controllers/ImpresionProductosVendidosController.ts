import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionProductosVendidosController::imprimir
 * @see app/Http/Controllers/ImpresionProductosVendidosController.php:18
 * @route '/inventario/productos-vendidos/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/inventario/productos-vendidos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionProductosVendidosController::imprimir
 * @see app/Http/Controllers/ImpresionProductosVendidosController.php:18
 * @route '/inventario/productos-vendidos/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionProductosVendidosController::imprimir
 * @see app/Http/Controllers/ImpresionProductosVendidosController.php:18
 * @route '/inventario/productos-vendidos/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionProductosVendidosController::imprimir
 * @see app/Http/Controllers/ImpresionProductosVendidosController.php:18
 * @route '/inventario/productos-vendidos/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})
const ImpresionProductosVendidosController = { imprimir }

export default ImpresionProductosVendidosController