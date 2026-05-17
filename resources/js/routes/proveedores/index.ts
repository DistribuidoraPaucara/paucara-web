import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::index
 * @see app/Http/Controllers/ProveedorController.php:17
 * @route '/proveedores'
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
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/proveedores/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::create
 * @see app/Http/Controllers/ProveedorController.php:119
 * @route '/proveedores/create'
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
* @see \App\Http\Controllers\ProveedorController::store
 * @see app/Http/Controllers/ProveedorController.php:126
 * @route '/proveedores'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/proveedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProveedorController::store
 * @see app/Http/Controllers/ProveedorController.php:126
 * @route '/proveedores'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::store
 * @see app/Http/Controllers/ProveedorController.php:126
 * @route '/proveedores'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProveedorController::store
 * @see app/Http/Controllers/ProveedorController.php:126
 * @route '/proveedores'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::store
 * @see app/Http/Controllers/ProveedorController.php:126
 * @route '/proveedores'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
export const show = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/proveedores/{proveedore}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
show.url = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proveedore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedore: args.proveedore,
                }

    return show.definition.url
            .replace('{proveedore}', parsedArgs.proveedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
show.get = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
show.head = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
    const showForm = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
        showForm.get = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::show
 * @see app/Http/Controllers/ProveedorController.php:0
 * @route '/proveedores/{proveedore}'
 */
        showForm.head = (args: { proveedore: string | number } | [proveedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
export const edit = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/proveedores/{proveedore}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
edit.url = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedore: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proveedore: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proveedore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedore: typeof args.proveedore === 'object'
                ? args.proveedore.id
                : args.proveedore,
                }

    return edit.definition.url
            .replace('{proveedore}', parsedArgs.proveedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
edit.get = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
edit.head = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
    const editForm = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
        editForm.get = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::edit
 * @see app/Http/Controllers/ProveedorController.php:209
 * @route '/proveedores/{proveedore}/edit'
 */
        editForm.head = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
export const update = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/proveedores/{proveedore}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
update.url = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedore: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proveedore: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proveedore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedore: typeof args.proveedore === 'object'
                ? args.proveedore.id
                : args.proveedore,
                }

    return update.definition.url
            .replace('{proveedore}', parsedArgs.proveedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
update.put = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
update.patch = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
    const updateForm = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
        updateForm.put = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::update
 * @see app/Http/Controllers/ProveedorController.php:216
 * @route '/proveedores/{proveedore}'
 */
        updateForm.patch = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProveedorController::destroy
 * @see app/Http/Controllers/ProveedorController.php:260
 * @route '/proveedores/{proveedore}'
 */
export const destroy = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/proveedores/{proveedore}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProveedorController::destroy
 * @see app/Http/Controllers/ProveedorController.php:260
 * @route '/proveedores/{proveedore}'
 */
destroy.url = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedore: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proveedore: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proveedore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedore: typeof args.proveedore === 'object'
                ? args.proveedore.id
                : args.proveedore,
                }

    return destroy.definition.url
            .replace('{proveedore}', parsedArgs.proveedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::destroy
 * @see app/Http/Controllers/ProveedorController.php:260
 * @route '/proveedores/{proveedore}'
 */
destroy.delete = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProveedorController::destroy
 * @see app/Http/Controllers/ProveedorController.php:260
 * @route '/proveedores/{proveedore}'
 */
    const destroyForm = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::destroy
 * @see app/Http/Controllers/ProveedorController.php:260
 * @route '/proveedores/{proveedore}'
 */
        destroyForm.delete = (args: { proveedore: number | { id: number } } | [proveedore: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const proveedores = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default proveedores