import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/almacenes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenController::index
 * @see app/Http/Controllers/AlmacenController.php:52
 * @route '/almacenes'
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
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/almacenes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenController::create
 * @see app/Http/Controllers/AlmacenController.php:162
 * @route '/almacenes/create'
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
* @see \App\Http\Controllers\AlmacenController::store
 * @see app/Http/Controllers/AlmacenController.php:177
 * @route '/almacenes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/almacenes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlmacenController::store
 * @see app/Http/Controllers/AlmacenController.php:177
 * @route '/almacenes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::store
 * @see app/Http/Controllers/AlmacenController.php:177
 * @route '/almacenes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AlmacenController::store
 * @see app/Http/Controllers/AlmacenController.php:177
 * @route '/almacenes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::store
 * @see app/Http/Controllers/AlmacenController.php:177
 * @route '/almacenes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
export const show = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/almacenes/{almacene}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
show.url = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacene: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacene: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacene: args.almacene,
                }

    return show.definition.url
            .replace('{almacene}', parsedArgs.almacene.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
show.get = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
show.head = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
    const showForm = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
        showForm.get = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenController::show
 * @see app/Http/Controllers/AlmacenController.php:0
 * @route '/almacenes/{almacene}'
 */
        showForm.head = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
export const edit = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/almacenes/{almacene}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
edit.url = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacene: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacene: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacene: args.almacene,
                }

    return edit.definition.url
            .replace('{almacene}', parsedArgs.almacene.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
edit.get = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
edit.head = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
    const editForm = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
        editForm.get = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenController::edit
 * @see app/Http/Controllers/AlmacenController.php:203
 * @route '/almacenes/{almacene}/edit'
 */
        editForm.head = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
export const update = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/almacenes/{almacene}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
update.url = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacene: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacene: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacene: args.almacene,
                }

    return update.definition.url
            .replace('{almacene}', parsedArgs.almacene.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
update.put = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
update.patch = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
    const updateForm = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
        updateForm.put = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\AlmacenController::update
 * @see app/Http/Controllers/AlmacenController.php:222
 * @route '/almacenes/{almacene}'
 */
        updateForm.patch = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AlmacenController::destroy
 * @see app/Http/Controllers/AlmacenController.php:244
 * @route '/almacenes/{almacene}'
 */
export const destroy = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/almacenes/{almacene}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AlmacenController::destroy
 * @see app/Http/Controllers/AlmacenController.php:244
 * @route '/almacenes/{almacene}'
 */
destroy.url = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacene: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacene: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacene: args.almacene,
                }

    return destroy.definition.url
            .replace('{almacene}', parsedArgs.almacene.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenController::destroy
 * @see app/Http/Controllers/AlmacenController.php:244
 * @route '/almacenes/{almacene}'
 */
destroy.delete = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AlmacenController::destroy
 * @see app/Http/Controllers/AlmacenController.php:244
 * @route '/almacenes/{almacene}'
 */
    const destroyForm = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenController::destroy
 * @see app/Http/Controllers/AlmacenController.php:244
 * @route '/almacenes/{almacene}'
 */
        destroyForm.delete = (args: { almacene: string | number } | [almacene: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AlmacenController = { index, create, store, show, edit, update, destroy }

export default AlmacenController