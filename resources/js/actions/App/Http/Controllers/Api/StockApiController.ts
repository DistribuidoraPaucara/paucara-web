import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresion
 * @see app/Http/Controllers/Api/StockApiController.php:19
 * @route '/api/stock/preparar-impresion'
 */
export const prepararImpresion = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresion.url(options),
    method: 'post',
})

prepararImpresion.definition = {
    methods: ["post"],
    url: '/api/stock/preparar-impresion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresion
 * @see app/Http/Controllers/Api/StockApiController.php:19
 * @route '/api/stock/preparar-impresion'
 */
prepararImpresion.url = (options?: RouteQueryOptions) => {
    return prepararImpresion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresion
 * @see app/Http/Controllers/Api/StockApiController.php:19
 * @route '/api/stock/preparar-impresion'
 */
prepararImpresion.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresion.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresion
 * @see app/Http/Controllers/Api/StockApiController.php:19
 * @route '/api/stock/preparar-impresion'
 */
    const prepararImpresionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresion.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresion
 * @see app/Http/Controllers/Api/StockApiController.php:19
 * @route '/api/stock/preparar-impresion'
 */
        prepararImpresionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresion.url(options),
            method: 'post',
        })
    
    prepararImpresion.form = prepararImpresionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionMovimientos
 * @see app/Http/Controllers/Api/StockApiController.php:55
 * @route '/api/stock/preparar-impresion-movimientos'
 */
export const prepararImpresionMovimientos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionMovimientos.url(options),
    method: 'post',
})

prepararImpresionMovimientos.definition = {
    methods: ["post"],
    url: '/api/stock/preparar-impresion-movimientos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionMovimientos
 * @see app/Http/Controllers/Api/StockApiController.php:55
 * @route '/api/stock/preparar-impresion-movimientos'
 */
prepararImpresionMovimientos.url = (options?: RouteQueryOptions) => {
    return prepararImpresionMovimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionMovimientos
 * @see app/Http/Controllers/Api/StockApiController.php:55
 * @route '/api/stock/preparar-impresion-movimientos'
 */
prepararImpresionMovimientos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionMovimientos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionMovimientos
 * @see app/Http/Controllers/Api/StockApiController.php:55
 * @route '/api/stock/preparar-impresion-movimientos'
 */
    const prepararImpresionMovimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresionMovimientos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionMovimientos
 * @see app/Http/Controllers/Api/StockApiController.php:55
 * @route '/api/stock/preparar-impresion-movimientos'
 */
        prepararImpresionMovimientosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresionMovimientos.url(options),
            method: 'post',
        })
    
    prepararImpresionMovimientos.form = prepararImpresionMovimientosForm
/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionVentas
 * @see app/Http/Controllers/Api/StockApiController.php:178
 * @route '/api/stock/preparar-impresion-ventas'
 */
export const prepararImpresionVentas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionVentas.url(options),
    method: 'post',
})

prepararImpresionVentas.definition = {
    methods: ["post"],
    url: '/api/stock/preparar-impresion-ventas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionVentas
 * @see app/Http/Controllers/Api/StockApiController.php:178
 * @route '/api/stock/preparar-impresion-ventas'
 */
prepararImpresionVentas.url = (options?: RouteQueryOptions) => {
    return prepararImpresionVentas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionVentas
 * @see app/Http/Controllers/Api/StockApiController.php:178
 * @route '/api/stock/preparar-impresion-ventas'
 */
prepararImpresionVentas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionVentas.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionVentas
 * @see app/Http/Controllers/Api/StockApiController.php:178
 * @route '/api/stock/preparar-impresion-ventas'
 */
    const prepararImpresionVentasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresionVentas.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionVentas
 * @see app/Http/Controllers/Api/StockApiController.php:178
 * @route '/api/stock/preparar-impresion-ventas'
 */
        prepararImpresionVentasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresionVentas.url(options),
            method: 'post',
        })
    
    prepararImpresionVentas.form = prepararImpresionVentasForm
/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionCompras
 * @see app/Http/Controllers/Api/StockApiController.php:305
 * @route '/api/stock/preparar-impresion-compras'
 */
