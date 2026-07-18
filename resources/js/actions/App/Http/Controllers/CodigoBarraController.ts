import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CodigoBarraController::marcarPrincipal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
export const marcarPrincipal = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarPrincipal.url(args, options),
    method: 'put',
})

marcarPrincipal.definition = {
    methods: ["put"],
    url: '/codigos-barra/{codigo_barra}/principal',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::marcarPrincipal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
marcarPrincipal.url = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarPrincipal.definition.url
            .replace('{codigo_barra}', parsedArgs.codigo_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::marcarPrincipal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
marcarPrincipal.put = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: marcarPrincipal.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::marcarPrincipal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
    const marcarPrincipalForm = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarPrincipal.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::marcarPrincipal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
        marcarPrincipalForm.put = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarPrincipal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    marcarPrincipal.form = marcarPrincipalForm
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
export const buscarPorCodigo = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarPorCodigo.url(args, options),
    method: 'get',
})

buscarPorCodigo.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/buscar/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscarPorCodigo.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return buscarPorCodigo.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscarPorCodigo.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarPorCodigo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscarPorCodigo.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarPorCodigo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
    const buscarPorCodigoForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarPorCodigo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
        buscarPorCodigoForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarPorCodigo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarPorCodigo
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
        buscarPorCodigoForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarPorCodigo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarPorCodigo.form = buscarPorCodigoForm
/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
export const validar = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validar.url(args, options),
    method: 'get',
})

validar.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/validar/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return validar.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: validar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
    const validarForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: validar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
        validarForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
        validarForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    validar.form = validarForm
/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

generar.definition = {
    methods: ["post"],
    url: '/api/codigos-barra/generar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
generar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
    const generarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
        generarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generar.url(options),
            method: 'post',
        })
    
    generar.form = generarForm
/**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
export const codigosProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codigosProducto.url(args, options),
    method: 'get',
})

codigosProducto.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
codigosProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return codigosProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
codigosProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codigosProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
codigosProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: codigosProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
    const codigosProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: codigosProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
        codigosProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: codigosProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::codigosProducto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
        codigosProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: codigosProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    codigosProducto.form = codigosProductoForm
/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
export const obtenerImagen = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImagen.url(args, options),
    method: 'get',
})

obtenerImagen.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/imagen/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
obtenerImagen.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return obtenerImagen.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
obtenerImagen.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImagen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
obtenerImagen.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerImagen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
    const obtenerImagenForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerImagen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
        obtenerImagenForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImagen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
        obtenerImagenForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImagen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerImagen.form = obtenerImagenForm
/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
export const obtenerImagenSVG = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImagenSVG.url(args, options),
    method: 'get',
})

obtenerImagenSVG.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/imagen-svg/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
obtenerImagenSVG.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return obtenerImagenSVG.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
obtenerImagenSVG.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerImagenSVG.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
obtenerImagenSVG.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerImagenSVG.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
    const obtenerImagenSVGForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerImagenSVG.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
        obtenerImagenSVGForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImagenSVG.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::obtenerImagenSVG
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
        obtenerImagenSVGForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerImagenSVG.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerImagenSVG.form = obtenerImagenSVGForm
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
export const buscarProductoPorCodigoRapido = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductoPorCodigoRapido.url(args, options),
    method: 'get',
})

buscarProductoPorCodigoRapido.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/buscar-rapido/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarProductoPorCodigoRapido.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return buscarProductoPorCodigoRapido.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarProductoPorCodigoRapido.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductoPorCodigoRapido.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarProductoPorCodigoRapido.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarProductoPorCodigoRapido.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
    const buscarProductoPorCodigoRapidoForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarProductoPorCodigoRapido.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
        buscarProductoPorCodigoRapidoForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductoPorCodigoRapido.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarProductoPorCodigoRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
        buscarProductoPorCodigoRapidoForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductoPorCodigoRapido.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarProductoPorCodigoRapido.form = buscarProductoPorCodigoRapidoForm
/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
export const precalentarCache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: precalentarCache.url(options),
    method: 'post',
})

precalentarCache.definition = {
    methods: ["post"],
    url: '/api/codigos-barra/precalentar-cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
precalentarCache.url = (options?: RouteQueryOptions) => {
    return precalentarCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
precalentarCache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: precalentarCache.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
    const precalentarCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: precalentarCache.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
        precalentarCacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: precalentarCache.url(options),
            method: 'post',
        })
    
    precalentarCache.form = precalentarCacheForm
/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
export const estadisticasCache = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCache.url(options),
    method: 'get',
})

estadisticasCache.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/estadisticas-cache',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.url = (options?: RouteQueryOptions) => {
    return estadisticasCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCache.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasCache.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
    const estadisticasCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasCache.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
        estadisticasCacheForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasCache.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
        estadisticasCacheForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasCache.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasCache.form = estadisticasCacheForm
const CodigoBarraController = { index, create, store, show, edit, update, destroy, marcarPrincipal, buscarPorCodigo, validar, generar, codigosProducto, obtenerImagen, obtenerImagenSVG, buscarProductoPorCodigoRapido, precalentarCache, estadisticasCache }

export default CodigoBarraController