import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
export const checkCajaAbierta = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})

checkCajaAbierta.definition = {
    methods: ["get","head"],
    url: '/ventas/cuentas-por-cobrar/check-caja-abierta',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.url = (options?: RouteQueryOptions) => {
    return checkCajaAbierta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkCajaAbierta.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
    const checkCajaAbiertaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkCajaAbierta.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
        checkCajaAbiertaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCajaAbierta.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
        checkCajaAbiertaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCajaAbierta.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkCajaAbierta.form = checkCajaAbiertaForm
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:228
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
export const registrarPago = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

registrarPago.definition = {
    methods: ["post"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:228
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
registrarPago.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuentaPorCobrar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuentaPorCobrar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuentaPorCobrar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorCobrar: typeof args.cuentaPorCobrar === 'object'
                ? args.cuentaPorCobrar.id
                : args.cuentaPorCobrar,
                }

    return registrarPago.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:228
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
registrarPago.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:228
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
    const registrarPagoForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:228
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
        registrarPagoForm.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPago.url(args, options),
            method: 'post',
        })
    
    registrarPago.form = registrarPagoForm
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:347
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
export const anularPago = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

anularPago.definition = {
    methods: ["post"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:347
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
anularPago.url = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cuentaPorCobrar: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorCobrar: typeof args.cuentaPorCobrar === 'object'
                ? args.cuentaPorCobrar.id
                : args.cuentaPorCobrar,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return anularPago.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:347
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
anularPago.post = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:347
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
    const anularPagoForm = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:347
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
        anularPagoForm.post = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularPago.url(args, options),
            method: 'post',
        })
    
    anularPago.form = anularPagoForm
const cuentasPorCobrar = {
    checkCajaAbierta,
registrarPago,
anularPago,
}

export default cuentasPorCobrar