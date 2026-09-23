import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
export const index = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return index.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
    const indexForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
        indexForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
        indexForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
export const create = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return create.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
    const createForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
        createForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
        createForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
export const store = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
store.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return store.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
store.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
    const storeForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
        storeForm.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
export const show = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return show.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
    const showForm = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
        showForm.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
        showForm.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
export const edit = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/{foto}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return edit.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
    const editForm = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
        editForm.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
        editForm.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
export const update = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
update.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return update.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
update.put = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
    const updateForm = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
        updateForm.put = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
export const destroy = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
destroy.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return destroy.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
destroy.delete = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
    const destroyForm = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
        destroyForm.delete = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const fotos = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default fotos