export const prepararImpresionCompras = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionCompras.url(options),
    method: 'post',
})

prepararImpresionCompras.definition = {
    methods: ["post"],
    url: '/api/stock/preparar-impresion-compras',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionCompras
 * @see app/Http/Controllers/Api/StockApiController.php:305
 * @route '/api/stock/preparar-impresion-compras'
 */
prepararImpresionCompras.url = (options?: RouteQueryOptions) => {
    return prepararImpresionCompras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionCompras
 * @see app/Http/Controllers/Api/StockApiController.php:305
 * @route '/api/stock/preparar-impresion-compras'
 */
prepararImpresionCompras.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionCompras.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionCompras
 * @see app/Http/Controllers/Api/StockApiController.php:305
 * @route '/api/stock/preparar-impresion-compras'
 */
    const prepararImpresionComprasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresionCompras.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionCompras
 * @see app/Http/Controllers/Api/StockApiController.php:305
 * @route '/api/stock/preparar-impresion-compras'
 */
        prepararImpresionComprasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresionCompras.url(options),
            method: 'post',
        })
    
    prepararImpresionCompras.form = prepararImpresionComprasForm
/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionProductosVendidos
 * @see app/Http/Controllers/Api/StockApiController.php:339
 * @route '/api/stock/preparar-impresion-productos-vendidos'
 */
export const prepararImpresionProductosVendidos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionProductosVendidos.url(options),
    method: 'post',
})

prepararImpresionProductosVendidos.definition = {
    methods: ["post"],
    url: '/api/stock/preparar-impresion-productos-vendidos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionProductosVendidos
 * @see app/Http/Controllers/Api/StockApiController.php:339
 * @route '/api/stock/preparar-impresion-productos-vendidos'
 */
prepararImpresionProductosVendidos.url = (options?: RouteQueryOptions) => {
    return prepararImpresionProductosVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionProductosVendidos
 * @see app/Http/Controllers/Api/StockApiController.php:339
 * @route '/api/stock/preparar-impresion-productos-vendidos'
 */
prepararImpresionProductosVendidos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionProductosVendidos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionProductosVendidos
 * @see app/Http/Controllers/Api/StockApiController.php:339
 * @route '/api/stock/preparar-impresion-productos-vendidos'
 */
    const prepararImpresionProductosVendidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresionProductosVendidos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::prepararImpresionProductosVendidos
 * @see app/Http/Controllers/Api/StockApiController.php:339
 * @route '/api/stock/preparar-impresion-productos-vendidos'
 */
        prepararImpresionProductosVendidosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresionProductosVendidos.url(options),
            method: 'post',
        })
    
    prepararImpresionProductosVendidos.form = prepararImpresionProductosVendidosForm
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
export const imprimirVentasDesdeSession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirVentasDesdeSession.url(options),
    method: 'get',
})

imprimirVentasDesdeSession.definition = {
    methods: ["get","head"],
    url: '/api/stock/imprimir-ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
imprimirVentasDesdeSession.url = (options?: RouteQueryOptions) => {
    return imprimirVentasDesdeSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
imprimirVentasDesdeSession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirVentasDesdeSession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
imprimirVentasDesdeSession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirVentasDesdeSession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
    const imprimirVentasDesdeSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirVentasDesdeSession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
        imprimirVentasDesdeSessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirVentasDesdeSession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirVentasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:495
 * @route '/api/stock/imprimir-ventas'
 */
        imprimirVentasDesdeSessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirVentasDesdeSession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirVentasDesdeSession.form = imprimirVentasDesdeSessionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
export const imprimirMovimientosDesdeSession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimientosDesdeSession.url(options),
    method: 'get',
})

imprimirMovimientosDesdeSession.definition = {
    methods: ["get","head"],
    url: '/api/stock/imprimir-movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
imprimirMovimientosDesdeSession.url = (options?: RouteQueryOptions) => {
    return imprimirMovimientosDesdeSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
imprimirMovimientosDesdeSession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimientosDesdeSession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
imprimirMovimientosDesdeSession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirMovimientosDesdeSession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
    const imprimirMovimientosDesdeSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirMovimientosDesdeSession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
        imprimirMovimientosDesdeSessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirMovimientosDesdeSession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirMovimientosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:523
 * @route '/api/stock/imprimir-movimientos'
 */
        imprimirMovimientosDesdeSessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirMovimientosDesdeSession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirMovimientosDesdeSession.form = imprimirMovimientosDesdeSessionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
export const imprimirStockDesdeSession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirStockDesdeSession.url(options),
    method: 'get',
})

