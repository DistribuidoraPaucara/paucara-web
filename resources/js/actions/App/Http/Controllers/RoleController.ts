import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RoleController::crearFuncionalidad
 * @see app/Http/Controllers/RoleController.php:0
 * @route '/roles/{role}/crear-funcionalidad'
 */
export const crearFuncionalidad = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearFuncionalidad.url(args, options),
    method: 'post',
})

crearFuncionalidad.definition = {
    methods: ["post"],
    url: '/roles/{role}/crear-funcionalidad',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::crearFuncionalidad
 * @see app/Http/Controllers/RoleController.php:0
 * @route '/roles/{role}/crear-funcionalidad'
 */
crearFuncionalidad.url = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: args.role,
                }

    return crearFuncionalidad.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::crearFuncionalidad
 * @see app/Http/Controllers/RoleController.php:0
 * @route '/roles/{role}/crear-funcionalidad'
 */
crearFuncionalidad.post = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearFuncionalidad.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::crearFuncionalidad
 * @see app/Http/Controllers/RoleController.php:0
 * @route '/roles/{role}/crear-funcionalidad'
 */
    const crearFuncionalidadForm = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearFuncionalidad.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::crearFuncionalidad
 * @see app/Http/Controllers/RoleController.php:0
 * @route '/roles/{role}/crear-funcionalidad'
 */
        crearFuncionalidadForm.post = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearFuncionalidad.url(args, options),
            method: 'post',
        })
    
    crearFuncionalidad.form = crearFuncionalidadForm
/**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::index
 * @see app/Http/Controllers/RoleController.php:21
 * @route '/roles'
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
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/roles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::create
 * @see app/Http/Controllers/RoleController.php:41
 * @route '/roles/create'
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
* @see \App\Http\Controllers\RoleController::store
 * @see app/Http/Controllers/RoleController.php:52
 * @route '/roles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::store
 * @see app/Http/Controllers/RoleController.php:52
 * @route '/roles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::store
 * @see app/Http/Controllers/RoleController.php:52
 * @route '/roles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::store
 * @see app/Http/Controllers/RoleController.php:52
 * @route '/roles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::store
 * @see app/Http/Controllers/RoleController.php:52
 * @route '/roles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
export const show = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
show.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
show.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
show.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
    const showForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
        showForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::show
 * @see app/Http/Controllers/RoleController.php:76
 * @route '/roles/{role}'
 */
        showForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
export const edit = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/roles/{role}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
edit.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return edit.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
edit.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
edit.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
    const editForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
        editForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::edit
 * @see app/Http/Controllers/RoleController.php:87
 * @route '/roles/{role}/edit'
 */
        editForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
export const update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
update.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
update.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
    const updateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
        updateForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\RoleController::update
 * @see app/Http/Controllers/RoleController.php:101
 * @route '/roles/{role}'
 */
        updateForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RoleController::destroy
 * @see app/Http/Controllers/RoleController.php:127
 * @route '/roles/{role}'
 */
export const destroy = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RoleController::destroy
 * @see app/Http/Controllers/RoleController.php:127
 * @route '/roles/{role}'
 */
destroy.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::destroy
 * @see app/Http/Controllers/RoleController.php:127
 * @route '/roles/{role}'
 */
destroy.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RoleController::destroy
 * @see app/Http/Controllers/RoleController.php:127
 * @route '/roles/{role}'
 */
    const destroyForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::destroy
 * @see app/Http/Controllers/RoleController.php:127
 * @route '/roles/{role}'
 */
        destroyForm.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RoleController::assignPermission
 * @see app/Http/Controllers/RoleController.php:140
 * @route '/roles/{role}/assign-permission'
 */
export const assignPermission = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermission.url(args, options),
    method: 'post',
})

