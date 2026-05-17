import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import credito from './credito'
import pago from './pago'
/**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
export const creditoDetalles = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: creditoDetalles.url(args, options),
    method: 'get',
})

creditoDetalles.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito-detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
creditoDetalles.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return creditoDetalles.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
creditoDetalles.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: creditoDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
creditoDetalles.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: creditoDetalles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
    const creditoDetallesForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: creditoDetalles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
        creditoDetallesForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: creditoDetalles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::creditoDetalles
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
        creditoDetallesForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: creditoDetalles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    creditoDetalles.form = creditoDetallesForm
/**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
export const cuentasPendientes = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasPendientes.url(args, options),
    method: 'get',
})

cuentasPendientes.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/cuentas-pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
cuentasPendientes.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return cuentasPendientes.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
cuentasPendientes.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasPendientes.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
cuentasPendientes.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cuentasPendientes.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
    const cuentasPendientesForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cuentasPendientes.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
        cuentasPendientesForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasPendientes.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::cuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
        cuentasPendientesForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasPendientes.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cuentasPendientes.form = cuentasPendientesForm
/**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
export const cuentasVencidas = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasVencidas.url(args, options),
    method: 'get',
})

cuentasVencidas.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/cuentas-vencidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
cuentasVencidas.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return cuentasVencidas.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
cuentasVencidas.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cuentasVencidas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
cuentasVencidas.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cuentasVencidas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
    const cuentasVencidasForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cuentasVencidas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
        cuentasVencidasForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasVencidas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::cuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
        cuentasVencidasForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cuentasVencidas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cuentasVencidas.form = cuentasVencidasForm
/**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
export const pagos = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pagos.url(args, options),
    method: 'get',
})

pagos.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
pagos.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return pagos.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
pagos.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pagos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
pagos.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pagos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
    const pagosForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pagos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
        pagosForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pagos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::pagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
        pagosForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pagos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pagos.form = pagosForm
/**
* @see \App\Http\Controllers\ClienteController::registrarPago
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
export const registrarPago = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

registrarPago.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::registrarPago
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
registrarPago.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return registrarPago.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::registrarPago
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
registrarPago.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::registrarPago
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
    const registrarPagoForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::registrarPago
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
        registrarPagoForm.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPago.url(args, options),
            method: 'post',
        })
    
    registrarPago.form = registrarPagoForm
/**
* @see \App\Http\Controllers\ClienteController::ajustarLimite
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
export const ajustarLimite = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarLimite.url(args, options),
    method: 'post',
})

ajustarLimite.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/ajustar-limite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::ajustarLimite
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
ajustarLimite.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return ajustarLimite.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::ajustarLimite
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
ajustarLimite.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarLimite.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::ajustarLimite
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
    const ajustarLimiteForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ajustarLimite.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::ajustarLimite
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
        ajustarLimiteForm.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ajustarLimite.url(args, options),
            method: 'post',
        })
    
    ajustarLimite.form = ajustarLimiteForm
const cliente = {
    creditoDetalles,
cuentasPendientes,
cuentasVencidas,
pagos,
registrarPago,
ajustarLimite,
credito,
pago,
}

export default cliente