import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
export const indexPublic = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexPublic.url(options),
    method: 'get',
})

indexPublic.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/public/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
indexPublic.url = (options?: RouteQueryOptions) => {
    return indexPublic.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
indexPublic.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexPublic.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
indexPublic.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexPublic.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
    const indexPublicForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexPublic.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
        indexPublicForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexPublic.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::indexPublic
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:33
 * @route '/api/notificaciones/public/list'
 */
        indexPublicForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexPublic.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexPublic.form = indexPublicForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
const index125ae0aa7227ab3ee4c3d1b5e30c0ccf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
    method: 'get',
})

index125ae0aa7227ab3ee4c3d1b5e30c0ccf.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url = (options?: RouteQueryOptions) => {
    return index125ae0aa7227ab3ee4c3d1b5e30c0ccf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index125ae0aa7227ab3ee4c3d1b5e30c0ccf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
index125ae0aa7227ab3ee4c3d1b5e30c0ccf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
    const index125ae0aa7227ab3ee4c3d1b5e30c0ccfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
        index125ae0aa7227ab3ee4c3d1b5e30c0ccfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/api/notificaciones'
 */
        index125ae0aa7227ab3ee4c3d1b5e30c0ccfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index125ae0aa7227ab3ee4c3d1b5e30c0ccf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index125ae0aa7227ab3ee4c3d1b5e30c0ccf.form = index125ae0aa7227ab3ee4c3d1b5e30c0ccfForm
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
const index04c4bdd06d3f45d53d75d8f0c5bcf645 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
    method: 'get',
})

index04c4bdd06d3f45d53d75d8f0c5bcf645.definition = {
    methods: ["get","head"],
    url: '/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index04c4bdd06d3f45d53d75d8f0c5bcf645.url = (options?: RouteQueryOptions) => {
    return index04c4bdd06d3f45d53d75d8f0c5bcf645.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index04c4bdd06d3f45d53d75d8f0c5bcf645.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
index04c4bdd06d3f45d53d75d8f0c5bcf645.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
    const index04c4bdd06d3f45d53d75d8f0c5bcf645Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
        index04c4bdd06d3f45d53d75d8f0c5bcf645Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::index
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:69
 * @route '/notificaciones'
 */
        index04c4bdd06d3f45d53d75d8f0c5bcf645Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index04c4bdd06d3f45d53d75d8f0c5bcf645.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index04c4bdd06d3f45d53d75d8f0c5bcf645.form = index04c4bdd06d3f45d53d75d8f0c5bcf645Form

export const index = {
    '/api/notificaciones': index125ae0aa7227ab3ee4c3d1b5e30c0ccf,
    '/notificaciones': index04c4bdd06d3f45d53d75d8f0c5bcf645,
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
const store125ae0aa7227ab3ee4c3d1b5e30c0ccf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
    method: 'post',
})

store125ae0aa7227ab3ee4c3d1b5e30c0ccf.definition = {
    methods: ["post"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
store125ae0aa7227ab3ee4c3d1b5e30c0ccf.url = (options?: RouteQueryOptions) => {
    return store125ae0aa7227ab3ee4c3d1b5e30c0ccf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
store125ae0aa7227ab3ee4c3d1b5e30c0ccf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
    const store125ae0aa7227ab3ee4c3d1b5e30c0ccfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/api/notificaciones'
 */
        store125ae0aa7227ab3ee4c3d1b5e30c0ccfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store125ae0aa7227ab3ee4c3d1b5e30c0ccf.url(options),
            method: 'post',
        })
    
    store125ae0aa7227ab3ee4c3d1b5e30c0ccf.form = store125ae0aa7227ab3ee4c3d1b5e30c0ccfForm
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
const store04c4bdd06d3f45d53d75d8f0c5bcf645 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
    method: 'post',
})

