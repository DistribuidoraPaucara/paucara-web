import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/cajas/auditoria/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})
const auditoria = {
    estadisticas,
}

export default auditoria