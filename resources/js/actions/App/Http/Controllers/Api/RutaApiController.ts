import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/rutas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RutaApiController::index
 * @see app/Http/Controllers/Api/RutaApiController.php:26
 * @route '/api/rutas'
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
* @see \App\Http\Controllers\Api\RutaApiController::planificar
 * @see app/Http/Controllers/Api/RutaApiController.php:66
 * @route '/api/rutas/planificar'
 */
export const planificar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

planificar.definition = {
    methods: ["post"],
    url: '/api/rutas/planificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::planificar
 * @see app/Http/Controllers/Api/RutaApiController.php:66
 * @route '/api/rutas/planificar'
 */
planificar.url = (options?: RouteQueryOptions) => {
    return planificar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::planificar
 * @see app/Http/Controllers/Api/RutaApiController.php:66
 * @route '/api/rutas/planificar'
 */
planificar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::planificar
 * @see app/Http/Controllers/Api/RutaApiController.php:66
 * @route '/api/rutas/planificar'
 */
    const planificarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: planificar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::planificar
 * @see app/Http/Controllers/Api/RutaApiController.php:66
 * @route '/api/rutas/planificar'
 */
        planificarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: planificar.url(options),
            method: 'post',
        })
    
    planificar.form = planificarForm
/**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
export const show = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/rutas/{ruta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
show.url = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ruta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: typeof args.ruta === 'object'
                ? args.ruta.id
                : args.ruta,
                }

    return show.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
show.get = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
show.head = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
    const showForm = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
        showForm.get = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RutaApiController::show
 * @see app/Http/Controllers/Api/RutaApiController.php:105
 * @route '/api/rutas/{ruta}'
 */
        showForm.head = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\RutaApiController::actualizarEstado
 * @see app/Http/Controllers/Api/RutaApiController.php:178
 * @route '/api/rutas/{ruta}/estado'
 */
export const actualizarEstado = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

actualizarEstado.definition = {
    methods: ["patch"],
    url: '/api/rutas/{ruta}/estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::actualizarEstado
 * @see app/Http/Controllers/Api/RutaApiController.php:178
 * @route '/api/rutas/{ruta}/estado'
 */
actualizarEstado.url = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ruta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: typeof args.ruta === 'object'
                ? args.ruta.id
                : args.ruta,
                }

    return actualizarEstado.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::actualizarEstado
 * @see app/Http/Controllers/Api/RutaApiController.php:178
 * @route '/api/rutas/{ruta}/estado'
 */
actualizarEstado.patch = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::actualizarEstado
 * @see app/Http/Controllers/Api/RutaApiController.php:178
 * @route '/api/rutas/{ruta}/estado'
 */
    const actualizarEstadoForm = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::actualizarEstado
 * @see app/Http/Controllers/Api/RutaApiController.php:178
 * @route '/api/rutas/{ruta}/estado'
 */
        actualizarEstadoForm.patch = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
export const obtenerDetalles = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'get',
})

obtenerDetalles.definition = {
    methods: ["get","head"],
    url: '/api/rutas/{ruta}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
obtenerDetalles.url = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ruta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: typeof args.ruta === 'object'
                ? args.ruta.id
                : args.ruta,
                }

    return obtenerDetalles.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
obtenerDetalles.get = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
obtenerDetalles.head = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
    const obtenerDetallesForm = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetalles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
        obtenerDetallesForm.get = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RutaApiController::obtenerDetalles
 * @see app/Http/Controllers/Api/RutaApiController.php:144
 * @route '/api/rutas/{ruta}/detalles'
 */
        obtenerDetallesForm.head = (args: { ruta: number | { id: number } } | [ruta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetalles.form = obtenerDetallesForm
/**
* @see \App\Http\Controllers\Api\RutaApiController::completarDetalle
 * @see app/Http/Controllers/Api/RutaApiController.php:218
 * @route '/api/rutas/{ruta}/detalles/{detalle}/completar'
 */
export const completarDetalle = (args: { ruta: number | { id: number }, detalle: number | { id: number } } | [ruta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completarDetalle.url(args, options),
    method: 'post',
})

completarDetalle.definition = {
    methods: ["post"],
    url: '/api/rutas/{ruta}/detalles/{detalle}/completar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RutaApiController::completarDetalle
 * @see app/Http/Controllers/Api/RutaApiController.php:218
 * @route '/api/rutas/{ruta}/detalles/{detalle}/completar'
 */
completarDetalle.url = (args: { ruta: number | { id: number }, detalle: number | { id: number } } | [ruta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: typeof args.ruta === 'object'
                ? args.ruta.id
                : args.ruta,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return completarDetalle.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RutaApiController::completarDetalle
 * @see app/Http/Controllers/Api/RutaApiController.php:218
 * @route '/api/rutas/{ruta}/detalles/{detalle}/completar'
 */
completarDetalle.post = (args: { ruta: number | { id: number }, detalle: number | { id: number } } | [ruta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completarDetalle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RutaApiController::completarDetalle
 * @see app/Http/Controllers/Api/RutaApiController.php:218
 * @route '/api/rutas/{ruta}/detalles/{detalle}/completar'
 */
    const completarDetalleForm = (args: { ruta: number | { id: number }, detalle: number | { id: number } } | [ruta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completarDetalle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RutaApiController::completarDetalle
 * @see app/Http/Controllers/Api/RutaApiController.php:218
 * @route '/api/rutas/{ruta}/detalles/{detalle}/completar'
 */
        completarDetalleForm.post = (args: { ruta: number | { id: number }, detalle: number | { id: number } } | [ruta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completarDetalle.url(args, options),
            method: 'post',
        })
    
    completarDetalle.form = completarDetalleForm
const RutaApiController = { index, planificar, show, actualizarEstado, obtenerDetalles, completarDetalle }

export default RutaApiController