import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rutas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
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
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/rutas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/rutas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
export const planificar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

planificar.definition = {
    methods: ["post"],
    url: '/rutas/planificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
planificar.url = (options?: RouteQueryOptions) => {
    return planificar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
planificar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
    const planificarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: planificar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
        planificarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: planificar.url(options),
            method: 'post',
        })
    
    planificar.form = planificarForm
/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
export const show = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/rutas/{ruta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return show.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.get = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.head = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
    const showForm = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
        showForm.get = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
        showForm.head = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
export const iniciar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

iniciar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/iniciar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
iniciar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return iniciar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
iniciar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
    const iniciarForm = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: iniciar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
        iniciarForm.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: iniciar.url(args, options),
            method: 'post',
        })
    
    iniciar.form = iniciarForm
/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
export const completar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

completar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/completar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
completar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return completar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
completar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
    const completarForm = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
        completarForm.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completar.url(args, options),
            method: 'post',
        })
    
    completar.form = completarForm
/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
export const cancelar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
cancelar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return cancelar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
cancelar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
    const cancelarForm = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
        cancelarForm.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
export const registrarEntrega = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEntrega.url(args, options),
    method: 'post',
})

registrarEntrega.definition = {
    methods: ["post"],
    url: '/rutas/detalles/{detalle}/registrar-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
registrarEntrega.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return registrarEntrega.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
registrarEntrega.post = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
    const registrarEntregaForm = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
        registrarEntregaForm.post = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarEntrega.url(args, options),
            method: 'post',
        })
    
    registrarEntrega.form = registrarEntregaForm
const RutaController = { index, create, store, planificar, show, iniciar, completar, cancelar, registrarEntrega }

export default RutaController