assignPermission.definition = {
    methods: ["post"],
    url: '/roles/{role}/assign-permission',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::assignPermission
 * @see app/Http/Controllers/RoleController.php:140
 * @route '/roles/{role}/assign-permission'
 */
assignPermission.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return assignPermission.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::assignPermission
 * @see app/Http/Controllers/RoleController.php:140
 * @route '/roles/{role}/assign-permission'
 */
assignPermission.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermission.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::assignPermission
 * @see app/Http/Controllers/RoleController.php:140
 * @route '/roles/{role}/assign-permission'
 */
    const assignPermissionForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignPermission.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::assignPermission
 * @see app/Http/Controllers/RoleController.php:140
 * @route '/roles/{role}/assign-permission'
 */
        assignPermissionForm.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignPermission.url(args, options),
            method: 'post',
        })
    
    assignPermission.form = assignPermissionForm
/**
* @see \App\Http\Controllers\RoleController::removePermission
 * @see app/Http/Controllers/RoleController.php:151
 * @route '/roles/{role}/remove-permission'
 */
export const removePermission = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removePermission.url(args, options),
    method: 'delete',
})

removePermission.definition = {
    methods: ["delete"],
    url: '/roles/{role}/remove-permission',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RoleController::removePermission
 * @see app/Http/Controllers/RoleController.php:151
 * @route '/roles/{role}/remove-permission'
 */
removePermission.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return removePermission.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::removePermission
 * @see app/Http/Controllers/RoleController.php:151
 * @route '/roles/{role}/remove-permission'
 */
removePermission.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removePermission.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RoleController::removePermission
 * @see app/Http/Controllers/RoleController.php:151
 * @route '/roles/{role}/remove-permission'
 */
    const removePermissionForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: removePermission.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::removePermission
 * @see app/Http/Controllers/RoleController.php:151
 * @route '/roles/{role}/remove-permission'
 */
        removePermissionForm.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: removePermission.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    removePermission.form = removePermissionForm
/**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
export const getTemplates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTemplates.url(options),
    method: 'get',
})

getTemplates.definition = {
    methods: ["get","head"],
    url: '/roles-data/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
getTemplates.url = (options?: RouteQueryOptions) => {
    return getTemplates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
getTemplates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTemplates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
getTemplates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTemplates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
    const getTemplatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTemplates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
        getTemplatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTemplates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::getTemplates
 * @see app/Http/Controllers/RoleController.php:165
 * @route '/roles-data/templates'
 */
        getTemplatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTemplates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTemplates.form = getTemplatesForm
/**
* @see \App\Http\Controllers\RoleController::createTemplate
 * @see app/Http/Controllers/RoleController.php:175
 * @route '/roles-data/templates'
 */
export const createTemplate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTemplate.url(options),
    method: 'post',
})

createTemplate.definition = {
    methods: ["post"],
    url: '/roles-data/templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::createTemplate
 * @see app/Http/Controllers/RoleController.php:175
 * @route '/roles-data/templates'
 */
createTemplate.url = (options?: RouteQueryOptions) => {
    return createTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::createTemplate
 * @see app/Http/Controllers/RoleController.php:175
 * @route '/roles-data/templates'
 */
createTemplate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTemplate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::createTemplate
 * @see app/Http/Controllers/RoleController.php:175
 * @route '/roles-data/templates'
 */
    const createTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createTemplate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::createTemplate
 * @see app/Http/Controllers/RoleController.php:175
 * @route '/roles-data/templates'
 */
        createTemplateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createTemplate.url(options),
            method: 'post',
        })
    
    createTemplate.form = createTemplateForm
/**
* @see \App\Http\Controllers\RoleController::applyTemplate
 * @see app/Http/Controllers/RoleController.php:201
 * @route '/roles/{role}/apply-template'
 */
export const applyTemplate = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplate.url(args, options),
    method: 'post',
})

applyTemplate.definition = {
    methods: ["post"],
    url: '/roles/{role}/apply-template',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::applyTemplate
 * @see app/Http/Controllers/RoleController.php:201
 * @route '/roles/{role}/apply-template'
 */
applyTemplate.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return applyTemplate.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::applyTemplate
 * @see app/Http/Controllers/RoleController.php:201
 * @route '/roles/{role}/apply-template'
 */
applyTemplate.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::applyTemplate
 * @see app/Http/Controllers/RoleController.php:201
 * @route '/roles/{role}/apply-template'
 */
    const applyTemplateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: applyTemplate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::applyTemplate
 * @see app/Http/Controllers/RoleController.php:201
 * @route '/roles/{role}/apply-template'
 */
        applyTemplateForm.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: applyTemplate.url(args, options),
            method: 'post',
        })
    
    applyTemplate.form = applyTemplateForm
