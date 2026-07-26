import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/stock/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/stock/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(options),
    method: 'head',
})
const ImpresionStockController = { imprimir, preview }

export default ImpresionStockController