store04c4bdd06d3f45d53d75d8f0c5bcf645.definition = {
    methods: ["post"],
    url: '/notificaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
store04c4bdd06d3f45d53d75d8f0c5bcf645.url = (options?: RouteQueryOptions) => {
    return store04c4bdd06d3f45d53d75d8f0c5bcf645.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
store04c4bdd06d3f45d53d75d8f0c5bcf645.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
    const store04c4bdd06d3f45d53d75d8f0c5bcf645Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::store
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:156
 * @route '/notificaciones'
 */
        store04c4bdd06d3f45d53d75d8f0c5bcf645Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store04c4bdd06d3f45d53d75d8f0c5bcf645.url(options),
            method: 'post',
        })
    
    store04c4bdd06d3f45d53d75d8f0c5bcf645.form = store04c4bdd06d3f45d53d75d8f0c5bcf645Form

export const store = {
    '/api/notificaciones': store125ae0aa7227ab3ee4c3d1b5e30c0ccf,
    '/notificaciones': store04c4bdd06d3f45d53d75d8f0c5bcf645,
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
export const getRoles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})

getRoles.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/roles/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
getRoles.url = (options?: RouteQueryOptions) => {
    return getRoles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
getRoles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
getRoles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRoles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
    const getRolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRoles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
        getRolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRoles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::getRoles
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:331
 * @route '/api/notificaciones/roles/list'
 */
        getRolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRoles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRoles.form = getRolesForm
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
const show5ec7f86f729e78e97a08fbb4405a3bc1 = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'get',
})

show5ec7f86f729e78e97a08fbb4405a3bc1.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
show5ec7f86f729e78e97a08fbb4405a3bc1.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show5ec7f86f729e78e97a08fbb4405a3bc1.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
show5ec7f86f729e78e97a08fbb4405a3bc1.get = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
show5ec7f86f729e78e97a08fbb4405a3bc1.head = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
    const show5ec7f86f729e78e97a08fbb4405a3bc1Form = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
        show5ec7f86f729e78e97a08fbb4405a3bc1Form.get = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/api/notificaciones/{notificacion}'
 */
        show5ec7f86f729e78e97a08fbb4405a3bc1Form.head = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show5ec7f86f729e78e97a08fbb4405a3bc1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show5ec7f86f729e78e97a08fbb4405a3bc1.form = show5ec7f86f729e78e97a08fbb4405a3bc1Form
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
const show8aa5fa18e1ca0d501594f82288c514e8 = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'get',
})

