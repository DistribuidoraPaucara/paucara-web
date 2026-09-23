import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tipos-precio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoPrecioController::index
 * @see app/Http/Controllers/TipoPrecioController.php:12
 * @route '/tipos-precio'
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
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tipos-precio/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoPrecioController::create
 * @see app/Http/Controllers/TipoPrecioController.php:39
 * @route '/tipos-precio/create'
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
* @see \App\Http\Controllers\TipoPrecioController::store
 * @see app/Http/Controllers/TipoPrecioController.php:47
 * @route '/tipos-precio'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tipos-precio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::store
 * @see app/Http/Controllers/TipoPrecioController.php:47
 * @route '/tipos-precio'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::store
 * @see app/Http/Controllers/TipoPrecioController.php:47
 * @route '/tipos-precio'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::store
 * @see app/Http/Controllers/TipoPrecioController.php:47
 * @route '/tipos-precio'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::store
 * @see app/Http/Controllers/TipoPrecioController.php:47
 * @route '/tipos-precio'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
export const show = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tipos-precio/{tipoPrecio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
show.url = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPrecio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoPrecio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoPrecio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPrecio: typeof args.tipoPrecio === 'object'
                ? args.tipoPrecio.id
                : args.tipoPrecio,
                }

    return show.definition.url
            .replace('{tipoPrecio}', parsedArgs.tipoPrecio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
show.get = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
show.head = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
    const showForm = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
        showForm.get = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoPrecioController::show
 * @see app/Http/Controllers/TipoPrecioController.php:89
 * @route '/tipos-precio/{tipoPrecio}'
 */
        showForm.head = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
export const edit = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tipos-precio/{tipoPrecio}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
edit.url = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPrecio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoPrecio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoPrecio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPrecio: typeof args.tipoPrecio === 'object'
                ? args.tipoPrecio.id
                : args.tipoPrecio,
                }

    return edit.definition.url
            .replace('{tipoPrecio}', parsedArgs.tipoPrecio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
edit.get = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
edit.head = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
    const editForm = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
        editForm.get = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoPrecioController::edit
 * @see app/Http/Controllers/TipoPrecioController.php:110
 * @route '/tipos-precio/{tipoPrecio}/edit'
 */
        editForm.head = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
export const update = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tipos-precio/{tipoPrecio}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
update.url = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPrecio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoPrecio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoPrecio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPrecio: typeof args.tipoPrecio === 'object'
                ? args.tipoPrecio.id
                : args.tipoPrecio,
                }

    return update.definition.url
            .replace('{tipoPrecio}', parsedArgs.tipoPrecio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
update.put = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
update.patch = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
    const updateForm = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
        updateForm.put = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TipoPrecioController::update
 * @see app/Http/Controllers/TipoPrecioController.php:119
 * @route '/tipos-precio/{tipoPrecio}'
 */
        updateForm.patch = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TipoPrecioController::destroy
 * @see app/Http/Controllers/TipoPrecioController.php:164
 * @route '/tipos-precio/{tipoPrecio}'
 */
export const destroy = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tipos-precio/{tipoPrecio}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::destroy
 * @see app/Http/Controllers/TipoPrecioController.php:164
 * @route '/tipos-precio/{tipoPrecio}'
 */
destroy.url = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPrecio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoPrecio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoPrecio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPrecio: typeof args.tipoPrecio === 'object'
                ? args.tipoPrecio.id
                : args.tipoPrecio,
                }

    return destroy.definition.url
            .replace('{tipoPrecio}', parsedArgs.tipoPrecio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::destroy
 * @see app/Http/Controllers/TipoPrecioController.php:164
 * @route '/tipos-precio/{tipoPrecio}'
 */
destroy.delete = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::destroy
 * @see app/Http/Controllers/TipoPrecioController.php:164
 * @route '/tipos-precio/{tipoPrecio}'
 */
    const destroyForm = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::destroy
 * @see app/Http/Controllers/TipoPrecioController.php:164
 * @route '/tipos-precio/{tipoPrecio}'
 */
        destroyForm.delete = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TipoPrecioController::toggleActivo
 * @see app/Http/Controllers/TipoPrecioController.php:180
 * @route '/tipos-precio/{tipoPrecio}/toggle-activo'
 */
export const toggleActivo = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

toggleActivo.definition = {
    methods: ["patch"],
    url: '/tipos-precio/{tipoPrecio}/toggle-activo',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\TipoPrecioController::toggleActivo
 * @see app/Http/Controllers/TipoPrecioController.php:180
 * @route '/tipos-precio/{tipoPrecio}/toggle-activo'
 */
toggleActivo.url = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPrecio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoPrecio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoPrecio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPrecio: typeof args.tipoPrecio === 'object'
                ? args.tipoPrecio.id
                : args.tipoPrecio,
                }

    return toggleActivo.definition.url
            .replace('{tipoPrecio}', parsedArgs.tipoPrecio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPrecioController::toggleActivo
 * @see app/Http/Controllers/TipoPrecioController.php:180
 * @route '/tipos-precio/{tipoPrecio}/toggle-activo'
 */
toggleActivo.patch = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoPrecioController::toggleActivo
 * @see app/Http/Controllers/TipoPrecioController.php:180
 * @route '/tipos-precio/{tipoPrecio}/toggle-activo'
 */
    const toggleActivoForm = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActivo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoPrecioController::toggleActivo
 * @see app/Http/Controllers/TipoPrecioController.php:180
 * @route '/tipos-precio/{tipoPrecio}/toggle-activo'
 */
        toggleActivoForm.patch = (args: { tipoPrecio: number | { id: number } } | [tipoPrecio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActivo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActivo.form = toggleActivoForm
const TipoPrecioController = { index, create, store, show, edit, update, destroy, toggleActivo }

export default TipoPrecioController