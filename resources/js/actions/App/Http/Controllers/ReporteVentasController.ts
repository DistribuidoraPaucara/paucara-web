import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
const imprimirReporte83074dc5da3eda88ea7c09de46c24157 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url(options),
    method: 'get',
})

imprimirReporte83074dc5da3eda88ea7c09de46c24157.definition = {
    methods: ["get","head"],
    url: '/api/ventas/reporte-productos-vendidos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporte83074dc5da3eda88ea7c09de46c24157.url = (options?: RouteQueryOptions) => {
    return imprimirReporte83074dc5da3eda88ea7c09de46c24157.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporte83074dc5da3eda88ea7c09de46c24157.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporte83074dc5da3eda88ea7c09de46c24157.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
    const imprimirReporte83074dc5da3eda88ea7c09de46c24157Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
        imprimirReporte83074dc5da3eda88ea7c09de46c24157Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/api/ventas/reporte-productos-vendidos/imprimir'
 */
        imprimirReporte83074dc5da3eda88ea7c09de46c24157Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirReporte83074dc5da3eda88ea7c09de46c24157.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirReporte83074dc5da3eda88ea7c09de46c24157.form = imprimirReporte83074dc5da3eda88ea7c09de46c24157Form
    /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
const imprimirReporteb57bbd8dd4744d741ae4ffee39d10319 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url(options),
    method: 'get',
})

imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.definition = {
    methods: ["get","head"],
    url: '/ventas/reporte-productos-vendidos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url = (options?: RouteQueryOptions) => {
    return imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
    const imprimirReporteb57bbd8dd4744d741ae4ffee39d10319Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
        imprimirReporteb57bbd8dd4744d741ae4ffee39d10319Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirReporte
 * @see app/Http/Controllers/ReporteVentasController.php:1097
 * @route '/ventas/reporte-productos-vendidos/imprimir'
 */
        imprimirReporteb57bbd8dd4744d741ae4ffee39d10319Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirReporteb57bbd8dd4744d741ae4ffee39d10319.form = imprimirReporteb57bbd8dd4744d741ae4ffee39d10319Form

export const imprimirReporte = {
    '/api/ventas/reporte-productos-vendidos/imprimir': imprimirReporte83074dc5da3eda88ea7c09de46c24157,
    '/ventas/reporte-productos-vendidos/imprimir': imprimirReporteb57bbd8dd4744d741ae4ffee39d10319,
}

/**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
export const obtenerImpresoras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImpresoras.url(options),
    method: 'get',
})

obtenerImpresoras.definition = {
    methods: ["get","head"],
    url: '/api/ventas/impresoras/disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
obtenerImpresoras.url = (options?: RouteQueryOptions) => {
    return obtenerImpresoras.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
obtenerImpresoras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImpresoras.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
obtenerImpresoras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerImpresoras.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
    const obtenerImpresorasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerImpresoras.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
        obtenerImpresorasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImpresoras.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::obtenerImpresoras
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
        obtenerImpresorasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImpresoras.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerImpresoras.form = obtenerImpresorasForm
/**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
export const productosVendidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})

productosVendidos.definition = {
    methods: ["get","head"],
    url: '/ventas/reporte-productos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
productosVendidos.url = (options?: RouteQueryOptions) => {
    return productosVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
productosVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
productosVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosVendidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
    const productosVendidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosVendidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
        productosVendidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosVendidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::productosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
        productosVendidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosVendidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosVendidos.form = productosVendidosForm
/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:796
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
export const imprimirDirecto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: imprimirDirecto.url(options),
    method: 'post',
})

imprimirDirecto.definition = {
    methods: ["post"],
    url: '/ventas/reporte-productos-vendidos/imprimir-directo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:796
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
imprimirDirecto.url = (options?: RouteQueryOptions) => {
    return imprimirDirecto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:796
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
imprimirDirecto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: imprimirDirecto.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:796
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
    const imprimirDirectoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: imprimirDirecto.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::imprimirDirecto
 * @see app/Http/Controllers/ReporteVentasController.php:796
 * @route '/ventas/reporte-productos-vendidos/imprimir-directo'
 */
        imprimirDirectoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: imprimirDirecto.url(options),
            method: 'post',
        })
    
    imprimirDirecto.form = imprimirDirectoForm
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
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
export const entregarsPorCliente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregarsPorCliente.url(options),
    method: 'get',
})

entregarsPorCliente.definition = {
    methods: ["get","head"],
    url: '/reportes/ventas/entregas-por-cliente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregarsPorCliente.url = (options?: RouteQueryOptions) => {
    return entregarsPorCliente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregarsPorCliente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregarsPorCliente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
entregarsPorCliente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregarsPorCliente.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
    const entregarsPorClienteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregarsPorCliente.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
        entregarsPorClienteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregarsPorCliente.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::entregarsPorCliente
 * @see app/Http/Controllers/ReporteVentasController.php:659
 * @route '/reportes/ventas/entregas-por-cliente'
 */
        entregarsPorClienteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregarsPorCliente.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregarsPorCliente.form = entregarsPorClienteForm
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
const ReporteVentasController = { imprimirReporte, obtenerImpresoras, productosVendidos, imprimirDirecto, rankingClientes, entregasPorChofer, entregarsPorCliente, exportMethod, export: exportMethod }

export default ReporteVentasController