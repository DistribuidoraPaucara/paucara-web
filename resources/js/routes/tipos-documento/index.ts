import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tipos-documento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
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
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
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
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tipos-documento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const show = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return show.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
    const showForm = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
        showForm.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
        showForm.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
export const edit = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/{tipoDocumento}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return edit.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
    const editForm = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
        editForm.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
        editForm.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const update = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return update.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.put = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.patch = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
    const updateForm = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
        updateForm.put = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
        updateForm.patch = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const destroy = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
destroy.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return destroy.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
destroy.delete = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
    const destroyForm = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
        destroyForm.delete = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tiposDocumento = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default tiposDocumento