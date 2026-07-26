import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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
const vendedor = {
    dashboard,
}

export default vendedor