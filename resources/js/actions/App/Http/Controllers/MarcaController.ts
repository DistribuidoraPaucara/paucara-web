import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/marcas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarcaController::index
 * @see app/Http/Controllers/MarcaController.php:130
 * @route '/marcas'
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
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/marcas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarcaController::create
 * @see app/Http/Controllers/MarcaController.php:162
 * @route '/marcas/create'
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
* @see \App\Http\Controllers\MarcaController::store
 * @see app/Http/Controllers/MarcaController.php:177
 * @route '/marcas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/marcas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MarcaController::store
 * @see app/Http/Controllers/MarcaController.php:177
 * @route '/marcas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::store
 * @see app/Http/Controllers/MarcaController.php:177
 * @route '/marcas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MarcaController::store
 * @see app/Http/Controllers/MarcaController.php:177
 * @route '/marcas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MarcaController::store
 * @see app/Http/Controllers/MarcaController.php:177
 * @route '/marcas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
export const show = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/marcas/{marca}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
show.url = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { marca: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    marca: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        marca: args.marca,
                }

    return show.definition.url
            .replace('{marca}', parsedArgs.marca.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
show.get = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
show.head = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
    const showForm = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
        showForm.get = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarcaController::show
 * @see app/Http/Controllers/MarcaController.php:0
 * @route '/marcas/{marca}'
 */
        showForm.head = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
export const edit = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/marcas/{marca}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
edit.url = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { marca: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    marca: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        marca: args.marca,
                }

    return edit.definition.url
            .replace('{marca}', parsedArgs.marca.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
edit.get = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
edit.head = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
    const editForm = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
        editForm.get = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarcaController::edit
 * @see app/Http/Controllers/MarcaController.php:203
 * @route '/marcas/{marca}/edit'
 */
        editForm.head = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
export const update = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/marcas/{marca}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
update.url = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { marca: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    marca: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        marca: args.marca,
                }

    return update.definition.url
            .replace('{marca}', parsedArgs.marca.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
update.put = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
update.patch = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
    const updateForm = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
        updateForm.put = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\MarcaController::update
 * @see app/Http/Controllers/MarcaController.php:222
 * @route '/marcas/{marca}'
 */
        updateForm.patch = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MarcaController::destroy
 * @see app/Http/Controllers/MarcaController.php:244
 * @route '/marcas/{marca}'
 */
export const destroy = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/marcas/{marca}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MarcaController::destroy
 * @see app/Http/Controllers/MarcaController.php:244
 * @route '/marcas/{marca}'
 */
destroy.url = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { marca: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    marca: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        marca: args.marca,
                }

    return destroy.definition.url
            .replace('{marca}', parsedArgs.marca.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarcaController::destroy
 * @see app/Http/Controllers/MarcaController.php:244
 * @route '/marcas/{marca}'
 */
destroy.delete = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MarcaController::destroy
 * @see app/Http/Controllers/MarcaController.php:244
 * @route '/marcas/{marca}'
 */
    const destroyForm = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MarcaController::destroy
 * @see app/Http/Controllers/MarcaController.php:244
 * @route '/marcas/{marca}'
 */
        destroyForm.delete = (args: { marca: string | number } | [marca: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const MarcaController = { index, create, store, show, edit, update, destroy }

export default MarcaController