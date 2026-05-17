import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:21
 * @route '/dashboard'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
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
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
metricas.url = (options?: RouteQueryOptions) => {
    return metricas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
metricas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metricas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
metricas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metricas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
    const metricasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: metricas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
        metricasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::metricas
 * @see app/Http/Controllers/DashboardController.php:75
 * @route '/api/dashboard/metricas'
 */
        metricasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: metricas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    metricas.form = metricasForm
/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
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
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
graficos.url = (options?: RouteQueryOptions) => {
    return graficos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
graficos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
graficos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: graficos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
    const graficosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: graficos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
        graficosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: graficos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::graficos
 * @see app/Http/Controllers/DashboardController.php:88
 * @route '/api/dashboard/graficos'
 */
        graficosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: graficos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    graficos.form = graficosForm
/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
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
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.url = (options?: RouteQueryOptions) => {
    return productosMasVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosMasVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
productosMasVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosMasVendidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
    const productosMasVendidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosMasVendidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
        productosMasVendidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosMasVendidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::productosMasVendidos
 * @see app/Http/Controllers/DashboardController.php:107
 * @route '/api/dashboard/productos-mas-vendidos'
 */
        productosMasVendidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosMasVendidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosMasVendidos.form = productosMasVendidosForm
/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
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
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.url = (options?: RouteQueryOptions) => {
    return alertasStock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertasStock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
alertasStock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertasStock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
    const alertasStockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertasStock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
        alertasStockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::alertasStock
 * @see app/Http/Controllers/DashboardController.php:121
 * @route '/api/dashboard/alertas-stock'
 */
        alertasStockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertasStock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertasStock.form = alertasStockForm
/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
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
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.url = (options?: RouteQueryOptions) => {
    return ventasPorCanal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasPorCanal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
ventasPorCanal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasPorCanal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
    const ventasPorCanalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ventasPorCanal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
        ventasPorCanalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ventasPorCanal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::ventasPorCanal
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/api/dashboard/ventas-por-canal'
 */
        ventasPorCanalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ventasPorCanal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ventasPorCanal.form = ventasPorCanalForm
const DashboardController = { index, metricas, graficos, productosMasVendidos, alertasStock, ventasPorCanal }

export default DashboardController