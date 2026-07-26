import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
export const management = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})

management.definition = {
    methods: ["get","head"],
    url: '/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.url = (options?: RouteQueryOptions) => {
    return management.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: management.url(options),
    method: 'head',
})
const precios = {
    management,
}

export default precios