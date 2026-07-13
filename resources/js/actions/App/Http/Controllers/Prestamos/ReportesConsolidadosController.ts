import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
    const stockDetalladoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockDetallado.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
        stockDetalladoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockDetallado.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockDetallado
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:26
 * @route '/api/reportes/prestables/stock-detalle'
 */
        stockDetalladoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockDetallado.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockDetallado.form = stockDetalladoForm
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
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
    const stockPorAlmacenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockPorAlmacen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
        stockPorAlmacenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockPorAlmacen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::stockPorAlmacen
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:63
 * @route '/api/reportes/prestables/stock-por-almacen'
 */
        stockPorAlmacenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockPorAlmacen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockPorAlmacen.form = stockPorAlmacenForm
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
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
    const deudaProveedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: deudaProveedores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
        deudaProveedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: deudaProveedores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::deudaProveedores
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:179
 * @route '/api/reportes/prestables/deuda-proveedores'
 */
        deudaProveedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: deudaProveedores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    deudaProveedores.form = deudaProveedoresForm
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

    /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
    const resumenGeneralForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumenGeneral.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
        resumenGeneralForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumenGeneral.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\ReportesConsolidadosController::resumenGeneral
 * @see app/Http/Controllers/Prestamos/ReportesConsolidadosController.php:256
 * @route '/api/reportes/prestables/resumen-general'
 */
        resumenGeneralForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumenGeneral.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumenGeneral.form = resumenGeneralForm
const ReportesConsolidadosController = { stockDetallado, stockPorAlmacen, deudaProveedores, resumenGeneral }

export default ReportesConsolidadosController