import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
export const precios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: precios.url(options),
    method: 'get',
})

precios.definition = {
    methods: ["get","head"],
    url: '/public/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
precios.url = (options?: RouteQueryOptions) => {
    return precios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
precios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: precios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
precios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: precios.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
export const preciosConStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preciosConStock.url(options),
    method: 'get',
})

preciosConStock.definition = {
    methods: ["get","head"],
    url: '/public/precios-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosConStock.url = (options?: RouteQueryOptions) => {
    return preciosConStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosConStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preciosConStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosConStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preciosConStock.url(options),
    method: 'head',
})
const PublicStockController = { precios, preciosConStock }

export default PublicStockController