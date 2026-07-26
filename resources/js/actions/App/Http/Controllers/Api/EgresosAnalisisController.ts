import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos-analisis'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/egresos-analisis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos-analisis'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos-analisis'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos-analisis'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const EgresosAnalisisController = { index }

export default EgresosAnalisisController