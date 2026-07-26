import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import prestables from './prestables'
import stock from './stock'
import ajustes from './ajustes'
import ventas from './ventas'
import compras from './compras'
import clientes from './clientes'
import proveedores from './proveedores'
import eventos from './eventos'
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/prestamos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:17
 * @route '/prestamos/stock'
 */
export const stock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(options),
    method: 'get',
})

stock.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:17
 * @route '/prestamos/stock'
 */
stock.url = (options?: RouteQueryOptions) => {
    return stock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:17
 * @route '/prestamos/stock'
 */
stock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:17
 * @route '/prestamos/stock'
 */
stock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stock.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:392
 * @route '/prestamos/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/prestamos/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:392
 * @route '/prestamos/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:392
 * @route '/prestamos/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:392
 * @route '/prestamos/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
export const dashboardAlt = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardAlt.url(options),
    method: 'get',
})

dashboardAlt.definition = {
    methods: ["get","head"],
    url: '/prestamos/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboardAlt.url = (options?: RouteQueryOptions) => {
    return dashboardAlt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboardAlt.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardAlt.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
dashboardAlt.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardAlt.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
export const alertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})

alertas.definition = {
    methods: ["get","head"],
    url: '/prestamos/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.url = (options?: RouteQueryOptions) => {
    return alertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
alertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertas.url(options),
    method: 'head',
})
const prestamos = {
    dashboard,
prestables,
stock,
ajustes,
ventas,
compras,
clientes,
proveedores,
eventos,
reportes,
dashboardAlt,
alertas,
}

export default prestamos