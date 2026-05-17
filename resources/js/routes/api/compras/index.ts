import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/compras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
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
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/compras',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
export const show = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return show.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
    const showForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
        showForm.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
        showForm.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
export const update = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return update.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
    const updateForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
        updateForm.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
        updateForm.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
export const destroy = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
destroy.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return destroy.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
destroy.delete = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
    const destroyForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
        destroyForm.delete = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const compras = {
    index,
store,
show,
update,
destroy,
}

export default compras