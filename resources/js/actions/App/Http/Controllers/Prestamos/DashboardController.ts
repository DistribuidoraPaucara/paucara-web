import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
const dashboardfadbc2aa319f076997015b579fafe5d9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardfadbc2aa319f076997015b579fafe5d9.url(options),
    method: 'get',
})

dashboardfadbc2aa319f076997015b579fafe5d9.definition = {
    methods: ["get","head"],
    url: '/prestamos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboardfadbc2aa319f076997015b579fafe5d9.url = (options?: RouteQueryOptions) => {
    return dashboardfadbc2aa319f076997015b579fafe5d9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboardfadbc2aa319f076997015b579fafe5d9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardfadbc2aa319f076997015b579fafe5d9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboardfadbc2aa319f076997015b579fafe5d9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardfadbc2aa319f076997015b579fafe5d9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
const dashboard65aaebb08fda63be8b9a0ee6ac9446a9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard65aaebb08fda63be8b9a0ee6ac9446a9.url(options),
    method: 'get',
})

dashboard65aaebb08fda63be8b9a0ee6ac9446a9.definition = {
    methods: ["get","head"],
    url: '/prestamos/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboard65aaebb08fda63be8b9a0ee6ac9446a9.url = (options?: RouteQueryOptions) => {
    return dashboard65aaebb08fda63be8b9a0ee6ac9446a9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboard65aaebb08fda63be8b9a0ee6ac9446a9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard65aaebb08fda63be8b9a0ee6ac9446a9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboard65aaebb08fda63be8b9a0ee6ac9446a9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard65aaebb08fda63be8b9a0ee6ac9446a9.url(options),
    method: 'head',
})

export const dashboard = {
    '/prestamos': dashboardfadbc2aa319f076997015b579fafe5d9,
    '/prestamos/dashboard': dashboard65aaebb08fda63be8b9a0ee6ac9446a9,
}

const DashboardController = { dashboard }

export default DashboardController