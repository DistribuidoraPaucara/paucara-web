import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
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
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
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
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/modulos-sidebar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const show = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return show.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const showForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        showForm.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        showForm.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
export const edit = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/{moduloSidebar}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return edit.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
    const editForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
        editForm.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
        editForm.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const update = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return update.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.put = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const updateForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        updateForm.put = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        updateForm.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const destroy = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
destroy.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return destroy.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
destroy.delete = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const destroyForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        destroyForm.delete = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
export const actualizarOrden = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

actualizarOrden.definition = {
    methods: ["post"],
    url: '/modulos-sidebar/actualizar-orden',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
actualizarOrden.url = (options?: RouteQueryOptions) => {
    return actualizarOrden.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
actualizarOrden.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
    const actualizarOrdenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarOrden.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
        actualizarOrdenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarOrden.url(options),
            method: 'post',
        })
    
    actualizarOrden.form = actualizarOrdenForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
export const toggleActivo = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

toggleActivo.definition = {
    methods: ["patch"],
    url: '/modulos-sidebar/{moduloSidebar}/toggle-activo',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
toggleActivo.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return toggleActivo.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
toggleActivo.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
    const toggleActivoForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActivo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
        toggleActivoForm.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActivo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActivo.form = toggleActivoForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.definition = {
    methods: ["post"],
    url: '/modulos-sidebar/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
bulkUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
    const bulkUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
        bulkUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdate.url(options),
            method: 'post',
        })
    
    bulkUpdate.form = bulkUpdateForm
const modulosSidebar = {
    index,
create,
store,
show,
edit,
update,
destroy,
actualizarOrden,
toggleActivo,
bulkUpdate,
}

export default modulosSidebar