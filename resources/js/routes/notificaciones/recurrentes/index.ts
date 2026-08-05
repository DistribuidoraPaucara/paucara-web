import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notificaciones/recurrentes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:14
 * @route '/notificaciones/recurrentes'
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:62
 * @route '/notificaciones/recurrentes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/notificaciones/recurrentes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:62
 * @route '/notificaciones/recurrentes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:62
 * @route '/notificaciones/recurrentes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:62
 * @route '/notificaciones/recurrentes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:62
 * @route '/notificaciones/recurrentes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
export const show = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/notificaciones/recurrentes/{notificacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
show.url = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return show.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
show.get = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
show.head = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
    const showForm = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
        showForm.get = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:91
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
        showForm.head = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:99
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
export const update = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/notificaciones/recurrentes/{notificacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:99
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
update.url = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return update.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:99
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
update.put = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:99
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
    const updateForm = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:99
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
        updateForm.put = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:126
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
export const destroy = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/notificaciones/recurrentes/{notificacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:126
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
destroy.url = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return destroy.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:126
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
destroy.delete = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:126
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
    const destroyForm = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:126
 * @route '/notificaciones/recurrentes/{notificacion}'
 */
        destroyForm.delete = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:165
 * @route '/notificaciones/recurrentes/{notificacion}/enviar'
 */
export const enviar = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

enviar.definition = {
    methods: ["post"],
    url: '/notificaciones/recurrentes/{notificacion}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:165
 * @route '/notificaciones/recurrentes/{notificacion}/enviar'
 */
enviar.url = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: typeof args.notificacion === 'object'
                ? args.notificacion.id
                : args.notificacion,
                }

    return enviar.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:165
 * @route '/notificaciones/recurrentes/{notificacion}/enviar'
 */
enviar.post = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:165
 * @route '/notificaciones/recurrentes/{notificacion}/enviar'
 */
    const enviarForm = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:165
 * @route '/notificaciones/recurrentes/{notificacion}/enviar'
 */
        enviarForm.post = (args: { notificacion: string | number | { id: string | number } } | [notificacion: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviar.url(args, options),
            method: 'post',
        })
    
    enviar.form = enviarForm
const recurrentes = {
    index,
store,
show,
update,
destroy,
enviar,
}

export default recurrentes