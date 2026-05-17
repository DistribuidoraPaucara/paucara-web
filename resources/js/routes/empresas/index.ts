import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/empresas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpresaController::index
 * @see app/Http/Controllers/EmpresaController.php:89
 * @route '/empresas'
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
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/empresas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpresaController::create
 * @see app/Http/Controllers/EmpresaController.php:162
 * @route '/empresas/create'
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
* @see \App\Http\Controllers\EmpresaController::store
 * @see app/Http/Controllers/EmpresaController.php:141
 * @route '/empresas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/empresas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpresaController::store
 * @see app/Http/Controllers/EmpresaController.php:141
 * @route '/empresas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::store
 * @see app/Http/Controllers/EmpresaController.php:141
 * @route '/empresas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmpresaController::store
 * @see app/Http/Controllers/EmpresaController.php:141
 * @route '/empresas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::store
 * @see app/Http/Controllers/EmpresaController.php:141
 * @route '/empresas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
export const show = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/empresas/{empresa}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
show.url = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: args.empresa,
                }

    return show.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
show.get = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
show.head = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
    const showForm = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
        showForm.get = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpresaController::show
 * @see app/Http/Controllers/EmpresaController.php:0
 * @route '/empresas/{empresa}'
 */
        showForm.head = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
export const edit = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/empresas/{empresa}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
edit.url = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: args.empresa,
                }

    return edit.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
edit.get = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
edit.head = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
    const editForm = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
        editForm.get = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpresaController::edit
 * @see app/Http/Controllers/EmpresaController.php:123
 * @route '/empresas/{empresa}/edit'
 */
        editForm.head = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
export const update = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/empresas/{empresa}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
update.url = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: args.empresa,
                }

    return update.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
update.put = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
update.patch = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
    const updateForm = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
        updateForm.put = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmpresaController::update
 * @see app/Http/Controllers/EmpresaController.php:171
 * @route '/empresas/{empresa}'
 */
        updateForm.patch = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmpresaController::destroy
 * @see app/Http/Controllers/EmpresaController.php:244
 * @route '/empresas/{empresa}'
 */
export const destroy = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/empresas/{empresa}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmpresaController::destroy
 * @see app/Http/Controllers/EmpresaController.php:244
 * @route '/empresas/{empresa}'
 */
destroy.url = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: args.empresa,
                }

    return destroy.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpresaController::destroy
 * @see app/Http/Controllers/EmpresaController.php:244
 * @route '/empresas/{empresa}'
 */
destroy.delete = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmpresaController::destroy
 * @see app/Http/Controllers/EmpresaController.php:244
 * @route '/empresas/{empresa}'
 */
    const destroyForm = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpresaController::destroy
 * @see app/Http/Controllers/EmpresaController.php:244
 * @route '/empresas/{empresa}'
 */
        destroyForm.delete = (args: { empresa: string | number } | [empresa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const empresas = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default empresas