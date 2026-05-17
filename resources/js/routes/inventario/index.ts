import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import movimientos from './movimientos'
import productosVendidos from './productos-vendidos'
import ajuste from './ajuste'
import ajusteTabla from './ajuste-tabla'
import ajusteMasivo from './ajuste-masivo'
import historialCargas from './historial-cargas'
import merma from './merma'
import tiposAjusteInventario from './tipos-ajuste-inventario'
import vehiculos from './vehiculos'
import transferencias from './transferencias'
import mermas from './mermas'
import inicial from './inicial'
import reservas from './reservas'
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
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
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/inventario/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
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
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
export const stockBajo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})

stockBajo.definition = {
    methods: ["get","head"],
    url: '/inventario/stock-bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.url = (options?: RouteQueryOptions) => {
    return stockBajo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockBajo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
    const stockBajoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockBajo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
        stockBajoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
        stockBajoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockBajo.form = stockBajoForm
/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
export const proximosVencer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})

proximosVencer.definition = {
    methods: ["get","head"],
    url: '/inventario/proximos-vencer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.url = (options?: RouteQueryOptions) => {
    return proximosVencer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proximosVencer.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
    const proximosVencerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proximosVencer.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
        proximosVencerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proximosVencer.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
        proximosVencerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proximosVencer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proximosVencer.form = proximosVencerForm
/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
export const vencidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})

vencidos.definition = {
    methods: ["get","head"],
    url: '/inventario/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.url = (options?: RouteQueryOptions) => {
    return vencidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vencidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
    const vencidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vencidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
        vencidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
        vencidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vencidos.form = vencidosForm
/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/inventario/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
    const movimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
        movimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
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
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/inventario/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
    const reportesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
        reportesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
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
const inventario = {
    reportes,
index,
dashboard,
stockBajo,
proximosVencer,
vencidos,
movimientos,
productosVendidos,
ajuste,
ajusteTabla,
ajusteMasivo,
historialCargas,
merma,
tiposAjusteInventario,
vehiculos,
transferencias,
mermas,
inicial,
reservas,
}

export default inventario