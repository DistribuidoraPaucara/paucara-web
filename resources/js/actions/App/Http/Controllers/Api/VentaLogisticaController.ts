import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
export const show = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/logistica',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
show.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
    const showForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
        showForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::show
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:32
 * @route '/api/ventas/{venta}/logistica'
 */
        showForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
export const entregas = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregas.url(args, options),
    method: 'get',
})

entregas.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/entregas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return entregas.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
    const entregasForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
        entregasForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
        entregasForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregas.form = entregasForm
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/logistica/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
export const resincronizar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resincronizar.url(options),
    method: 'post',
})

resincronizar.definition = {
    methods: ["post"],
    url: '/api/logistica/resincronizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
resincronizar.url = (options?: RouteQueryOptions) => {
    return resincronizar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
resincronizar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resincronizar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
    const resincronizarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resincronizar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
        resincronizarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resincronizar.url(options),
            method: 'post',
        })
    
    resincronizar.form = resincronizarForm
const VentaLogisticaController = { show, entregas, estadisticas, resincronizar }

export default VentaLogisticaController