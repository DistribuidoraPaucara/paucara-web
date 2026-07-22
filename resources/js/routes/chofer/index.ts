import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ChoferController::dashboard
 * @see app/Http/Controllers/ChoferController.php:18
 * @route '/chofer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/chofer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChoferController::dashboard
 * @see app/Http/Controllers/ChoferController.php:18
 * @route '/chofer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChoferController::dashboard
 * @see app/Http/Controllers/ChoferController.php:18
 * @route '/chofer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChoferController::dashboard
 * @see app/Http/Controllers/ChoferController.php:18
 * @route '/chofer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const chofer = {
    dashboard,
}

export default chofer