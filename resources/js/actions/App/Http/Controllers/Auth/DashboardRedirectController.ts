import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
export const getRedirectApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRedirectApi.url(options),
    method: 'get',
})

getRedirectApi.definition = {
    methods: ["get","head"],
    url: '/api/dashboard-redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
getRedirectApi.url = (options?: RouteQueryOptions) => {
    return getRedirectApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
getRedirectApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRedirectApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
getRedirectApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRedirectApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
    const getRedirectApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRedirectApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
        getRedirectApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRedirectApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::getRedirectApi
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
        getRedirectApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRedirectApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRedirectApi.form = getRedirectApiForm
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/dashboard-redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::redirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:36
 * @route '/dashboard-redirect'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
const DashboardRedirectController = { getRedirectApi, redirect }

export default DashboardRedirectController