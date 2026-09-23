import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:32
 * @route '/admin/dashboard'
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
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
export const alertasStockCompleto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStockCompleto.url(options),
    method: 'get',
})

alertasStockCompleto.definition = {
    methods: ["get","head"],
    url: '/admin/alertas-stock-completo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
alertasStockCompleto.url = (options?: RouteQueryOptions) => {
    return alertasStockCompleto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
alertasStockCompleto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStockCompleto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
alertasStockCompleto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertasStockCompleto.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
    const alertasStockCompletoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertasStockCompleto.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
        alertasStockCompletoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStockCompleto.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::alertasStockCompleto
 * @see app/Http/Controllers/AdminController.php:25
 * @route '/admin/alertas-stock-completo'
 */
        alertasStockCompletoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStockCompleto.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertasStockCompleto.form = alertasStockCompletoForm
const AdminController = { dashboard, alertasStockCompleto }

export default AdminController