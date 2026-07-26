import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
export const cuentasVencidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasVencidas.url(options),
    method: 'get',
})

cuentasVencidas.definition = {
    methods: ["get","head"],
    url: '/api/alertas/cuentas-vencidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
cuentasVencidas.url = (options?: RouteQueryOptions) => {
    return cuentasVencidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
cuentasVencidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasVencidas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
cuentasVencidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cuentasVencidas.url(options),
    method: 'head',
})
const alertas = {
    cuentasVencidas,
}

export default alertas