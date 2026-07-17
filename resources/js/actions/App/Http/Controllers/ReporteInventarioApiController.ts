import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::estadisticasGenerales
 * @see app/Http/Controllers/ReporteInventarioApiController.php:42
 * @route '/api/inventario/reportes/estadisticas'
 */
export const estadisticasGenerales = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasGenerales.url(options),
    method: 'get',
})

estadisticasGenerales.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::estadisticasGenerales
 * @see app/Http/Controllers/ReporteInventarioApiController.php:42
 * @route '/api/inventario/reportes/estadisticas'
 */
estadisticasGenerales.url = (options?: RouteQueryOptions) => {
    return estadisticasGenerales.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::estadisticasGenerales
 * @see app/Http/Controllers/ReporteInventarioApiController.php:42
 * @route '/api/inventario/reportes/estadisticas'
 */
estadisticasGenerales.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasGenerales.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::estadisticasGenerales
 * @see app/Http/Controllers/ReporteInventarioApiController.php:42
 * @route '/api/inventario/reportes/estadisticas'
 */
estadisticasGenerales.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasGenerales.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::stockBajo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:70
 * @route '/api/inventario/reportes/stock-bajo'
 */
export const stockBajo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})

stockBajo.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/stock-bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::stockBajo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:70
 * @route '/api/inventario/reportes/stock-bajo'
 */
stockBajo.url = (options?: RouteQueryOptions) => {
    return stockBajo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::stockBajo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:70
 * @route '/api/inventario/reportes/stock-bajo'
 */
stockBajo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::stockBajo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:70
 * @route '/api/inventario/reportes/stock-bajo'
 */
stockBajo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockBajo.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::proximosVencer
 * @see app/Http/Controllers/ReporteInventarioApiController.php:99
 * @route '/api/inventario/reportes/proximos-vencer'
 */
export const proximosVencer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})

proximosVencer.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/proximos-vencer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::proximosVencer
 * @see app/Http/Controllers/ReporteInventarioApiController.php:99
 * @route '/api/inventario/reportes/proximos-vencer'
 */
proximosVencer.url = (options?: RouteQueryOptions) => {
    return proximosVencer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::proximosVencer
 * @see app/Http/Controllers/ReporteInventarioApiController.php:99
 * @route '/api/inventario/reportes/proximos-vencer'
 */
proximosVencer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::proximosVencer
 * @see app/Http/Controllers/ReporteInventarioApiController.php:99
 * @route '/api/inventario/reportes/proximos-vencer'
 */
proximosVencer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proximosVencer.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::vencidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:128
 * @route '/api/inventario/reportes/vencidos'
 */
export const vencidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})

vencidos.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::vencidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:128
 * @route '/api/inventario/reportes/vencidos'
 */
vencidos.url = (options?: RouteQueryOptions) => {
    return vencidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::vencidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:128
 * @route '/api/inventario/reportes/vencidos'
 */
vencidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::vencidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:128
 * @route '/api/inventario/reportes/vencidos'
 */
vencidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vencidos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::movimientosPorPeriodo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:157
 * @route '/api/inventario/reportes/movimientos-periodo'
 */
export const movimientosPorPeriodo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosPorPeriodo.url(options),
    method: 'get',
})

movimientosPorPeriodo.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/movimientos-periodo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::movimientosPorPeriodo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:157
 * @route '/api/inventario/reportes/movimientos-periodo'
 */
movimientosPorPeriodo.url = (options?: RouteQueryOptions) => {
    return movimientosPorPeriodo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::movimientosPorPeriodo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:157
 * @route '/api/inventario/reportes/movimientos-periodo'
 */
movimientosPorPeriodo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosPorPeriodo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::movimientosPorPeriodo
 * @see app/Http/Controllers/ReporteInventarioApiController.php:157
 * @route '/api/inventario/reportes/movimientos-periodo'
 */
movimientosPorPeriodo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosPorPeriodo.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::productosMasMovidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:204
 * @route '/api/inventario/reportes/productos-mas-movidos'
 */
export const productosMasMovidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasMovidos.url(options),
    method: 'get',
})

productosMasMovidos.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/productos-mas-movidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::productosMasMovidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:204
 * @route '/api/inventario/reportes/productos-mas-movidos'
 */
productosMasMovidos.url = (options?: RouteQueryOptions) => {
    return productosMasMovidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::productosMasMovidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:204
 * @route '/api/inventario/reportes/productos-mas-movidos'
 */
productosMasMovidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasMovidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::productosMasMovidos
 * @see app/Http/Controllers/ReporteInventarioApiController.php:204
 * @route '/api/inventario/reportes/productos-mas-movidos'
 */
productosMasMovidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosMasMovidos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::valorizacionInventario
 * @see app/Http/Controllers/ReporteInventarioApiController.php:241
 * @route '/api/inventario/reportes/valorizacion'
 */
export const valorizacionInventario = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: valorizacionInventario.url(options),
    method: 'get',
})

valorizacionInventario.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/valorizacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::valorizacionInventario
 * @see app/Http/Controllers/ReporteInventarioApiController.php:241
 * @route '/api/inventario/reportes/valorizacion'
 */
valorizacionInventario.url = (options?: RouteQueryOptions) => {
    return valorizacionInventario.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::valorizacionInventario
 * @see app/Http/Controllers/ReporteInventarioApiController.php:241
 * @route '/api/inventario/reportes/valorizacion'
 */
valorizacionInventario.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: valorizacionInventario.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::valorizacionInventario
 * @see app/Http/Controllers/ReporteInventarioApiController.php:241
 * @route '/api/inventario/reportes/valorizacion'
 */
valorizacionInventario.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: valorizacionInventario.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})

generar.definition = {
    methods: ["get","head"],
    url: '/api/inventario/reportes/generar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioApiController::generar
 * @see app/Http/Controllers/ReporteInventarioApiController.php:292
 * @route '/api/inventario/reportes/generar'
 */
generar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generar.url(options),
    method: 'head',
})
const ReporteInventarioApiController = { estadisticasGenerales, stockBajo, proximosVencer, vencidos, movimientosPorPeriodo, productosMasMovidos, valorizacionInventario, generar }

export default ReporteInventarioApiController