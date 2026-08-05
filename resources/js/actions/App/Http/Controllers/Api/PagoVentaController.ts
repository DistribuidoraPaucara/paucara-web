import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrarPagos
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
export const registrarPagos = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagos.url(args, options),
    method: 'post',
})

registrarPagos.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/pagos/registrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrarPagos
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
registrarPagos.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return registrarPagos.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrarPagos
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
registrarPagos.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagos.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::registrarPagos
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
    const registrarPagosForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPagos.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::registrarPagos
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
        registrarPagosForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPagos.url(args, options),
            method: 'post',
        })
    
    registrarPagos.form = registrarPagosForm
/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
export const obtenerResumen = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(args, options),
    method: 'get',
})

obtenerResumen.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/pagos/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
obtenerResumen.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return obtenerResumen.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
obtenerResumen.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
obtenerResumen.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
    const obtenerResumenForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerResumen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
        obtenerResumenForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerResumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
        obtenerResumenForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerResumen.form = obtenerResumenForm
/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
export const obtenerDetalle = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalle.url(args, options),
    method: 'get',
})

obtenerDetalle.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/pagos/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
obtenerDetalle.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return obtenerDetalle.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
obtenerDetalle.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
obtenerDetalle.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
    const obtenerDetalleForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
        obtenerDetalleForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PagoVentaController::obtenerDetalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
        obtenerDetalleForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetalle.form = obtenerDetalleForm
/**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
export const reporteCaja = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteCaja.url(options),
    method: 'get',
})

reporteCaja.definition = {
    methods: ["get","head"],
    url: '/api/ventas/pagos/reporte-caja',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
reporteCaja.url = (options?: RouteQueryOptions) => {
    return reporteCaja.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
reporteCaja.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteCaja.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
reporteCaja.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteCaja.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
    const reporteCajaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteCaja.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
        reporteCajaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteCaja.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PagoVentaController::reporteCaja
 * @see app/Http/Controllers/Api/PagoVentaController.php:92
 * @route '/api/ventas/pagos/reporte-caja'
 */
        reporteCajaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteCaja.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteCaja.form = reporteCajaForm
const PagoVentaController = { registrarPagos, obtenerResumen, obtenerDetalle, reporteCaja }

export default PagoVentaController