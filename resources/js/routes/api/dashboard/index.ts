import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:85
 * @route '/api/dashboard/metricas'
 */
export const metricas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})

metricas.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/metricas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:85
 * @route '/api/dashboard/metricas'
 */
metricas.url = (options?: RouteQueryOptions) => {
    return metricas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:85
 * @route '/api/dashboard/metricas'
 */
metricas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:85
 * @route '/api/dashboard/metricas'
 */
metricas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:98
 * @route '/api/dashboard/graficos'
 */
export const graficos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})

graficos.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/graficos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:98
 * @route '/api/dashboard/graficos'
 */
graficos.url = (options?: RouteQueryOptions) => {
    return graficos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:98
 * @route '/api/dashboard/graficos'
 */
graficos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:98
 * @route '/api/dashboard/graficos'
 */
graficos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: graficos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:117
 * @route '/api/dashboard/productos-mas-vendidos'
 */
export const productosMasVendidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasVendidos.url(options),
    method: 'get',
})

productosMasVendidos.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/productos-mas-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:117
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.url = (options?: RouteQueryOptions) => {
    return productosMasVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:117
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:117
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosMasVendidos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:131
 * @route '/api/dashboard/alertas-stock'
 */
export const alertasStock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStock.url(options),
    method: 'get',
})

alertasStock.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/alertas-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:131
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.url = (options?: RouteQueryOptions) => {
    return alertasStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:131
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:131
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertasStock.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:142
 * @route '/api/dashboard/ventas-por-canal'
 */
export const ventasPorCanal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasPorCanal.url(options),
    method: 'get',
})

ventasPorCanal.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/ventas-por-canal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:142
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.url = (options?: RouteQueryOptions) => {
    return ventasPorCanal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:142
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasPorCanal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:142
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasPorCanal.url(options),
    method: 'head',
})
const dashboard = {
    metricas,
graficos,
productosMasVendidos,
alertasStock,
ventasPorCanal,
}

export default dashboard