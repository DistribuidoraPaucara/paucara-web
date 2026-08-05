import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
export const pendientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendientes.url(options),
    method: 'get',
})

pendientes.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
pendientes.url = (options?: RouteQueryOptions) => {
    return pendientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
pendientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
pendientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendientes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
    const pendientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
        pendientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::pendientes
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:193
 * @route '/api/notificaciones/pendientes'
 */
        pendientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendientes.form = pendientesForm
const notificaciones = {
    pendientes,
}

export default notificaciones