import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
import test from './test'
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
        testForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
        testForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    test.form = testForm
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.url = (options?: RouteQueryOptions) => {
    return debug.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
    const debugForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: debug.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
        debugForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
        debugForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    debug.form = debugForm
const imagen = {
    test,
debug,
}

export default imagen