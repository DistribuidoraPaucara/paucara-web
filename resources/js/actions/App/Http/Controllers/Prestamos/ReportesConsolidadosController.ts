import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
export const stockDetallado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockDetallado.url(options),
    method: 'get',
})

stockDetallado.definition = {
    methods: ["get","head"],
    url: '/api/reportes/prestables/stock-detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
stockDetallado.url = (options?: RouteQueryOptions) => {
    return stockDetallado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
stockDetallado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockDetallado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
stockDetallado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockDetallado.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
export const stockPorAlmacen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockPorAlmacen.url(options),
    method: 'get',
})

stockPorAlmacen.definition = {
    methods: ["get","head"],
    url: '/api/reportes/prestables/stock-por-almacen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
stockPorAlmacen.url = (options?: RouteQueryOptions) => {
    return stockPorAlmacen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
stockPorAlmacen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockPorAlmacen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
stockPorAlmacen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockPorAlmacen.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
export const deudaProveedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deudaProveedores.url(options),
    method: 'get',
})

deudaProveedores.definition = {
    methods: ["get","head"],
    url: '/api/reportes/prestables/deuda-proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
deudaProveedores.url = (options?: RouteQueryOptions) => {
    return deudaProveedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
deudaProveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deudaProveedores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
deudaProveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: deudaProveedores.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
export const resumenGeneral = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGeneral.url(options),
    method: 'get',
})

resumenGeneral.definition = {
    methods: ["get","head"],
    url: '/api/reportes/prestables/resumen-general',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
resumenGeneral.url = (options?: RouteQueryOptions) => {
    return resumenGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
resumenGeneral.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGeneral.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
resumenGeneral.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumenGeneral.url(options),
    method: 'head',
})
const ReportesConsolidadosController = { stockDetallado, stockPorAlmacen, deudaProveedores, resumenGeneral }

export default ReportesConsolidadosController