show8aa5fa18e1ca0d501594f82288c514e8.definition = {
    methods: ["get","head"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
show8aa5fa18e1ca0d501594f82288c514e8.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show8aa5fa18e1ca0d501594f82288c514e8.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
show8aa5fa18e1ca0d501594f82288c514e8.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
show8aa5fa18e1ca0d501594f82288c514e8.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
    const show8aa5fa18e1ca0d501594f82288c514e8Form = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
        show8aa5fa18e1ca0d501594f82288c514e8Form.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::show
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:196
 * @route '/notificaciones/{notificacione}'
 */
        show8aa5fa18e1ca0d501594f82288c514e8Form.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show8aa5fa18e1ca0d501594f82288c514e8.form = show8aa5fa18e1ca0d501594f82288c514e8Form

export const show = {
    '/api/notificaciones/{notificacion}': show5ec7f86f729e78e97a08fbb4405a3bc1,
    '/notificaciones/{notificacione}': show8aa5fa18e1ca0d501594f82288c514e8,
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/api/notificaciones/{notificacion}'
 */
const update5ec7f86f729e78e97a08fbb4405a3bc1 = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'put',
})

update5ec7f86f729e78e97a08fbb4405a3bc1.definition = {
    methods: ["put"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/api/notificaciones/{notificacion}'
 */
update5ec7f86f729e78e97a08fbb4405a3bc1.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update5ec7f86f729e78e97a08fbb4405a3bc1.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/api/notificaciones/{notificacion}'
 */
update5ec7f86f729e78e97a08fbb4405a3bc1.put = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/api/notificaciones/{notificacion}'
 */
    const update5ec7f86f729e78e97a08fbb4405a3bc1Form = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update5ec7f86f729e78e97a08fbb4405a3bc1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/api/notificaciones/{notificacion}'
 */
        update5ec7f86f729e78e97a08fbb4405a3bc1Form.put = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update5ec7f86f729e78e97a08fbb4405a3bc1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update5ec7f86f729e78e97a08fbb4405a3bc1.form = update5ec7f86f729e78e97a08fbb4405a3bc1Form
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
const update8aa5fa18e1ca0d501594f82288c514e8 = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'put',
})

update8aa5fa18e1ca0d501594f82288c514e8.definition = {
    methods: ["put","patch"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
update8aa5fa18e1ca0d501594f82288c514e8.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update8aa5fa18e1ca0d501594f82288c514e8.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
update8aa5fa18e1ca0d501594f82288c514e8.put = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
update8aa5fa18e1ca0d501594f82288c514e8.patch = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
    const update8aa5fa18e1ca0d501594f82288c514e8Form = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
        update8aa5fa18e1ca0d501594f82288c514e8Form.put = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::update
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:250
 * @route '/notificaciones/{notificacione}'
 */
        update8aa5fa18e1ca0d501594f82288c514e8Form.patch = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update8aa5fa18e1ca0d501594f82288c514e8.form = update8aa5fa18e1ca0d501594f82288c514e8Form

export const update = {
    '/api/notificaciones/{notificacion}': update5ec7f86f729e78e97a08fbb4405a3bc1,
    '/notificaciones/{notificacione}': update8aa5fa18e1ca0d501594f82288c514e8,
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/api/notificaciones/{notificacion}'
 */
const destroy5ec7f86f729e78e97a08fbb4405a3bc1 = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'delete',
})

destroy5ec7f86f729e78e97a08fbb4405a3bc1.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/{notificacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/api/notificaciones/{notificacion}'
 */
destroy5ec7f86f729e78e97a08fbb4405a3bc1.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy5ec7f86f729e78e97a08fbb4405a3bc1.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/api/notificaciones/{notificacion}'
 */
destroy5ec7f86f729e78e97a08fbb4405a3bc1.delete = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5ec7f86f729e78e97a08fbb4405a3bc1.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/api/notificaciones/{notificacion}'
 */
    const destroy5ec7f86f729e78e97a08fbb4405a3bc1Form = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy5ec7f86f729e78e97a08fbb4405a3bc1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/api/notificaciones/{notificacion}'
 */
        destroy5ec7f86f729e78e97a08fbb4405a3bc1Form.delete = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy5ec7f86f729e78e97a08fbb4405a3bc1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy5ec7f86f729e78e97a08fbb4405a3bc1.form = destroy5ec7f86f729e78e97a08fbb4405a3bc1Form
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/notificaciones/{notificacione}'
 */
const destroy8aa5fa18e1ca0d501594f82288c514e8 = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'delete',
})

destroy8aa5fa18e1ca0d501594f82288c514e8.definition = {
    methods: ["delete"],
    url: '/notificaciones/{notificacione}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/notificaciones/{notificacione}'
 */
destroy8aa5fa18e1ca0d501594f82288c514e8.url = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy8aa5fa18e1ca0d501594f82288c514e8.definition.url
            .replace('{notificacione}', parsedArgs.notificacione.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/notificaciones/{notificacione}'
 */
destroy8aa5fa18e1ca0d501594f82288c514e8.delete = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8aa5fa18e1ca0d501594f82288c514e8.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/notificaciones/{notificacione}'
 */
    const destroy8aa5fa18e1ca0d501594f82288c514e8Form = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::destroy
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:305
 * @route '/notificaciones/{notificacione}'
 */
        destroy8aa5fa18e1ca0d501594f82288c514e8Form.delete = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy8aa5fa18e1ca0d501594f82288c514e8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy8aa5fa18e1ca0d501594f82288c514e8.form = destroy8aa5fa18e1ca0d501594f82288c514e8Form

export const destroy = {
    '/api/notificaciones/{notificacion}': destroy5ec7f86f729e78e97a08fbb4405a3bc1,
    '/notificaciones/{notificacione}': destroy8aa5fa18e1ca0d501594f82288c514e8,
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
const enviarManual662a6437ff13c9d2a79569ce57de03f4 = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarManual662a6437ff13c9d2a79569ce57de03f4.url(args, options),
    method: 'post',
})

enviarManual662a6437ff13c9d2a79569ce57de03f4.definition = {
    methods: ["post"],
    url: '/api/notificaciones/{notificacion}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
enviarManual662a6437ff13c9d2a79569ce57de03f4.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return enviarManual662a6437ff13c9d2a79569ce57de03f4.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
enviarManual662a6437ff13c9d2a79569ce57de03f4.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarManual662a6437ff13c9d2a79569ce57de03f4.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
    const enviarManual662a6437ff13c9d2a79569ce57de03f4Form = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviarManual662a6437ff13c9d2a79569ce57de03f4.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/api/notificaciones/{notificacion}/enviar'
 */
        enviarManual662a6437ff13c9d2a79569ce57de03f4Form.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviarManual662a6437ff13c9d2a79569ce57de03f4.url(args, options),
            method: 'post',
        })
    
    enviarManual662a6437ff13c9d2a79569ce57de03f4.form = enviarManual662a6437ff13c9d2a79569ce57de03f4Form
    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/notificaciones/{notificacion}/enviar'
 */
const enviarManual3b1a1576a97e9463165c4263333bf2ae = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarManual3b1a1576a97e9463165c4263333bf2ae.url(args, options),
    method: 'post',
})

