import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
    const preciosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: precios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
        preciosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: precios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicStockController::precios
 * @see app/Http/Controllers/PublicStockController.php:23
 * @route '/public/precios'
 */
        preciosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: precios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    precios.form = preciosForm
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

    /**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
    const preciosConStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preciosConStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
        preciosConStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preciosConStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicStockController::preciosConStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
        preciosConStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preciosConStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preciosConStock.form = preciosConStockForm
const PublicStockController = { precios, preciosConStock }

export default PublicStockController