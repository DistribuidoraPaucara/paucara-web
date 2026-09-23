import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import api from './api'
/**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::index
 * @see app/Http/Controllers/ConteoFisicoController.php:17
 * @route '/inventario/conteos-fisicos'
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
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::dashboard
 * @see app/Http/Controllers/ConteoFisicoController.php:315
 * @route '/inventario/conteos-fisicos/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::create
 * @see app/Http/Controllers/ConteoFisicoController.php:64
 * @route '/inventario/conteos-fisicos/create'
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
* @see \App\Http\Controllers\ConteoFisicoController::store
 * @see app/Http/Controllers/ConteoFisicoController.php:73
 * @route '/inventario/conteos-fisicos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::store
 * @see app/Http/Controllers/ConteoFisicoController.php:73
 * @route '/inventario/conteos-fisicos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::store
 * @see app/Http/Controllers/ConteoFisicoController.php:73
 * @route '/inventario/conteos-fisicos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::store
 * @see app/Http/Controllers/ConteoFisicoController.php:73
 * @route '/inventario/conteos-fisicos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::store
 * @see app/Http/Controllers/ConteoFisicoController.php:73
 * @route '/inventario/conteos-fisicos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
export const show = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos/{conteoFisico}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
show.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return show.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
show.get = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
show.head = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
    const showForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
        showForm.get = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::show
 * @see app/Http/Controllers/ConteoFisicoController.php:106
 * @route '/inventario/conteos-fisicos/{conteoFisico}'
 */
        showForm.head = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ConteoFisicoController::iniciar
 * @see app/Http/Controllers/ConteoFisicoController.php:124
 * @route '/inventario/conteos-fisicos/{conteoFisico}/iniciar'
 */
export const iniciar = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

iniciar.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/iniciar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::iniciar
 * @see app/Http/Controllers/ConteoFisicoController.php:124
 * @route '/inventario/conteos-fisicos/{conteoFisico}/iniciar'
 */
iniciar.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return iniciar.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::iniciar
 * @see app/Http/Controllers/ConteoFisicoController.php:124
 * @route '/inventario/conteos-fisicos/{conteoFisico}/iniciar'
 */
iniciar.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::iniciar
 * @see app/Http/Controllers/ConteoFisicoController.php:124
 * @route '/inventario/conteos-fisicos/{conteoFisico}/iniciar'
 */
    const iniciarForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: iniciar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::iniciar
 * @see app/Http/Controllers/ConteoFisicoController.php:124
 * @route '/inventario/conteos-fisicos/{conteoFisico}/iniciar'
 */
        iniciarForm.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: iniciar.url(args, options),
            method: 'post',
        })
    
    iniciar.form = iniciarForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::finalizar
 * @see app/Http/Controllers/ConteoFisicoController.php:135
 * @route '/inventario/conteos-fisicos/{conteoFisico}/finalizar'
 */
export const finalizar = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizar.url(args, options),
    method: 'post',
})

finalizar.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/finalizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::finalizar
 * @see app/Http/Controllers/ConteoFisicoController.php:135
 * @route '/inventario/conteos-fisicos/{conteoFisico}/finalizar'
 */
finalizar.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return finalizar.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::finalizar
 * @see app/Http/Controllers/ConteoFisicoController.php:135
 * @route '/inventario/conteos-fisicos/{conteoFisico}/finalizar'
 */
finalizar.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::finalizar
 * @see app/Http/Controllers/ConteoFisicoController.php:135
 * @route '/inventario/conteos-fisicos/{conteoFisico}/finalizar'
 */
    const finalizarForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalizar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::finalizar
 * @see app/Http/Controllers/ConteoFisicoController.php:135
 * @route '/inventario/conteos-fisicos/{conteoFisico}/finalizar'
 */
        finalizarForm.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalizar.url(args, options),
            method: 'post',
        })
    
    finalizar.form = finalizarForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::aprobar
 * @see app/Http/Controllers/ConteoFisicoController.php:146
 * @route '/inventario/conteos-fisicos/{conteoFisico}/aprobar'
 */
export const aprobar = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::aprobar
 * @see app/Http/Controllers/ConteoFisicoController.php:146
 * @route '/inventario/conteos-fisicos/{conteoFisico}/aprobar'
 */
