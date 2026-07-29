import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sectores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SectorController::index
 * @see app/Http/Controllers/SectorController.php:50
 * @route '/sectores'
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
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/sectores/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SectorController::create
 * @see app/Http/Controllers/SectorController.php:87
 * @route '/sectores/create'
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
* @see \App\Http\Controllers\SectorController::store
 * @see app/Http/Controllers/SectorController.php:177
 * @route '/sectores'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sectores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SectorController::store
 * @see app/Http/Controllers/SectorController.php:177
 * @route '/sectores'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::store
 * @see app/Http/Controllers/SectorController.php:177
 * @route '/sectores'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SectorController::store
 * @see app/Http/Controllers/SectorController.php:177
 * @route '/sectores'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SectorController::store
 * @see app/Http/Controllers/SectorController.php:177
 * @route '/sectores'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
export const show = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/sectores/{sectore}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
show.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return show.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
show.get = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
show.head = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
    const showForm = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
        showForm.get = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SectorController::show
 * @see app/Http/Controllers/SectorController.php:0
 * @route '/sectores/{sectore}'
 */
        showForm.head = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
export const edit = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/sectores/{sectore}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
edit.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return edit.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
edit.get = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
edit.head = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
    const editForm = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
        editForm.get = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SectorController::edit
 * @see app/Http/Controllers/SectorController.php:108
 * @route '/sectores/{sectore}/edit'
 */
        editForm.head = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
export const update = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/sectores/{sectore}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
update.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return update.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
update.put = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
update.patch = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
    const updateForm = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
        updateForm.put = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SectorController::update
 * @see app/Http/Controllers/SectorController.php:222
 * @route '/sectores/{sectore}'
 */
        updateForm.patch = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SectorController::destroy
 * @see app/Http/Controllers/SectorController.php:244
 * @route '/sectores/{sectore}'
 */
export const destroy = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sectores/{sectore}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SectorController::destroy
 * @see app/Http/Controllers/SectorController.php:244
 * @route '/sectores/{sectore}'
 */
destroy.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return destroy.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SectorController::destroy
 * @see app/Http/Controllers/SectorController.php:244
 * @route '/sectores/{sectore}'
 */
destroy.delete = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SectorController::destroy
 * @see app/Http/Controllers/SectorController.php:244
 * @route '/sectores/{sectore}'
 */
    const destroyForm = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SectorController::destroy
 * @see app/Http/Controllers/SectorController.php:244
 * @route '/sectores/{sectore}'
 */
        destroyForm.delete = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const sectores = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default sectores