import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/estados-documento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosDocumentoController::index
 * @see app/Http/Controllers/EstadosDocumentoController.php:136
 * @route '/estados-documento'
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
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/estados-documento/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosDocumentoController::create
 * @see app/Http/Controllers/EstadosDocumentoController.php:86
 * @route '/estados-documento/create'
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
* @see \App\Http\Controllers\EstadosDocumentoController::store
 * @see app/Http/Controllers/EstadosDocumentoController.php:177
 * @route '/estados-documento'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/estados-documento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::store
 * @see app/Http/Controllers/EstadosDocumentoController.php:177
 * @route '/estados-documento'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::store
 * @see app/Http/Controllers/EstadosDocumentoController.php:177
 * @route '/estados-documento'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::store
 * @see app/Http/Controllers/EstadosDocumentoController.php:177
 * @route '/estados-documento'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::store
 * @see app/Http/Controllers/EstadosDocumentoController.php:177
 * @route '/estados-documento'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
export const show = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/estados-documento/{estados_documento}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
show.url = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_documento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_documento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_documento: args.estados_documento,
                }

    return show.definition.url
            .replace('{estados_documento}', parsedArgs.estados_documento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
show.get = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
show.head = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
    const showForm = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
        showForm.get = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosDocumentoController::show
 * @see app/Http/Controllers/EstadosDocumentoController.php:0
 * @route '/estados-documento/{estados_documento}'
 */
        showForm.head = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
export const edit = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/estados-documento/{estados_documento}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
edit.url = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_documento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_documento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_documento: args.estados_documento,
                }

    return edit.definition.url
            .replace('{estados_documento}', parsedArgs.estados_documento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
edit.get = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
edit.head = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
    const editForm = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
        editForm.get = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EstadosDocumentoController::edit
 * @see app/Http/Controllers/EstadosDocumentoController.php:106
 * @route '/estados-documento/{estados_documento}/edit'
 */
        editForm.head = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
export const update = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/estados-documento/{estados_documento}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
update.url = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_documento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_documento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_documento: args.estados_documento,
                }

    return update.definition.url
            .replace('{estados_documento}', parsedArgs.estados_documento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
update.put = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
update.patch = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
    const updateForm = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
        updateForm.put = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EstadosDocumentoController::update
 * @see app/Http/Controllers/EstadosDocumentoController.php:222
 * @route '/estados-documento/{estados_documento}'
 */
        updateForm.patch = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EstadosDocumentoController::destroy
 * @see app/Http/Controllers/EstadosDocumentoController.php:244
 * @route '/estados-documento/{estados_documento}'
 */
export const destroy = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/estados-documento/{estados_documento}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EstadosDocumentoController::destroy
 * @see app/Http/Controllers/EstadosDocumentoController.php:244
 * @route '/estados-documento/{estados_documento}'
 */
destroy.url = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estados_documento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estados_documento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estados_documento: args.estados_documento,
                }

    return destroy.definition.url
            .replace('{estados_documento}', parsedArgs.estados_documento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EstadosDocumentoController::destroy
 * @see app/Http/Controllers/EstadosDocumentoController.php:244
 * @route '/estados-documento/{estados_documento}'
 */
destroy.delete = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EstadosDocumentoController::destroy
 * @see app/Http/Controllers/EstadosDocumentoController.php:244
 * @route '/estados-documento/{estados_documento}'
 */
    const destroyForm = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EstadosDocumentoController::destroy
 * @see app/Http/Controllers/EstadosDocumentoController.php:244
 * @route '/estados-documento/{estados_documento}'
 */
        destroyForm.delete = (args: { estados_documento: string | number } | [estados_documento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const estadosDocumento = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default estadosDocumento