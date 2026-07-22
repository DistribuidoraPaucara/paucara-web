import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrar
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
export const registrar = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(args, options),
    method: 'post',
})

registrar.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/pagos/registrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrar
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
registrar.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return registrar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::registrar
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
registrar.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::registrar
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
    const registrarForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::registrar
 * @see app/Http/Controllers/Api/PagoVentaController.php:19
 * @route '/api/ventas/{venta}/pagos/registrar'
 */
        registrarForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrar.url(args, options),
            method: 'post',
        })
    
    registrar.form = registrarForm
/**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
export const resumen = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/pagos/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
resumen.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return resumen.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
resumen.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
resumen.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
    const resumenForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
        resumenForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PagoVentaController::resumen
 * @see app/Http/Controllers/Api/PagoVentaController.php:47
 * @route '/api/ventas/{venta}/pagos/resumen'
 */
        resumenForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
/**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
export const detalle = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})

detalle.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/pagos/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
detalle.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return detalle.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
detalle.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
detalle.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
    const detalleForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
        detalleForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PagoVentaController::detalle
 * @see app/Http/Controllers/Api/PagoVentaController.php:62
 * @route '/api/ventas/{venta}/pagos/detalle'
 */
        detalleForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalle.form = detalleForm
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
const pagos = {
    registrar,
resumen,
detalle,
reporteCaja,
}

export default pagos