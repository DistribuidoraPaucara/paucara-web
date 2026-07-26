import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AsientoContableController::libroMayor
 * @see app/Http/Controllers/AsientoContableController.php:103
 * @route '/contabilidad/reportes/libro-mayor'
 */
export const libroMayor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: libroMayor.url(options),
    method: 'get',
})

libroMayor.definition = {
    methods: ["get","head"],
    url: '/contabilidad/reportes/libro-mayor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::libroMayor
 * @see app/Http/Controllers/AsientoContableController.php:103
 * @route '/contabilidad/reportes/libro-mayor'
 */
libroMayor.url = (options?: RouteQueryOptions) => {
    return libroMayor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::libroMayor
 * @see app/Http/Controllers/AsientoContableController.php:103
 * @route '/contabilidad/reportes/libro-mayor'
 */
libroMayor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: libroMayor.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::libroMayor
 * @see app/Http/Controllers/AsientoContableController.php:103
 * @route '/contabilidad/reportes/libro-mayor'
 */
libroMayor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: libroMayor.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AsientoContableController::balanceComprobacion
 * @see app/Http/Controllers/AsientoContableController.php:169
 * @route '/contabilidad/reportes/balance-comprobacion'
 */
export const balanceComprobacion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balanceComprobacion.url(options),
    method: 'get',
})

balanceComprobacion.definition = {
    methods: ["get","head"],
    url: '/contabilidad/reportes/balance-comprobacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::balanceComprobacion
 * @see app/Http/Controllers/AsientoContableController.php:169
 * @route '/contabilidad/reportes/balance-comprobacion'
 */
balanceComprobacion.url = (options?: RouteQueryOptions) => {
    return balanceComprobacion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::balanceComprobacion
 * @see app/Http/Controllers/AsientoContableController.php:169
 * @route '/contabilidad/reportes/balance-comprobacion'
 */
balanceComprobacion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balanceComprobacion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::balanceComprobacion
 * @see app/Http/Controllers/AsientoContableController.php:169
 * @route '/contabilidad/reportes/balance-comprobacion'
 */
balanceComprobacion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: balanceComprobacion.url(options),
    method: 'head',
})
const reportes = {
    libroMayor,
balanceComprobacion,
}

export default reportes