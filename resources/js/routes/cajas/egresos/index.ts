import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EgresosAnalisisController::index
 * @see app/Http/Controllers/EgresosAnalisisController.php:18
 * @route '/cajas/egresos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas/egresos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosAnalisisController::index
 * @see app/Http/Controllers/EgresosAnalisisController.php:18
 * @route '/cajas/egresos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosAnalisisController::index
 * @see app/Http/Controllers/EgresosAnalisisController.php:18
 * @route '/cajas/egresos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosAnalisisController::index
 * @see app/Http/Controllers/EgresosAnalisisController.php:18
 * @route '/cajas/egresos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const egresos = {
    index,
}

export default egresos