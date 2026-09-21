import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/codigos-barra',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
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
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
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
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/codigos-barra',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
export const show = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return show.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
    const showForm = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
        showForm.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
        showForm.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
export const edit = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/{codigos_barra}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return edit.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
    const editForm = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
        editForm.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
        editForm.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
export const update = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return update.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.put = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.patch = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
    const updateForm = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
        updateForm.put = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
        updateForm.patch = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
export const destroy = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
destroy.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return destroy.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
destroy.delete = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
    const destroyForm = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
        destroyForm.delete = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
export const principal = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: principal.url(args, options),
    method: 'put',
})

principal.definition = {
    methods: ["put"],
    url: '/codigos-barra/{codigo_barra}/principal',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
principal.url = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo_barra: args.codigo_barra,
                }

    return principal.definition.url
            .replace('{codigo_barra}', parsedArgs.codigo_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
principal.put = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: principal.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
    const principalForm = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: principal.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
        principalForm.put = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: principal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    principal.form = principalForm
const codigosBarra = {
    index,
create,
store,
show,
edit,
update,
destroy,
principal,
}

export default codigosBarra