import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2486
 * @route '/api/clientes/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/clientes/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2486
 * @route '/api/clientes/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2486
 * @route '/api/clientes/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2486
 * @route '/api/clientes/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})
const clientes = {
    search,
}

export default clientes