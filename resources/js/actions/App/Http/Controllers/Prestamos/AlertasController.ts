import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
export const alertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})

alertas.definition = {
    methods: ["get","head"],
    url: '/prestamos/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.url = (options?: RouteQueryOptions) => {
    return alertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
    const alertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
        alertasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
        alertasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertas.form = alertasForm
const AlertasController = { alertas }

export default AlertasController