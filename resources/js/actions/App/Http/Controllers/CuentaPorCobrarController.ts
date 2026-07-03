import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:183
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:183
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.url = (options?: RouteQueryOptions) => {
    return checkCajaAbierta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:183
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::checkCajaAbierta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:183
 * @route '/ventas/cuentas-por-cobrar/check-caja-abierta'
 */
checkCajaAbierta.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkCajaAbierta.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::registrarPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:233
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:233
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:233
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago'
 */
registrarPago.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularPago
 * @see app/Http/Controllers/CuentaPorCobrarController.php:369
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:369
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:369
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}'
 */
anularPago.post = (args: { cuentaPorCobrar: number | { id: number }, pago: number | { id: number } } | [cuentaPorCobrar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ventas/cuentas-por-cobrar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
export const show = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
show.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
show.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
show.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
export const imprimir = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
imprimir.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimir.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
imprimir.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
imprimir.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
export const imprimirTicket80 = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})

imprimirTicket80.definition = {
    methods: ["get","head"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimirTicket80.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:178
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:608
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
export const actualizarFechaVencimiento = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarFechaVencimiento.url(args, options),
    method: 'put',
})

actualizarFechaVencimiento.definition = {
    methods: ["put"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:608
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
actualizarFechaVencimiento.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarFechaVencimiento.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:608
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
actualizarFechaVencimiento.put = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarFechaVencimiento.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:459
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
export const anularCuenta = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularCuenta.url(args, options),
    method: 'post',
})

anularCuenta.definition = {
    methods: ["post"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:459
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anularCuenta.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return anularCuenta.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:459
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anularCuenta.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularCuenta.url(args, options),
    method: 'post',
})
const CuentaPorCobrarController = { checkCajaAbierta, registrarPago, anularPago, index, show, imprimir, imprimirTicket80, actualizarFechaVencimiento, anularCuenta }

export default CuentaPorCobrarController