/**
* @see \App\Http\Controllers\RoleController::copyFromRole
 * @see app/Http/Controllers/RoleController.php:234
 * @route '/roles/{role}/copy-from'
 */
export const copyFromRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copyFromRole.url(args, options),
    method: 'post',
})

copyFromRole.definition = {
    methods: ["post"],
    url: '/roles/{role}/copy-from',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::copyFromRole
 * @see app/Http/Controllers/RoleController.php:234
 * @route '/roles/{role}/copy-from'
 */
copyFromRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return copyFromRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::copyFromRole
 * @see app/Http/Controllers/RoleController.php:234
 * @route '/roles/{role}/copy-from'
 */
copyFromRole.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copyFromRole.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::copyFromRole
 * @see app/Http/Controllers/RoleController.php:234
 * @route '/roles/{role}/copy-from'
 */
    const copyFromRoleForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: copyFromRole.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::copyFromRole
 * @see app/Http/Controllers/RoleController.php:234
 * @route '/roles/{role}/copy-from'
 */
        copyFromRoleForm.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: copyFromRole.url(args, options),
            method: 'post',
        })
    
    copyFromRole.form = copyFromRoleForm
/**
* @see \App\Http\Controllers\RoleController::compareRoles
 * @see app/Http/Controllers/RoleController.php:266
 * @route '/roles-data/compare'
 */
export const compareRoles = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compareRoles.url(options),
    method: 'post',
})

compareRoles.definition = {
    methods: ["post"],
    url: '/roles-data/compare',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoleController::compareRoles
 * @see app/Http/Controllers/RoleController.php:266
 * @route '/roles-data/compare'
 */
compareRoles.url = (options?: RouteQueryOptions) => {
    return compareRoles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::compareRoles
 * @see app/Http/Controllers/RoleController.php:266
 * @route '/roles-data/compare'
 */
compareRoles.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compareRoles.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoleController::compareRoles
 * @see app/Http/Controllers/RoleController.php:266
 * @route '/roles-data/compare'
 */
    const compareRolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: compareRoles.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoleController::compareRoles
 * @see app/Http/Controllers/RoleController.php:266
 * @route '/roles-data/compare'
 */
        compareRolesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: compareRoles.url(options),
            method: 'post',
        })
    
    compareRoles.form = compareRolesForm
/**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
export const getAudit = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAudit.url(args, options),
    method: 'get',
})

getAudit.definition = {
    methods: ["get","head"],
    url: '/roles/{role}/audit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
getAudit.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return getAudit.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
getAudit.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAudit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
getAudit.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAudit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
    const getAuditForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAudit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
        getAuditForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAudit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::getAudit
 * @see app/Http/Controllers/RoleController.php:310
 * @route '/roles/{role}/audit'
 */
        getAuditForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAudit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAudit.form = getAuditForm
/**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
export const getPermissionsGrouped = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermissionsGrouped.url(options),
    method: 'get',
})

getPermissionsGrouped.definition = {
    methods: ["get","head"],
    url: '/roles-data/permissions-grouped',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
getPermissionsGrouped.url = (options?: RouteQueryOptions) => {
    return getPermissionsGrouped.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
getPermissionsGrouped.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermissionsGrouped.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
getPermissionsGrouped.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPermissionsGrouped.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
    const getPermissionsGroupedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPermissionsGrouped.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
        getPermissionsGroupedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPermissionsGrouped.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoleController::getPermissionsGrouped
 * @see app/Http/Controllers/RoleController.php:323
 * @route '/roles-data/permissions-grouped'
 */
        getPermissionsGroupedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPermissionsGrouped.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPermissionsGrouped.form = getPermissionsGroupedForm
const RoleController = { crearFuncionalidad, index, create, store, show, edit, update, destroy, assignPermission, removePermission, getTemplates, createTemplate, applyTemplate, copyFromRole, compareRoles, getAudit, getPermissionsGrouped }

export default RoleController