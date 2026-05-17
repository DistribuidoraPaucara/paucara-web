import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/logistica/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
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
/**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
export const seguimiento = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimiento.url(args, options),
    method: 'get',
})

seguimiento.definition = {
    methods: ["get","head"],
    url: '/logistica/envios/{envio}/seguimiento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
seguimiento.url = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { envio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    envio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        envio: args.envio,
                }

    return seguimiento.definition.url
            .replace('{envio}', parsedArgs.envio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
seguimiento.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: seguimiento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
seguimiento.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: seguimiento.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
    const seguimientoForm = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: seguimiento.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
        seguimientoForm.get = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimiento.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\LogisticaController::seguimiento
 * @see app/Http/Controllers/Web/LogisticaController.php:336
 * @route '/logistica/envios/{envio}/seguimiento'
 */
        seguimientoForm.head = (args: { envio: string | number } | [envio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: seguimiento.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    seguimiento.form = seguimientoForm
const LogisticaController = { dashboard, seguimiento }

export default LogisticaController