import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
export const publicMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(options),
    method: 'get',
})

publicMethod.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/public/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
publicMethod.url = (options?: RouteQueryOptions) => {
    return publicMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
publicMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
publicMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
    const publicMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: publicMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
        publicMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::publicMethod
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
        publicMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    publicMethod.form = publicMethodForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/roles/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
    const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: roles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
        rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::roles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:299
 * @route '/api/notificaciones/roles/list'
 */
        rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    roles.form = rolesForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
export const show = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
show.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
show.get = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
show.head = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
    const showForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
        showForm.get = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:191
 * @route '/api/notificaciones/{notificacion}'
 */
        showForm.head = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/api/notificaciones/{notificacion}'
 */
export const update = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/api/notificaciones/{notificacion}'
 */
update.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/api/notificaciones/{notificacion}'
 */
update.put = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:224
 * @route '/api/notificaciones/{notificacion}'
 */
    const updateForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/api/notificaciones/{notificacion}'
 */
        updateForm.put = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/api/notificaciones/{notificacion}'
 */
export const destroy = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/api/notificaciones/{notificacion}'
 */
destroy.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/api/notificaciones/{notificacion}'
 */
destroy.delete = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:273
 * @route '/api/notificaciones/{notificacion}'
 */
    const destroyForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/api/notificaciones/{notificacion}'
 */
        destroyForm.delete = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
export const enviar = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

enviar.definition = {
    methods: ["post"],
    url: '/api/notificaciones/{notificacion}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/api/notificaciones/{notificacion}/enviar'
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
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
enviar.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
    const enviarForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviar
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:329
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
        enviarForm.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviar.url(args, options),
            method: 'post',
        })
    
    enviar.form = enviarForm
const notificaciones = {
    public: publicMethod,
index,
store,
roles,
show,
update,
destroy,
enviar,
}

export default notificaciones