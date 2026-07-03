import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/tipos-ajuste-inventario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::index
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:13
 * @route '/inventario/tipos-ajuste-inventario'
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
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inventario/tipos-ajuste-inventario/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::create
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:33
 * @route '/inventario/tipos-ajuste-inventario/create'
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
* @see \App\Http\Controllers\TipoAjusteInventarioController::store
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:40
 * @route '/inventario/tipos-ajuste-inventario'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/tipos-ajuste-inventario',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::store
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:40
 * @route '/inventario/tipos-ajuste-inventario'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::store
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:40
 * @route '/inventario/tipos-ajuste-inventario'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::store
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:40
 * @route '/inventario/tipos-ajuste-inventario'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::store
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:40
 * @route '/inventario/tipos-ajuste-inventario'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
export const show = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
show.url = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoAjusteInventario: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoAjusteInventario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoAjusteInventario: args.tipoAjusteInventario,
                }

    return show.definition.url
            .replace('{tipoAjusteInventario}', parsedArgs.tipoAjusteInventario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
show.get = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
show.head = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
    const showForm = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
        showForm.get = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::show
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:0
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
        showForm.head = (args: { tipoAjusteInventario: string | number } | [tipoAjusteInventario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
export const edit = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
edit.url = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoAjusteInventario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoAjusteInventario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoAjusteInventario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoAjusteInventario: typeof args.tipoAjusteInventario === 'object'
                ? args.tipoAjusteInventario.id
                : args.tipoAjusteInventario,
                }

    return edit.definition.url
            .replace('{tipoAjusteInventario}', parsedArgs.tipoAjusteInventario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
edit.get = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
edit.head = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
    const editForm = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
        editForm.get = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::edit
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:54
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}/edit'
 */
        editForm.head = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
export const update = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
update.url = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoAjusteInventario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoAjusteInventario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoAjusteInventario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoAjusteInventario: typeof args.tipoAjusteInventario === 'object'
                ? args.tipoAjusteInventario.id
                : args.tipoAjusteInventario,
                }

    return update.definition.url
            .replace('{tipoAjusteInventario}', parsedArgs.tipoAjusteInventario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
update.put = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
update.patch = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
    const updateForm = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
        updateForm.put = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::update
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:61
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
        updateForm.patch = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TipoAjusteInventarioController::destroy
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:74
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
export const destroy = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::destroy
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:74
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
destroy.url = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoAjusteInventario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoAjusteInventario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoAjusteInventario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoAjusteInventario: typeof args.tipoAjusteInventario === 'object'
                ? args.tipoAjusteInventario.id
                : args.tipoAjusteInventario,
                }

    return destroy.definition.url
            .replace('{tipoAjusteInventario}', parsedArgs.tipoAjusteInventario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoAjusteInventarioController::destroy
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:74
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
destroy.delete = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::destroy
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:74
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
    const destroyForm = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoAjusteInventarioController::destroy
 * @see app/Http/Controllers/TipoAjusteInventarioController.php:74
 * @route '/inventario/tipos-ajuste-inventario/{tipoAjusteInventario}'
 */
        destroyForm.delete = (args: { tipoAjusteInventario: number | { id: number } } | [tipoAjusteInventario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TipoAjusteInventarioController = { index, create, store, show, edit, update, destroy }

export default TipoAjusteInventarioController