aprobar.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return aprobar.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::aprobar
 * @see app/Http/Controllers/ConteoFisicoController.php:146
 * @route '/inventario/conteos-fisicos/{conteoFisico}/aprobar'
 */
aprobar.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::aprobar
 * @see app/Http/Controllers/ConteoFisicoController.php:146
 * @route '/inventario/conteos-fisicos/{conteoFisico}/aprobar'
 */
    const aprobarForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aprobar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::aprobar
 * @see app/Http/Controllers/ConteoFisicoController.php:146
 * @route '/inventario/conteos-fisicos/{conteoFisico}/aprobar'
 */
        aprobarForm.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aprobar.url(args, options),
            method: 'post',
        })
    
    aprobar.form = aprobarForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::cancelar
 * @see app/Http/Controllers/ConteoFisicoController.php:172
 * @route '/inventario/conteos-fisicos/{conteoFisico}/cancelar'
 */
export const cancelar = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::cancelar
 * @see app/Http/Controllers/ConteoFisicoController.php:172
 * @route '/inventario/conteos-fisicos/{conteoFisico}/cancelar'
 */
cancelar.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return cancelar.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::cancelar
 * @see app/Http/Controllers/ConteoFisicoController.php:172
 * @route '/inventario/conteos-fisicos/{conteoFisico}/cancelar'
 */
cancelar.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::cancelar
 * @see app/Http/Controllers/ConteoFisicoController.php:172
 * @route '/inventario/conteos-fisicos/{conteoFisico}/cancelar'
 */
    const cancelarForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::cancelar
 * @see app/Http/Controllers/ConteoFisicoController.php:172
 * @route '/inventario/conteos-fisicos/{conteoFisico}/cancelar'
 */
        cancelarForm.post = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::contarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:188
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar'
 */
export const contarItem = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contarItem.url(args, options),
    method: 'post',
})

contarItem.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::contarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:188
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar'
 */
contarItem.url = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return contarItem.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::contarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:188
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar'
 */
contarItem.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contarItem.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::contarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:188
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar'
 */
    const contarItemForm = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: contarItem.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::contarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:188
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/contar'
 */
        contarItemForm.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: contarItem.url(args, options),
            method: 'post',
        })
    
    contarItem.form = contarItemForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::recontarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:208
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar'
 */
export const recontarItem = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recontarItem.url(args, options),
    method: 'post',
})

recontarItem.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::recontarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:208
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar'
 */
recontarItem.url = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return recontarItem.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::recontarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:208
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar'
 */
recontarItem.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recontarItem.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::recontarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:208
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar'
 */
    const recontarItemForm = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recontarItem.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::recontarItem
 * @see app/Http/Controllers/ConteoFisicoController.php:208
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/recontar'
 */
        recontarItemForm.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recontarItem.url(args, options),
            method: 'post',
        })
    
    recontarItem.form = recontarItemForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::marcarReconteo
 * @see app/Http/Controllers/ConteoFisicoController.php:228
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo'
 */
export const marcarReconteo = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarReconteo.url(args, options),
    method: 'post',
})

marcarReconteo.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::marcarReconteo
 * @see app/Http/Controllers/ConteoFisicoController.php:228
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo'
 */
marcarReconteo.url = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return marcarReconteo.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::marcarReconteo
 * @see app/Http/Controllers/ConteoFisicoController.php:228
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo'
 */
marcarReconteo.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarReconteo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::marcarReconteo
 * @see app/Http/Controllers/ConteoFisicoController.php:228
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo'
 */
    const marcarReconteoForm = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarReconteo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::marcarReconteo
 * @see app/Http/Controllers/ConteoFisicoController.php:228
 * @route '/inventario/conteos-fisicos/{conteoFisico}/items/{detalle}/marcar-reconteo'
 */
        marcarReconteoForm.post = (args: { conteoFisico: number | { id: number }, detalle: number | { id: number } } | [conteoFisico: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarReconteo.url(args, options),
            method: 'post',
        })
    
    marcarReconteo.form = marcarReconteoForm
const conteosFisicos = {
    index,
dashboard,
create,
store,
show,
iniciar,
finalizar,
aprobar,
cancelar,
contarItem,
recontarItem,
marcarReconteo,
api,
}

export default conteosFisicos