import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import pagos from './pagos'
/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/api/app/ventas/{venta}/pagos'
 */
export const registrarPago = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

registrarPago.definition = {
    methods: ["post"],
    url: '/api/app/ventas/{venta}/pagos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/api/app/ventas/{venta}/pagos'
 */
registrarPago.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return registrarPago.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/api/app/ventas/{venta}/pagos'
 */
registrarPago.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/api/app/ventas/{venta}/pagos'
 */
    const registrarPagoForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/api/app/ventas/{venta}/pagos'
 */
        registrarPagoForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPago.url(args, options),
            method: 'post',
        })
    
    registrarPago.form = registrarPagoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
export const obtenerEntrega = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEntrega.url(args, options),
    method: 'get',
})

obtenerEntrega.definition = {
    methods: ["get","head"],
    url: '/api/app/ventas/{ventaId}/entrega',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntrega.url = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ventaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ventaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ventaId: args.ventaId,
                }

    return obtenerEntrega.definition.url
            .replace('{ventaId}', parsedArgs.ventaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntrega.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEntrega.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntrega.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerEntrega.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
    const obtenerEntregaForm = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerEntrega.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
        obtenerEntregaForm.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEntrega.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
        obtenerEntregaForm.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEntrega.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerEntrega.form = obtenerEntregaForm
/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
export const imprimir = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimir.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
    const imprimirForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
        imprimirForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/api/ventas/{venta}/imprimir'
 */
        imprimirForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
export const preview = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
preview.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
preview.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
preview.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
    const previewForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
        previewForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/api/ventas/{venta}/preview'
 */
        previewForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/ventas/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2115
 * @route '/api/ventas/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
export const confirmarPickupCliente = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupCliente.url(args, options),
    method: 'post',
})

confirmarPickupCliente.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/confirmar-pickup-cliente',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
confirmarPickupCliente.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirmarPickupCliente.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
confirmarPickupCliente.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupCliente.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
    const confirmarPickupClienteForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarPickupCliente.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
        confirmarPickupClienteForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarPickupCliente.url(args, options),
            method: 'post',
        })
    
    confirmarPickupCliente.form = confirmarPickupClienteForm
/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
export const confirmarPickupEmpleado = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupEmpleado.url(args, options),
    method: 'post',
})

confirmarPickupEmpleado.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/confirmar-pickup-empleado',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
confirmarPickupEmpleado.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirmarPickupEmpleado.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
confirmarPickupEmpleado.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupEmpleado.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
    const confirmarPickupEmpleadoForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarPickupEmpleado.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
        confirmarPickupEmpleadoForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarPickupEmpleado.url(args, options),
            method: 'post',
        })
    
    confirmarPickupEmpleado.form = confirmarPickupEmpleadoForm
/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
export const registrarEnCaja = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEnCaja.url(args, options),
    method: 'post',
})

registrarEnCaja.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/registrar-en-caja',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
registrarEnCaja.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return registrarEnCaja.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
registrarEnCaja.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEnCaja.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
    const registrarEnCajaForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarEnCaja.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
        registrarEnCajaForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarEnCaja.url(args, options),
            method: 'post',
        })
    
    registrarEnCaja.form = registrarEnCajaForm
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/api/ventas'
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
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/api/ventas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/ventas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/api/ventas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/api/ventas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/api/ventas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/api/ventas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
export const show = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
show.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return show.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
show.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
show.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
    const showForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
        showForm.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/api/ventas/{venta}'
 */
        showForm.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
export const update = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
update.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return update.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
update.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
update.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
    const updateForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
        updateForm.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/api/ventas/{venta}'
 */
        updateForm.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/api/ventas/{venta}'
 */
export const destroy = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/api/ventas/{venta}'
 */
destroy.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return destroy.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/api/ventas/{venta}'
 */
destroy.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/api/ventas/{venta}'
 */
    const destroyForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/api/ventas/{venta}'
 */
        destroyForm.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ventas = {
    registrarPago,
obtenerEntrega,
imprimir,
preview,
search,
confirmarPickupCliente,
confirmarPickupEmpleado,
registrarEnCaja,
pagos,
index,
store,
show,
update,
destroy,
}

export default ventas