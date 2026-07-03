import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/vehiculos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
    const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
        apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VehiculoController::apiIndex
 * @see app/Http/Controllers/VehiculoController.php:149
 * @route '/api/vehiculos'
 */
        apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiIndex.form = apiIndexForm
/**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
export const apiShow = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiShow.url(args, options),
    method: 'get',
})

apiShow.definition = {
    methods: ["get","head"],
    url: '/api/vehiculos/{vehiculo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
apiShow.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return apiShow.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
apiShow.get = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiShow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
apiShow.head = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiShow.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
    const apiShowForm = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiShow.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
        apiShowForm.get = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiShow.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VehiculoController::apiShow
 * @see app/Http/Controllers/VehiculoController.php:156
 * @route '/api/vehiculos/{vehiculo}'
 */
        apiShowForm.head = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiShow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiShow.form = apiShowForm
/**
* @see \App\Http\Controllers\VehiculoController::apiSugerir
 * @see app/Http/Controllers/VehiculoController.php:172
 * @route '/api/vehiculos/sugerir'
 */
export const apiSugerir = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiSugerir.url(options),
    method: 'post',
})

apiSugerir.definition = {
    methods: ["post"],
    url: '/api/vehiculos/sugerir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VehiculoController::apiSugerir
 * @see app/Http/Controllers/VehiculoController.php:172
 * @route '/api/vehiculos/sugerir'
 */
apiSugerir.url = (options?: RouteQueryOptions) => {
    return apiSugerir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::apiSugerir
 * @see app/Http/Controllers/VehiculoController.php:172
 * @route '/api/vehiculos/sugerir'
 */
apiSugerir.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiSugerir.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VehiculoController::apiSugerir
 * @see app/Http/Controllers/VehiculoController.php:172
 * @route '/api/vehiculos/sugerir'
 */
    const apiSugerirForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apiSugerir.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::apiSugerir
 * @see app/Http/Controllers/VehiculoController.php:172
 * @route '/api/vehiculos/sugerir'
 */
        apiSugerirForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apiSugerir.url(options),
            method: 'post',
        })
    
    apiSugerir.form = apiSugerirForm
/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
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
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
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
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/vehiculos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
export const edit = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos/{vehiculo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return edit.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.get = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.head = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
    const editForm = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
        editForm.get = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
        editForm.head = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
export const update = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/inventario/vehiculos/{vehiculo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
update.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return update.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
update.put = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
    const updateForm = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
        updateForm.put = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
export const destroy = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/inventario/vehiculos/{vehiculo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
destroy.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return destroy.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
destroy.delete = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
    const destroyForm = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
        destroyForm.delete = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const VehiculoController = { apiIndex, apiShow, apiSugerir, index, create, store, edit, update, destroy }

export default VehiculoController