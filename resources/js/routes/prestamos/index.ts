import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import stock from './stock'
import ajustes from './ajustes'
import ventas from './ventas'
import compras from './compras'
import clientes from './clientes'
import proveedores from './proveedores'
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
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboard
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
export const prestables = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(options),
    method: 'get',
})

prestables.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.url = (options?: RouteQueryOptions) => {
    return prestables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prestables.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
    const prestablesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: prestables.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
        prestablesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestables.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
        prestablesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestables.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    prestables.form = prestablesForm
/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
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
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.url = (options?: RouteQueryOptions) => {
    return stock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stock.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
    const stockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
        stockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
        stockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stock.form = stockForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
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
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
    const reportesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
        reportesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
        reportesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportes.form = reportesForm
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
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
    const dashboardAltForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardAlt.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
        dashboardAltForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardAlt.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\DashboardController::dashboardAlt
 * @see app/Http/Controllers/Prestamos/DashboardController.php:19
 * @route '/prestamos/dashboard'
 */
        dashboardAltForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardAlt.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardAlt.form = dashboardAltForm
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

    /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
    const alertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
        alertasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\AlertasController::alertas
 * @see app/Http/Controllers/Prestamos/AlertasController.php:16
 * @route '/prestamos/alertas'
 */
        alertasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertas.form = alertasForm
const prestamos = {
    dashboard,
prestables,
stock,
ajustes,
ventas,
compras,
clientes,
proveedores,
reportes,
dashboardAlt,
alertas,
}

export default prestamos