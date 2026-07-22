import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\LocalidadController::active
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
export const active = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: active.url(options),
    method: 'get',
})

active.definition = {
    methods: ["get","head"],
    url: '/localidades/api/active',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::active
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
active.url = (options?: RouteQueryOptions) => {
    return active.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::active
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
active.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: active.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::active
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
active.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: active.url(options),
    method: 'head',
})
const api = {
    active,
}

export default api