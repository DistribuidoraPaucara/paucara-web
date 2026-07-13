import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/empleados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
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
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/empleados/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
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
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/empleados',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
export const show = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return show.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
    const showForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
        showForm.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
        showForm.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
export const edit = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/empleados/{empleado}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return edit.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
    const editForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
        editForm.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
        editForm.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
export const update = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return update.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.put = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
    const updateForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
        updateForm.put = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
        updateForm.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
export const destroy = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
destroy.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return destroy.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
destroy.delete = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
    const destroyForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
        destroyForm.delete = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
export const toggleEstado = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleEstado.url(args, options),
    method: 'patch',
})

toggleEstado.definition = {
    methods: ["patch"],
    url: '/empleados/{empleado}/toggle-estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
toggleEstado.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return toggleEstado.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
toggleEstado.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
    const toggleEstadoForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
        toggleEstadoForm.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleEstado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleEstado.form = toggleEstadoForm
/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
export const toggleAccesoSistema = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAccesoSistema.url(args, options),
    method: 'patch',
})

toggleAccesoSistema.definition = {
    methods: ["patch"],
    url: '/empleados/{empleado}/toggle-acceso-sistema',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
toggleAccesoSistema.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return toggleAccesoSistema.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
toggleAccesoSistema.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAccesoSistema.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
    const toggleAccesoSistemaForm = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAccesoSistema.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
        toggleAccesoSistemaForm.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAccesoSistema.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleAccesoSistema.form = toggleAccesoSistemaForm
/**
* @see \App\Http\Controllers\EmpleadoController::crearEmpleadoRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
export const crearEmpleadoRapido = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearEmpleadoRapido.url(options),
    method: 'post',
})

crearEmpleadoRapido.definition = {
    methods: ["post"],
    url: '/empleados/crear-rapido',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::crearEmpleadoRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
crearEmpleadoRapido.url = (options?: RouteQueryOptions) => {
    return crearEmpleadoRapido.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::crearEmpleadoRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
crearEmpleadoRapido.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearEmpleadoRapido.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::crearEmpleadoRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
    const crearEmpleadoRapidoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearEmpleadoRapido.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::crearEmpleadoRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
        crearEmpleadoRapidoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearEmpleadoRapido.url(options),
            method: 'post',
        })
    
    crearEmpleadoRapido.form = crearEmpleadoRapidoForm
/**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
export const getDepartamentos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDepartamentos.url(options),
    method: 'get',
})

getDepartamentos.definition = {
    methods: ["get","head"],
    url: '/empleados-data/departamentos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
getDepartamentos.url = (options?: RouteQueryOptions) => {
    return getDepartamentos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
getDepartamentos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDepartamentos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
getDepartamentos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDepartamentos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
    const getDepartamentosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDepartamentos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
        getDepartamentosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDepartamentos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::getDepartamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
        getDepartamentosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDepartamentos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDepartamentos.form = getDepartamentosForm
/**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
export const getTiposContrato = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTiposContrato.url(options),
    method: 'get',
})

getTiposContrato.definition = {
    methods: ["get","head"],
    url: '/empleados-data/tipos-contrato',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
getTiposContrato.url = (options?: RouteQueryOptions) => {
    return getTiposContrato.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
getTiposContrato.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTiposContrato.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
getTiposContrato.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTiposContrato.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
    const getTiposContratoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTiposContrato.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
        getTiposContratoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTiposContrato.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::getTiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
        getTiposContratoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTiposContrato.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTiposContrato.form = getTiposContratoForm
/**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
export const getEstados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getEstados.url(options),
    method: 'get',
})

getEstados.definition = {
    methods: ["get","head"],
    url: '/empleados-data/estados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
getEstados.url = (options?: RouteQueryOptions) => {
    return getEstados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
getEstados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getEstados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
getEstados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getEstados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
    const getEstadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getEstados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
        getEstadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getEstados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::getEstados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
        getEstadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getEstados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getEstados.form = getEstadosForm
/**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
export const getSupervisores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisores.url(options),
    method: 'get',
})

getSupervisores.definition = {
    methods: ["get","head"],
    url: '/empleados-data/supervisores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
getSupervisores.url = (options?: RouteQueryOptions) => {
    return getSupervisores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
getSupervisores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSupervisores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
getSupervisores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSupervisores.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
    const getSupervisoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSupervisores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
        getSupervisoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::getSupervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
        getSupervisoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSupervisores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSupervisores.form = getSupervisoresForm
/**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
export const getRoles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})

getRoles.definition = {
    methods: ["get","head"],
    url: '/empleados-data/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
getRoles.url = (options?: RouteQueryOptions) => {
    return getRoles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
getRoles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
getRoles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRoles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
    const getRolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRoles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
        getRolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRoles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::getRoles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
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
* @see \App\Http\Controllers\EmpleadoController::getRolSugeridoPorCargo
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
export const getRolSugeridoPorCargo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getRolSugeridoPorCargo.url(options),
    method: 'post',
})

getRolSugeridoPorCargo.definition = {
    methods: ["post"],
    url: '/empleados-data/rol-sugerido',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::getRolSugeridoPorCargo
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
getRolSugeridoPorCargo.url = (options?: RouteQueryOptions) => {
    return getRolSugeridoPorCargo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::getRolSugeridoPorCargo
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
getRolSugeridoPorCargo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getRolSugeridoPorCargo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::getRolSugeridoPorCargo
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
    const getRolSugeridoPorCargoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: getRolSugeridoPorCargo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::getRolSugeridoPorCargo
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
        getRolSugeridoPorCargoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: getRolSugeridoPorCargo.url(options),
            method: 'post',
        })
    
    getRolSugeridoPorCargo.form = getRolSugeridoPorCargoForm
const EmpleadoController = { index, create, store, show, edit, update, destroy, toggleEstado, toggleAccesoSistema, crearEmpleadoRapido, getDepartamentos, getTiposContrato, getEstados, getSupervisores, getRoles, getRolSugeridoPorCargo }

export default EmpleadoController