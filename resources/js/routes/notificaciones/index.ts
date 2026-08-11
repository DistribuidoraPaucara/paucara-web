import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/notificaciones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::create
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:148
 * @route '/notificaciones/create'
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/notificaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
export const show = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
show.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacione: args.notificacione,
                }

    return show.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
show.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
show.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
    const showForm = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
        showForm.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/notificaciones/{notificacione}'
 */
        showForm.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
export const edit = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/notificaciones/{notificacione}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
edit.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacione: args.notificacione,
                }

    return edit.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
edit.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
edit.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
    const editForm = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
        editForm.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:203
 * @route '/notificaciones/{notificacione}/edit'
 */
        editForm.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
export const update = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
update.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacione: args.notificacione,
                }

    return update.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
update.put = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
update.patch = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
    const updateForm = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
        updateForm.put = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/notificaciones/{notificacione}'
 */
        updateForm.patch = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/notificaciones/{notificacione}'
 */
export const destroy = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/notificaciones/{notificacione}'
 */
destroy.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacione: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notificacione: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacione: args.notificacione,
                }

    return destroy.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/notificaciones/{notificacione}'
 */
destroy.delete = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/notificaciones/{notificacione}'
 */
    const destroyForm = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/notificaciones/{notificacione}'
 */
        destroyForm.delete = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/notificaciones/{notificacion}/enviar'
 */
export const enviar = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

enviar.definition = {
    methods: ["post"],
    url: '/notificaciones/{notificacion}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/notificaciones/{notificacion}/enviar'
 */
enviar.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificacion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notificacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificacion: args.notificacion,
                }

    return enviar.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/notificaciones/{notificacion}/enviar'
 */
enviar.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/notificaciones/{notificacion}/enviar'
 */
    const enviarForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/notificaciones/{notificacion}/enviar'
 */
        enviarForm.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviar.url(args, options),
            method: 'post',
        })
    
    enviar.form = enviarForm
const notificaciones = {
    index,
create,
store,
show,
edit,
update,
destroy,
enviar,
}

export default notificaciones