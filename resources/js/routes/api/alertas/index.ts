import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

    /**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
    const cuentasVencidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cuentasVencidas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
        cuentasVencidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasVencidas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlertasController::cuentasVencidas
 * @see app/Http/Controllers/AlertasController.php:15
 * @route '/api/alertas/cuentas-vencidas'
 */
        cuentasVencidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasVencidas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cuentasVencidas.form = cuentasVencidasForm
const alertas = {
    cuentasVencidas,
}

export default alertas