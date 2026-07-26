import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:124
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:124
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:124
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
show.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::show
 * @see app/Http/Controllers/CuentaPorCobrarController.php:124
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/show'
 */
show.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:140
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:140
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:140
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
imprimir.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimir
 * @see app/Http/Controllers/CuentaPorCobrarController.php:140
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir'
 */
imprimir.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:206
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:206
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:206
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CuentaPorCobrarController::imprimirTicket80
 * @see app/Http/Controllers/CuentaPorCobrarController.php:206
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80'
 */
imprimirTicket80.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTicket80.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::actualizarFechaVencimiento
 * @see app/Http/Controllers/CuentaPorCobrarController.php:775
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:775
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:775
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento'
 */
actualizarFechaVencimiento.put = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarFechaVencimiento.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:626
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
export const anular = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

anular.definition = {
    methods: ["post"],
    url: '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:626
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anular.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return anular.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:626
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anular.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})
const cuentasPorCobrar = {
    index,
show,
imprimir,
imprimirTicket80,
actualizarFechaVencimiento,
anular,
}

export default cuentasPorCobrar