import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::index
 * @see app/Http/Controllers/CuentaPorCobrarController.php:25
 * @route '/ventas/cuentas-por-cobrar'
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
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
    const showForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
        showForm.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:114
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
        showForm.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
    const imprimirTicket80Form = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirTicket80.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
        imprimirTicket80Form.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTicket80.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:127
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
        imprimirTicket80Form.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTicket80.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirTicket80.form = imprimirTicket80Form
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:581
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:581
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:581
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
actualizarFechaVencimiento.put = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarFechaVencimiento.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:581
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
    const actualizarFechaVencimientoForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarFechaVencimiento.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:581
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
        actualizarFechaVencimientoForm.put = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarFechaVencimiento.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarFechaVencimiento.form = actualizarFechaVencimientoForm
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anularCuenta.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularCuenta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
    const anularCuentaForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularCuenta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anularCuenta
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
        anularCuentaForm.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularCuenta.url(args, options),
            method: 'post',
        })
    
    anularCuenta.form = anularCuentaForm
const CuentaPorCobrarController = { checkCajaAbierta, registrarPago, anularPago, index, show, imprimirTicket80, actualizarFechaVencimiento, anularCuenta }

export default CuentaPorCobrarController