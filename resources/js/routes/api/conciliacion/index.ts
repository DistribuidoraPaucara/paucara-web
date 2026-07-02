import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ConciliacionCajaController::dia
 * @see app/Http/Controllers/ConciliacionCajaController.php:23
 * @route '/api/conciliacion/dia'
 */
export const dia = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dia.url(options),
    method: 'get',
})

dia.definition = {
    methods: ["get","head"],
    url: '/api/conciliacion/dia',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConciliacionCajaController::dia
 * @see app/Http/Controllers/ConciliacionCajaController.php:23
 * @route '/api/conciliacion/dia'
 */
dia.url = (options?: RouteQueryOptions) => {
    return dia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConciliacionCajaController::dia
 * @see app/Http/Controllers/ConciliacionCajaController.php:23
 * @route '/api/conciliacion/dia'
 */
dia.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dia.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConciliacionCajaController::dia
 * @see app/Http/Controllers/ConciliacionCajaController.php:23
 * @route '/api/conciliacion/dia'
 */
dia.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dia.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConciliacionCajaController::historial
 * @see app/Http/Controllers/ConciliacionCajaController.php:48
 * @route '/api/conciliacion/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/conciliacion/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConciliacionCajaController::historial
 * @see app/Http/Controllers/ConciliacionCajaController.php:48
 * @route '/api/conciliacion/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConciliacionCajaController::historial
 * @see app/Http/Controllers/ConciliacionCajaController.php:48
 * @route '/api/conciliacion/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConciliacionCajaController::historial
 * @see app/Http/Controllers/ConciliacionCajaController.php:48
 * @route '/api/conciliacion/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})
const conciliacion = {
    dia,
historial,
}

export default conciliacion