imprimirStockDesdeSession.definition = {
    methods: ["get","head"],
    url: '/api/stock/imprimir-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
imprimirStockDesdeSession.url = (options?: RouteQueryOptions) => {
    return imprimirStockDesdeSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
imprimirStockDesdeSession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirStockDesdeSession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
imprimirStockDesdeSession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirStockDesdeSession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
    const imprimirStockDesdeSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirStockDesdeSession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
        imprimirStockDesdeSessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirStockDesdeSession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirStockDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:551
 * @route '/api/stock/imprimir-stock'
 */
        imprimirStockDesdeSessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirStockDesdeSession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirStockDesdeSession.form = imprimirStockDesdeSessionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
export const imprimirComprasDesdeSession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirComprasDesdeSession.url(options),
    method: 'get',
})

imprimirComprasDesdeSession.definition = {
    methods: ["get","head"],
    url: '/api/stock/imprimir-compras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
imprimirComprasDesdeSession.url = (options?: RouteQueryOptions) => {
    return imprimirComprasDesdeSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
imprimirComprasDesdeSession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirComprasDesdeSession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
imprimirComprasDesdeSession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirComprasDesdeSession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
    const imprimirComprasDesdeSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirComprasDesdeSession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
        imprimirComprasDesdeSessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirComprasDesdeSession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirComprasDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:581
 * @route '/api/stock/imprimir-compras'
 */
        imprimirComprasDesdeSessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirComprasDesdeSession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirComprasDesdeSession.form = imprimirComprasDesdeSessionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
export const imprimirProductosVendidosDesdeSession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirProductosVendidosDesdeSession.url(options),
    method: 'get',
})

imprimirProductosVendidosDesdeSession.definition = {
    methods: ["get","head"],
    url: '/api/stock/imprimir-productos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
imprimirProductosVendidosDesdeSession.url = (options?: RouteQueryOptions) => {
    return imprimirProductosVendidosDesdeSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
imprimirProductosVendidosDesdeSession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirProductosVendidosDesdeSession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
imprimirProductosVendidosDesdeSession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirProductosVendidosDesdeSession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
    const imprimirProductosVendidosDesdeSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirProductosVendidosDesdeSession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
        imprimirProductosVendidosDesdeSessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirProductosVendidosDesdeSession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockApiController::imprimirProductosVendidosDesdeSession
 * @see app/Http/Controllers/Api/StockApiController.php:610
 * @route '/api/stock/imprimir-productos-vendidos'
 */
        imprimirProductosVendidosDesdeSessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirProductosVendidosDesdeSession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirProductosVendidosDesdeSession.form = imprimirProductosVendidosDesdeSessionForm
/**
* @see \App\Http\Controllers\Api\StockApiController::destroy
 * @see app/Http/Controllers/Api/StockApiController.php:452
 * @route '/api/stock/productos/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/stock/productos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\StockApiController::destroy
 * @see app/Http/Controllers/Api/StockApiController.php:452
 * @route '/api/stock/productos/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockApiController::destroy
 * @see app/Http/Controllers/Api/StockApiController.php:452
 * @route '/api/stock/productos/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\StockApiController::destroy
 * @see app/Http/Controllers/Api/StockApiController.php:452
 * @route '/api/stock/productos/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StockApiController::destroy
 * @see app/Http/Controllers/Api/StockApiController.php:452
 * @route '/api/stock/productos/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StockApiController = { prepararImpresion, prepararImpresionMovimientos, prepararImpresionVentas, prepararImpresionCompras, prepararImpresionProductosVendidos, imprimirVentasDesdeSession, imprimirMovimientosDesdeSession, imprimirStockDesdeSession, imprimirComprasDesdeSession, imprimirProductosVendidosDesdeSession, destroy }

export default StockApiController