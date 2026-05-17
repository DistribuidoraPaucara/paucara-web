import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
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
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
anular.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
    const anularForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anular.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CuentaPorCobrarController::anular
 * @see app/Http/Controllers/CuentaPorCobrarController.php:434
 * @route '/ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular'
 */
        anularForm.post = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anular.url(args, options),
            method: 'post',
        })
    
    anular.form = anularForm
const cuentasPorCobrar = {
    index,
show,
imprimirTicket80,
actualizarFechaVencimiento,
anular,
}

export default cuentasPorCobrar