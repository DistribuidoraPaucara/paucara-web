import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
const reporteStockec402e57b4db65007c852c173c196923 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStockec402e57b4db65007c852c173c196923.url(options),
    method: 'get',
})

reporteStockec402e57b4db65007c852c173c196923.definition = {
    methods: ["get","head"],
    url: '/api/reportes/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
reporteStockec402e57b4db65007c852c173c196923.url = (options?: RouteQueryOptions) => {
    return reporteStockec402e57b4db65007c852c173c196923.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
reporteStockec402e57b4db65007c852c173c196923.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStockec402e57b4db65007c852c173c196923.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
reporteStockec402e57b4db65007c852c173c196923.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteStockec402e57b4db65007c852c173c196923.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
    const reporteStockec402e57b4db65007c852c173c196923Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteStockec402e57b4db65007c852c173c196923.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
        reporteStockec402e57b4db65007c852c173c196923Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStockec402e57b4db65007c852c173c196923.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock'
 */
        reporteStockec402e57b4db65007c852c173c196923Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStockec402e57b4db65007c852c173c196923.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteStockec402e57b4db65007c852c173c196923.form = reporteStockec402e57b4db65007c852c173c196923Form
    /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
const reporteStock822a6e12475770bbd39c7de11afb2a2d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStock822a6e12475770bbd39c7de11afb2a2d.url(options),
    method: 'get',
})

reporteStock822a6e12475770bbd39c7de11afb2a2d.definition = {
    methods: ["get","head"],
    url: '/api/reportes/stock-prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
reporteStock822a6e12475770bbd39c7de11afb2a2d.url = (options?: RouteQueryOptions) => {
    return reporteStock822a6e12475770bbd39c7de11afb2a2d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
reporteStock822a6e12475770bbd39c7de11afb2a2d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStock822a6e12475770bbd39c7de11afb2a2d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
reporteStock822a6e12475770bbd39c7de11afb2a2d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteStock822a6e12475770bbd39c7de11afb2a2d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
    const reporteStock822a6e12475770bbd39c7de11afb2a2dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteStock822a6e12475770bbd39c7de11afb2a2d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
        reporteStock822a6e12475770bbd39c7de11afb2a2dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStock822a6e12475770bbd39c7de11afb2a2d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteStock
 * @see app/Http/Controllers/ReportesController.php:38
 * @route '/api/reportes/stock-prestables'
 */
        reporteStock822a6e12475770bbd39c7de11afb2a2dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStock822a6e12475770bbd39c7de11afb2a2d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteStock822a6e12475770bbd39c7de11afb2a2d.form = reporteStock822a6e12475770bbd39c7de11afb2a2dForm

export const reporteStock = {
    '/api/reportes/stock': reporteStockec402e57b4db65007c852c173c196923,
    '/api/reportes/stock-prestables': reporteStock822a6e12475770bbd39c7de11afb2a2d,
}

/**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
export const reporteStockBajo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStockBajo.url(options),
    method: 'get',
})

reporteStockBajo.definition = {
    methods: ["get","head"],
    url: '/api/reportes/stock/bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
reporteStockBajo.url = (options?: RouteQueryOptions) => {
    return reporteStockBajo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
reporteStockBajo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteStockBajo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
reporteStockBajo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteStockBajo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
    const reporteStockBajoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteStockBajo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
        reporteStockBajoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStockBajo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteStockBajo
 * @see app/Http/Controllers/ReportesController.php:80
 * @route '/api/reportes/stock/bajo'
 */
        reporteStockBajoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteStockBajo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteStockBajo.form = reporteStockBajoForm
/**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
export const stockBajoPrestables = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajoPrestables.url(options),
    method: 'get',
})

stockBajoPrestables.definition = {
    methods: ["get","head"],
    url: '/api/reportes/stock-bajo-prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
stockBajoPrestables.url = (options?: RouteQueryOptions) => {
    return stockBajoPrestables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
stockBajoPrestables.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajoPrestables.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
stockBajoPrestables.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockBajoPrestables.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
    const stockBajoPrestablesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockBajoPrestables.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
        stockBajoPrestablesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajoPrestables.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::stockBajoPrestables
 * @see app/Http/Controllers/ReportesController.php:120
 * @route '/api/reportes/stock-bajo-prestables'
 */
        stockBajoPrestablesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajoPrestables.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockBajoPrestables.form = stockBajoPrestablesForm
/**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
export const reportePrestamosCliente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportePrestamosCliente.url(options),
    method: 'get',
})

reportePrestamosCliente.definition = {
    methods: ["get","head"],
    url: '/api/reportes/prestamos/cliente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
reportePrestamosCliente.url = (options?: RouteQueryOptions) => {
    return reportePrestamosCliente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
reportePrestamosCliente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportePrestamosCliente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
reportePrestamosCliente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportePrestamosCliente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
    const reportePrestamosClienteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportePrestamosCliente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
        reportePrestamosClienteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportePrestamosCliente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reportePrestamosCliente
 * @see app/Http/Controllers/ReportesController.php:152
 * @route '/api/reportes/prestamos/cliente'
 */
        reportePrestamosClienteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportePrestamosCliente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportePrestamosCliente.form = reportePrestamosClienteForm
/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
const reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url(options),
    method: 'get',
})

reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.definition = {
    methods: ["get","head"],
    url: '/api/reportes/devoluciones/pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url = (options?: RouteQueryOptions) => {
    return reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
    const reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11beForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
        reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11beForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones/pendientes'
 */
        reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11beForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be.form = reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11beForm
    /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
const reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url(options),
    method: 'get',
})

reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.definition = {
    methods: ["get","head"],
    url: '/api/reportes/devoluciones-pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url = (options?: RouteQueryOptions) => {
    return reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
    const reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
        reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteDevolucionesPendientes
 * @see app/Http/Controllers/ReportesController.php:194
 * @route '/api/reportes/devoluciones-pendientes'
 */
        reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36.form = reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36Form

export const reporteDevolucionesPendientes = {
    '/api/reportes/devoluciones/pendientes': reporteDevolucionesPendientesfeb7f32901fe4a52c74067a42ebe11be,
    '/api/reportes/devoluciones-pendientes': reporteDevolucionesPendientesc1c2b4a5a9b90be0fa689d5266485a36,
}

/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
const reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url(options),
    method: 'get',
})

reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.definition = {
    methods: ["get","head"],
    url: '/api/reportes/proveedor/deudas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url = (options?: RouteQueryOptions) => {
    return reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
    const reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
        reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/proveedor/deudas'
 */
        reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472.form = reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472Form
    /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
const reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url(options),
    method: 'get',
})

reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.definition = {
    methods: ["get","head"],
    url: '/api/reportes/deudas-proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url = (options?: RouteQueryOptions) => {
    return reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
    const reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
        reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteDeudas
 * @see app/Http/Controllers/ReportesController.php:241
 * @route '/api/reportes/deudas-proveedores'
 */
        reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066.form = reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066Form

export const reporteDeudas = {
    '/api/reportes/proveedor/deudas': reporteDeudas9fb4d9b4133b4bf6d3a741ef8389d472,
    '/api/reportes/deudas-proveedores': reporteDeudas27cb8cc9cf8c94a75cde6f0f5bfaf066,
}

/**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
export const reporteResumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteResumen.url(options),
    method: 'get',
})

reporteResumen.definition = {
    methods: ["get","head"],
    url: '/api/reportes/resumen-prestamos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
reporteResumen.url = (options?: RouteQueryOptions) => {
    return reporteResumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
reporteResumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteResumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
reporteResumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteResumen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
    const reporteResumenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteResumen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
        reporteResumenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteResumen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportesController::reporteResumen
 * @see app/Http/Controllers/ReportesController.php:285
 * @route '/api/reportes/resumen-prestamos'
 */
        reporteResumenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteResumen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteResumen.form = reporteResumenForm
const ReportesController = { reporteStock, reporteStockBajo, stockBajoPrestables, reportePrestamosCliente, reporteDevolucionesPendientes, reporteDeudas, reporteResumen }

export default ReportesController