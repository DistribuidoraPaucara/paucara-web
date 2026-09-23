import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
export const stockActual = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockActual.url(options),
    method: 'get',
})

stockActual.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/stock-actual',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
stockActual.url = (options?: RouteQueryOptions) => {
    return stockActual.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
stockActual.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockActual.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
stockActual.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockActual.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
    const stockActualForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockActual.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
        stockActualForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockActual.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::stockActual
 * @see app/Http/Controllers/ReporteInventarioController.php:19
 * @route '/reportes/inventario/stock-actual'
 */
        stockActualForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockActual.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockActual.form = stockActualForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::buscarStock
 * @see app/Http/Controllers/ReporteInventarioController.php:579
 * @route '/reportes/inventario/buscar-stock'
 */
export const buscarStock = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarStock.url(options),
    method: 'post',
})

buscarStock.definition = {
    methods: ["post"],
    url: '/reportes/inventario/buscar-stock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::buscarStock
 * @see app/Http/Controllers/ReporteInventarioController.php:579
 * @route '/reportes/inventario/buscar-stock'
 */
buscarStock.url = (options?: RouteQueryOptions) => {
    return buscarStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::buscarStock
 * @see app/Http/Controllers/ReporteInventarioController.php:579
 * @route '/reportes/inventario/buscar-stock'
 */
buscarStock.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buscarStock.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::buscarStock
 * @see app/Http/Controllers/ReporteInventarioController.php:579
 * @route '/reportes/inventario/buscar-stock'
 */
    const buscarStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buscarStock.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::buscarStock
 * @see app/Http/Controllers/ReporteInventarioController.php:579
 * @route '/reportes/inventario/buscar-stock'
 */
        buscarStockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buscarStock.url(options),
            method: 'post',
        })
    
    buscarStock.form = buscarStockForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
export const vencimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencimientos.url(options),
    method: 'get',
})

vencimientos.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/vencimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
vencimientos.url = (options?: RouteQueryOptions) => {
    return vencimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
vencimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
vencimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vencimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
    const vencimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vencimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
        vencimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::vencimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:98
 * @route '/reportes/inventario/vencimientos'
 */
        vencimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vencimientos.form = vencimientosForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
export const rotacion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rotacion.url(options),
    method: 'get',
})

rotacion.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/rotacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
rotacion.url = (options?: RouteQueryOptions) => {
    return rotacion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
rotacion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rotacion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
rotacion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rotacion.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
    const rotacionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rotacion.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
        rotacionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rotacion.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::rotacion
 * @see app/Http/Controllers/ReporteInventarioController.php:151
 * @route '/reportes/inventario/rotacion'
 */
        rotacionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rotacion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rotacion.form = rotacionForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
    const movimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
        movimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::movimientos
 * @see app/Http/Controllers/ReporteInventarioController.php:217
 * @route '/reportes/inventario/movimientos'
 */
        movimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientos.form = movimientosForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::exportMethod
 * @see app/Http/Controllers/ReporteInventarioController.php:334
 * @route '/reportes/inventario/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/reportes/inventario/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteInventarioController::exportPdf
 * @see app/Http/Controllers/ReporteInventarioController.php:285
 * @route '/reportes/inventario/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
const inventario = {
    stockActual,
buscarStock,
vencimientos,
rotacion,
movimientos,
export: exportMethod,
exportPdf,
}

export default inventario