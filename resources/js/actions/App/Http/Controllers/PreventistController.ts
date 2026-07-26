import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PreventistController::dashboard
 * @see app/Http/Controllers/PreventistController.php:14
 * @route '/preventista/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/preventista/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PreventistController::dashboard
 * @see app/Http/Controllers/PreventistController.php:14
 * @route '/preventista/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PreventistController::dashboard
 * @see app/Http/Controllers/PreventistController.php:14
 * @route '/preventista/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PreventistController::dashboard
 * @see app/Http/Controllers/PreventistController.php:14
 * @route '/preventista/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const PreventistController = { dashboard }

export default PreventistController