import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
export const local = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: local.url(options),
    method: 'get',
})

local.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/test-local',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
local.url = (options?: RouteQueryOptions) => {
    return local.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
local.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: local.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
local.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: local.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
    const localForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: local.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
        localForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: local.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::local
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
        localForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: local.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    local.form = localForm
const test = {
    local,
}

export default test