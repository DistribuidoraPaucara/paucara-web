import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/almacenes-prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenPrestableController::index
 * @see app/Http/Controllers/AlmacenPrestableController.php:130
 * @route '/almacenes-prestables'
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
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/almacenes-prestables/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenPrestableController::create
 * @see app/Http/Controllers/AlmacenPrestableController.php:162
 * @route '/almacenes-prestables/create'
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
* @see \App\Http\Controllers\AlmacenPrestableController::store
 * @see app/Http/Controllers/AlmacenPrestableController.php:177
 * @route '/almacenes-prestables'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/almacenes-prestables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::store
 * @see app/Http/Controllers/AlmacenPrestableController.php:177
 * @route '/almacenes-prestables'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::store
 * @see app/Http/Controllers/AlmacenPrestableController.php:177
 * @route '/almacenes-prestables'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::store
 * @see app/Http/Controllers/AlmacenPrestableController.php:177
 * @route '/almacenes-prestables'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::store
 * @see app/Http/Controllers/AlmacenPrestableController.php:177
 * @route '/almacenes-prestables'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
export const show = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/almacenes-prestables/{almacenes_prestable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
show.url = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenes_prestable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenes_prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenes_prestable: args.almacenes_prestable,
                }

    return show.definition.url
            .replace('{almacenes_prestable}', parsedArgs.almacenes_prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
show.get = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
show.head = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
    const showForm = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
        showForm.get = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenPrestableController::show
 * @see app/Http/Controllers/AlmacenPrestableController.php:0
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
        showForm.head = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
export const edit = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/almacenes-prestables/{almacenes_prestable}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
edit.url = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenes_prestable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenes_prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenes_prestable: args.almacenes_prestable,
                }

    return edit.definition.url
            .replace('{almacenes_prestable}', parsedArgs.almacenes_prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
edit.get = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
edit.head = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
    const editForm = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
        editForm.get = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AlmacenPrestableController::edit
 * @see app/Http/Controllers/AlmacenPrestableController.php:203
 * @route '/almacenes-prestables/{almacenes_prestable}/edit'
 */
        editForm.head = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
export const update = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/almacenes-prestables/{almacenes_prestable}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
update.url = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenes_prestable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenes_prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenes_prestable: args.almacenes_prestable,
                }

    return update.definition.url
            .replace('{almacenes_prestable}', parsedArgs.almacenes_prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
update.put = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
update.patch = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
    const updateForm = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
        updateForm.put = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\AlmacenPrestableController::update
 * @see app/Http/Controllers/AlmacenPrestableController.php:222
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
        updateForm.patch = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AlmacenPrestableController::destroy
 * @see app/Http/Controllers/AlmacenPrestableController.php:244
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
export const destroy = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/almacenes-prestables/{almacenes_prestable}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AlmacenPrestableController::destroy
 * @see app/Http/Controllers/AlmacenPrestableController.php:244
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
destroy.url = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenes_prestable: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenes_prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenes_prestable: args.almacenes_prestable,
                }

    return destroy.definition.url
            .replace('{almacenes_prestable}', parsedArgs.almacenes_prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlmacenPrestableController::destroy
 * @see app/Http/Controllers/AlmacenPrestableController.php:244
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
destroy.delete = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AlmacenPrestableController::destroy
 * @see app/Http/Controllers/AlmacenPrestableController.php:244
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
    const destroyForm = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AlmacenPrestableController::destroy
 * @see app/Http/Controllers/AlmacenPrestableController.php:244
 * @route '/almacenes-prestables/{almacenes_prestable}'
 */
        destroyForm.delete = (args: { almacenes_prestable: string | number } | [almacenes_prestable: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AlmacenPrestableController = { index, create, store, show, edit, update, destroy }

export default AlmacenPrestableController