import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
export const rankingClientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rankingClientes.url(options),
    method: 'get',
})

rankingClientes.definition = {
    methods: ["get","head"],
    url: '/reportes/ventas/ranking-clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
rankingClientes.url = (options?: RouteQueryOptions) => {
    return rankingClientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
rankingClientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rankingClientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
rankingClientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rankingClientes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
    const rankingClientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rankingClientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
        rankingClientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rankingClientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::rankingClientes
 * @see app/Http/Controllers/ReporteVentasController.php:336
 * @route '/reportes/ventas/ranking-clientes'
 */
        rankingClientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rankingClientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rankingClientes.form = rankingClientesForm
/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
export const entregasPorChofer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasPorChofer.url(options),
    method: 'get',
})

entregasPorChofer.definition = {
    methods: ["get","head"],
    url: '/reportes/ventas/entregas-por-chofer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
entregasPorChofer.url = (options?: RouteQueryOptions) => {
    return entregasPorChofer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
entregasPorChofer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasPorChofer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
entregasPorChofer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasPorChofer.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
    const entregasPorChoferForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregasPorChofer.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
        entregasPorChoferForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasPorChofer.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorChofer
 * @see app/Http/Controllers/ReporteVentasController.php:559
 * @route '/reportes/ventas/entregas-por-chofer'
 */
        entregasPorChoferForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasPorChofer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregasPorChofer.form = entregasPorChoferForm
/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
export const entregasPorCliente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasPorCliente.url(options),
    method: 'get',
})

entregasPorCliente.definition = {
    methods: ["get","head"],
    url: '/reportes/ventas/entregas-por-cliente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregasPorCliente.url = (options?: RouteQueryOptions) => {
    return entregasPorCliente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregasPorCliente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasPorCliente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregasPorCliente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasPorCliente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
    const entregasPorClienteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregasPorCliente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
        entregasPorClienteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasPorCliente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::entregasPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
        entregasPorClienteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasPorCliente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregasPorCliente.form = entregasPorClienteForm
/**
* @see \App\Http\Controllers\ReporteVentasController::exportMethod
 * @see app/Http/Controllers/ReporteVentasController.php:0
 * @route '/reportes/ventas/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/reportes/ventas/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::exportMethod
 * @see app/Http/Controllers/ReporteVentasController.php:0
 * @route '/reportes/ventas/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::exportMethod
 * @see app/Http/Controllers/ReporteVentasController.php:0
 * @route '/reportes/ventas/export'
 */
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::exportMethod
 * @see app/Http/Controllers/ReporteVentasController.php:0
 * @route '/reportes/ventas/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: exportMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::exportMethod
 * @see app/Http/Controllers/ReporteVentasController.php:0
 * @route '/reportes/ventas/export'
 */
        exportMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: exportMethod.url(options),
            method: 'post',
        })
    
    exportMethod.form = exportMethodForm
const ventas = {
    rankingClientes,
entregasPorChofer,
entregasPorCliente,
export: exportMethod,
}

export default ventas