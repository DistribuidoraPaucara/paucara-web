import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/vendedor/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VendedorController::dashboard
 * @see app/Http/Controllers/VendedorController.php:24
 * @route '/vendedor/dashboard'
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
const VendedorController = { dashboard }

export default VendedorController