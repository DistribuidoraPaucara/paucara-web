import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
export const preciosStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preciosStock.url(options),
    method: 'get',
})

preciosStock.definition = {
    methods: ["get","head"],
    url: '/public/precios-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosStock.url = (options?: RouteQueryOptions) => {
    return preciosStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preciosStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
preciosStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preciosStock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
    const preciosStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preciosStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
        preciosStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preciosStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicStockController::preciosStock
 * @see app/Http/Controllers/PublicStockController.php:107
 * @route '/public/precios-stock'
 */
        preciosStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preciosStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preciosStock.form = preciosStockForm
const publicMethod = {
    precios,
preciosStock,
}

export default publicMethod