import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:14
 * @route '/reservas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reservas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:14
 * @route '/reservas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:14
 * @route '/reservas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:14
 * @route '/reservas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const reservas = {
    index,
}

export default reservas