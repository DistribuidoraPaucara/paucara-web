import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
export const obtenerVencimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerVencimientos.url(options),
    method: 'get',
})

obtenerVencimientos.definition = {
    methods: ["get","head"],
    url: '/api/calendario-vencimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
obtenerVencimientos.url = (options?: RouteQueryOptions) => {
    return obtenerVencimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
obtenerVencimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerVencimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
obtenerVencimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerVencimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
    const obtenerVencimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerVencimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
        obtenerVencimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerVencimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CalendarioVencimientosController::obtenerVencimientos
 * @see app/Http/Controllers/CalendarioVencimientosController.php:40
 * @route '/api/calendario-vencimientos'
 */
        obtenerVencimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerVencimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerVencimientos.form = obtenerVencimientosForm
/**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/calendario-vencimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CalendarioVencimientosController::dashboard
 * @see app/Http/Controllers/CalendarioVencimientosController.php:28
 * @route '/admin/calendario-vencimientos'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const CalendarioVencimientosController = { obtenerVencimientos, dashboard }

export default CalendarioVencimientosController