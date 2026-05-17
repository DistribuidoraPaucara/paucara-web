import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/cuentas-por-pagar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorPagarController::index
 * @see app/Http/Controllers/CuentaPorPagarController.php:19
 * @route '/compras/cuentas-por-pagar'
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
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/compras/cuentas-por-pagar/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorPagarController::exportMethod
 * @see app/Http/Controllers/CuentaPorPagarController.php:193
 * @route '/compras/cuentas-por-pagar/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
export const show = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compras/cuentas-por-pagar/{cuenta}/show',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
show.url = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuenta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuenta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuenta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuenta: typeof args.cuenta === 'object'
                ? args.cuenta.id
                : args.cuenta,
                }

    return show.definition.url
            .replace('{cuenta}', parsedArgs.cuenta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
show.get = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
show.head = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
    const showForm = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
        showForm.get = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorPagarController::show
 * @see app/Http/Controllers/CuentaPorPagarController.php:81
 * @route '/compras/cuentas-por-pagar/{cuenta}/show'
 */
        showForm.head = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CuentaPorPagarController::actualizarEstado
 * @see app/Http/Controllers/CuentaPorPagarController.php:90
 * @route '/compras/cuentas-por-pagar/{cuenta}/estado'
 */
export const actualizarEstado = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

actualizarEstado.definition = {
    methods: ["patch"],
    url: '/compras/cuentas-por-pagar/{cuenta}/estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::actualizarEstado
 * @see app/Http/Controllers/CuentaPorPagarController.php:90
 * @route '/compras/cuentas-por-pagar/{cuenta}/estado'
 */
actualizarEstado.url = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuenta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuenta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuenta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuenta: typeof args.cuenta === 'object'
                ? args.cuenta.id
                : args.cuenta,
                }

    return actualizarEstado.definition.url
            .replace('{cuenta}', parsedArgs.cuenta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::actualizarEstado
 * @see app/Http/Controllers/CuentaPorPagarController.php:90
 * @route '/compras/cuentas-por-pagar/{cuenta}/estado'
 */
actualizarEstado.patch = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::actualizarEstado
 * @see app/Http/Controllers/CuentaPorPagarController.php:90
 * @route '/compras/cuentas-por-pagar/{cuenta}/estado'
 */
    const actualizarEstadoForm = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::actualizarEstado
 * @see app/Http/Controllers/CuentaPorPagarController.php:90
 * @route '/compras/cuentas-por-pagar/{cuenta}/estado'
 */
        actualizarEstadoForm.patch = (args: { cuenta: number | { id: number } } | [cuenta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarEstado.form = actualizarEstadoForm
/**
* @see \App\Http\Controllers\CuentaPorPagarController::registrarPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:103
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago'
 */
export const registrarPago = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

registrarPago.definition = {
    methods: ["post"],
    url: '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::registrarPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:103
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago'
 */
registrarPago.url = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuentaPorPagar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuentaPorPagar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuentaPorPagar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorPagar: typeof args.cuentaPorPagar === 'object'
                ? args.cuentaPorPagar.id
                : args.cuentaPorPagar,
                }

    return registrarPago.definition.url
            .replace('{cuentaPorPagar}', parsedArgs.cuentaPorPagar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::registrarPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:103
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago'
 */
registrarPago.post = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::registrarPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:103
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago'
 */
    const registrarPagoForm = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::registrarPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:103
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/registrar-pago'
 */
        registrarPagoForm.post = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPago.url(args, options),
            method: 'post',
        })
    
    registrarPago.form = registrarPagoForm
/**
* @see \App\Http\Controllers\CuentaPorPagarController::anularPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:212
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}'
 */
export const anularPago = (args: { cuentaPorPagar: number | { id: number }, pago: number | { id: number } } | [cuentaPorPagar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

anularPago.definition = {
    methods: ["post"],
    url: '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::anularPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:212
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}'
 */
anularPago.url = (args: { cuentaPorPagar: number | { id: number }, pago: number | { id: number } } | [cuentaPorPagar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cuentaPorPagar: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorPagar: typeof args.cuentaPorPagar === 'object'
                ? args.cuentaPorPagar.id
                : args.cuentaPorPagar,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return anularPago.definition.url
            .replace('{cuentaPorPagar}', parsedArgs.cuentaPorPagar.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::anularPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:212
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}'
 */
anularPago.post = (args: { cuentaPorPagar: number | { id: number }, pago: number | { id: number } } | [cuentaPorPagar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::anularPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:212
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}'
 */
    const anularPagoForm = (args: { cuentaPorPagar: number | { id: number }, pago: number | { id: number } } | [cuentaPorPagar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::anularPago
 * @see app/Http/Controllers/CuentaPorPagarController.php:212
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}'
 */
        anularPagoForm.post = (args: { cuentaPorPagar: number | { id: number }, pago: number | { id: number } } | [cuentaPorPagar: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularPago.url(args, options),
            method: 'post',
        })
    
    anularPago.form = anularPagoForm
/**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
export const imprimirTicket80 = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})

imprimirTicket80.definition = {
    methods: ["get","head"],
    url: '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
imprimirTicket80.url = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuentaPorPagar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuentaPorPagar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuentaPorPagar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorPagar: typeof args.cuentaPorPagar === 'object'
                ? args.cuentaPorPagar.id
                : args.cuentaPorPagar,
                }

    return imprimirTicket80.definition.url
            .replace('{cuentaPorPagar}', parsedArgs.cuentaPorPagar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
imprimirTicket80.get = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
imprimirTicket80.head = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
    const imprimirTicket80Form = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirTicket80.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
        imprimirTicket80Form.get = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTicket80.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CuentaPorPagarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorPagarController.php:295
 * @route '/compras/cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80'
 */
        imprimirTicket80Form.head = (args: { cuentaPorPagar: number | { id: number } } | [cuentaPorPagar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTicket80.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirTicket80.form = imprimirTicket80Form
const cuentasPorPagar = {
    index,
export: exportMethod,
show,
actualizarEstado,
registrarPago,
anularPago,
imprimirTicket80,
}

export default cuentasPorPagar