import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import api from './api'
/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
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
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/localidades/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
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
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/localidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
export const show = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return show.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
    const showForm = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
        showForm.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
        showForm.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
export const edit = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/localidades/{localidade}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return edit.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
    const editForm = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
        editForm.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
        editForm.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
export const update = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return update.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.put = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.patch = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
    const updateForm = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
        updateForm.put = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
        updateForm.patch = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
export const destroy = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
destroy.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return destroy.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
destroy.delete = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
    const destroyForm = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
        destroyForm.delete = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const localidades = {
    index,
create,
store,
show,
edit,
update,
destroy,
api,
}

export default localidades