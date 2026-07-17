import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})

generar.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/generar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generar.url(options),
    method: 'head',
})