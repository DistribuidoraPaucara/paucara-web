import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/compras/con-prestables/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2193
 * @route '/api/compras/con-prestables/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const conPrestables = {
    search,
}

export default conPrestables