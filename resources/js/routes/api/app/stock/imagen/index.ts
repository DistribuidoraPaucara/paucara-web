import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
import test from './test'
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

test.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
export const debug = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})

debug.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/debug',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.url = (options?: RouteQueryOptions) => {
    return debug.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(options),
    method: 'head',
})
const imagen = {
    test,
debug,
}

export default imagen