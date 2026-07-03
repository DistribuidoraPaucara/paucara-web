import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tipos-pago',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoPagoController::index
 * @see app/Http/Controllers/Api/TipoPagoController.php:24
 * @route '/api/tipos-pago'
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
* @see \App\Http\Controllers\Api\TipoPagoController::store
 * @see app/Http/Controllers/Api/TipoPagoController.php:107
 * @route '/api/tipos-pago'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/tipos-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::store
 * @see app/Http/Controllers/Api/TipoPagoController.php:107
 * @route '/api/tipos-pago'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::store
 * @see app/Http/Controllers/Api/TipoPagoController.php:107
 * @route '/api/tipos-pago'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::store
 * @see app/Http/Controllers/Api/TipoPagoController.php:107
 * @route '/api/tipos-pago'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::store
 * @see app/Http/Controllers/Api/TipoPagoController.php:107
 * @route '/api/tipos-pago'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
export const show = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/tipos-pago/{tipos_pago}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
show.url = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipos_pago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipos_pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipos_pago: args.tipos_pago,
                }

    return show.definition.url
            .replace('{tipos_pago}', parsedArgs.tipos_pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
show.get = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
show.head = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
    const showForm = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
        showForm.get = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoPagoController::show
 * @see app/Http/Controllers/Api/TipoPagoController.php:73
 * @route '/api/tipos-pago/{tipos_pago}'
 */
        showForm.head = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
export const update = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/tipos-pago/{tipos_pago}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
update.url = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipos_pago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipos_pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipos_pago: args.tipos_pago,
                }

    return update.definition.url
            .replace('{tipos_pago}', parsedArgs.tipos_pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
update.put = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
update.patch = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
    const updateForm = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
        updateForm.put = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\TipoPagoController::update
 * @see app/Http/Controllers/Api/TipoPagoController.php:179
 * @route '/api/tipos-pago/{tipos_pago}'
 */
        updateForm.patch = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\TipoPagoController::destroy
 * @see app/Http/Controllers/Api/TipoPagoController.php:240
 * @route '/api/tipos-pago/{tipos_pago}'
 */
export const destroy = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/tipos-pago/{tipos_pago}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::destroy
 * @see app/Http/Controllers/Api/TipoPagoController.php:240
 * @route '/api/tipos-pago/{tipos_pago}'
 */
destroy.url = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipos_pago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipos_pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipos_pago: args.tipos_pago,
                }

    return destroy.definition.url
            .replace('{tipos_pago}', parsedArgs.tipos_pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::destroy
 * @see app/Http/Controllers/Api/TipoPagoController.php:240
 * @route '/api/tipos-pago/{tipos_pago}'
 */
destroy.delete = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::destroy
 * @see app/Http/Controllers/Api/TipoPagoController.php:240
 * @route '/api/tipos-pago/{tipos_pago}'
 */
    const destroyForm = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::destroy
 * @see app/Http/Controllers/Api/TipoPagoController.php:240
 * @route '/api/tipos-pago/{tipos_pago}'
 */
        destroyForm.delete = (args: { tipos_pago: string | number } | [tipos_pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
export const activos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activos.url(options),
    method: 'get',
})

activos.definition = {
    methods: ["get","head"],
    url: '/api/tipos-pago/activos/listar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
activos.url = (options?: RouteQueryOptions) => {
    return activos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
activos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
activos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
    const activosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: activos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
        activosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoPagoController::activos
 * @see app/Http/Controllers/Api/TipoPagoController.php:295
 * @route '/api/tipos-pago/activos/listar'
 */
        activosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    activos.form = activosForm
const tiposPago = {
    index,
store,
show,
update,
destroy,
activos,
}

export default tiposPago