enviarManual3b1a1576a97e9463165c4263333bf2ae.definition = {
    methods: ["post"],
    url: '/notificaciones/{notificacion}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/notificaciones/{notificacion}/enviar'
 */
enviarManual3b1a1576a97e9463165c4263333bf2ae.url = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return enviarManual3b1a1576a97e9463165c4263333bf2ae.definition.url
            .replace('{notificacion}', parsedArgs.notificacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/notificaciones/{notificacion}/enviar'
 */
enviarManual3b1a1576a97e9463165c4263333bf2ae.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarManual3b1a1576a97e9463165c4263333bf2ae.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/notificaciones/{notificacion}/enviar'
 */
    const enviarManual3b1a1576a97e9463165c4263333bf2aeForm = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviarManual3b1a1576a97e9463165c4263333bf2ae.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::enviarManual
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:361
 * @route '/notificaciones/{notificacion}/enviar'
 */
        enviarManual3b1a1576a97e9463165c4263333bf2aeForm.post = (args: { notificacion: string | number } | [notificacion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviarManual3b1a1576a97e9463165c4263333bf2ae.url(args, options),
            method: 'post',
        })
    
    enviarManual3b1a1576a97e9463165c4263333bf2ae.form = enviarManual3b1a1576a97e9463165c4263333bf2aeForm

export const enviarManual = {
    '/api/notificaciones/{notificacion}/enviar': enviarManual662a6437ff13c9d2a79569ce57de03f4,
    '/notificaciones/{notificacion}/enviar': enviarManual3b1a1576a97e9463165c4263333bf2ae,
}

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
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
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
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
 * @route '/notificaciones/{notificacione}/edit'
 */
edit.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
 * @route '/notificaciones/{notificacione}/edit'
 */
edit.head = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
 * @route '/notificaciones/{notificacione}/edit'
 */
    const editForm = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
 * @route '/notificaciones/{notificacione}/edit'
 */
        editForm.get = (args: { notificacione: string | number } | [notificacione: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificacionRecurrenteController::edit
 * @see app/Http/Controllers/NotificacionRecurrenteController.php:208
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
const NotificacionRecurrenteController = { indexPublic, index, store, getRoles, show, update, destroy, enviarManual, create, edit }

export default NotificacionRecurrenteController