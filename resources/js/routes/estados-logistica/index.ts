import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/estados-logistica',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosLogisticaController::index
 * @see app/Http/Controllers/EstadosLogisticaController.php:130
 * @route '/estados-logistica'
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
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/estados-logistica/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosLogisticaController::create
 * @see app/Http/Controllers/EstadosLogisticaController.php:162
 * @route '/estados-logistica/create'
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
* @see \App\Http\Controllers\EstadosLogisticaController::store
 * @see app/Http/Controllers/EstadosLogisticaController.php:177
 * @route '/estados-logistica'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/estados-logistica',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::store
 * @see app/Http/Controllers/EstadosLogisticaController.php:177
 * @route '/estados-logistica'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::store
 * @see app/Http/Controllers/EstadosLogisticaController.php:177
 * @route '/estados-logistica'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::store
 * @see app/Http/Controllers/EstadosLogisticaController.php:177
 * @route '/estados-logistica'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::store
 * @see app/Http/Controllers/EstadosLogisticaController.php:177
 * @route '/estados-logistica'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
export const show = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/estados-logistica/{estados_logistica}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
show.url = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_logistica: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_logistica: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_logistica: args.estados_logistica,
                }

    return show.definition.url
            .replace('{estados_logistica}', parsedArgs.estados_logistica.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
show.get = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
show.head = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
    const showForm = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
        showForm.get = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosLogisticaController::show
 * @see app/Http/Controllers/EstadosLogisticaController.php:0
 * @route '/estados-logistica/{estados_logistica}'
 */
        showForm.head = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
export const edit = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/estados-logistica/{estados_logistica}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
edit.url = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_logistica: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_logistica: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_logistica: args.estados_logistica,
                }

    return edit.definition.url
            .replace('{estados_logistica}', parsedArgs.estados_logistica.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
edit.get = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
edit.head = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
    const editForm = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
        editForm.get = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosLogisticaController::edit
 * @see app/Http/Controllers/EstadosLogisticaController.php:203
 * @route '/estados-logistica/{estados_logistica}/edit'
 */
        editForm.head = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
export const update = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/estados-logistica/{estados_logistica}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
update.url = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_logistica: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_logistica: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_logistica: args.estados_logistica,
                }

    return update.definition.url
            .replace('{estados_logistica}', parsedArgs.estados_logistica.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
update.put = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
update.patch = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
    const updateForm = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
        updateForm.put = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EstadosLogisticaController::update
 * @see app/Http/Controllers/EstadosLogisticaController.php:222
 * @route '/estados-logistica/{estados_logistica}'
 */
        updateForm.patch = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EstadosLogisticaController::destroy
 * @see app/Http/Controllers/EstadosLogisticaController.php:244
 * @route '/estados-logistica/{estados_logistica}'
 */
export const destroy = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/estados-logistica/{estados_logistica}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EstadosLogisticaController::destroy
 * @see app/Http/Controllers/EstadosLogisticaController.php:244
 * @route '/estados-logistica/{estados_logistica}'
 */
destroy.url = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_logistica: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_logistica: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_logistica: args.estados_logistica,
                }

    return destroy.definition.url
            .replace('{estados_logistica}', parsedArgs.estados_logistica.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosLogisticaController::destroy
 * @see app/Http/Controllers/EstadosLogisticaController.php:244
 * @route '/estados-logistica/{estados_logistica}'
 */
destroy.delete = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EstadosLogisticaController::destroy
 * @see app/Http/Controllers/EstadosLogisticaController.php:244
 * @route '/estados-logistica/{estados_logistica}'
 */
    const destroyForm = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosLogisticaController::destroy
 * @see app/Http/Controllers/EstadosLogisticaController.php:244
 * @route '/estados-logistica/{estados_logistica}'
 */
        destroyForm.delete = (args: { estados_logistica: string | number } | [estados_logistica: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const estadosLogistica = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default estadosLogistica