import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::index
 * @see app/Http/Controllers/PrestableController.php:29
 * @route '/api/prestables'
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
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
export const historialAjustes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialAjustes.url(options),
    method: 'get',
})

historialAjustes.definition = {
    methods: ["get","head"],
    url: '/api/prestables/ajustes/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
historialAjustes.url = (options?: RouteQueryOptions) => {
    return historialAjustes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
historialAjustes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialAjustes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
historialAjustes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialAjustes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
    const historialAjustesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialAjustes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
        historialAjustesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialAjustes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::historialAjustes
 * @see app/Http/Controllers/PrestableController.php:914
 * @route '/api/prestables/ajustes/historial'
 */
        historialAjustesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialAjustes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialAjustes.form = historialAjustesForm
/**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/api/prestables/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
    const movimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
        movimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::movimientos
 * @see app/Http/Controllers/PrestableController.php:1038
 * @route '/api/prestables/movimientos'
 */
        movimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientos.form = movimientosForm
/**
* @see \App\Http\Controllers\PrestableController::store
 * @see app/Http/Controllers/PrestableController.php:153
 * @route '/api/prestables'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestableController::store
 * @see app/Http/Controllers/PrestableController.php:153
 * @route '/api/prestables'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::store
 * @see app/Http/Controllers/PrestableController.php:153
 * @route '/api/prestables'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestableController::store
 * @see app/Http/Controllers/PrestableController.php:153
 * @route '/api/prestables'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestableController::store
 * @see app/Http/Controllers/PrestableController.php:153
 * @route '/api/prestables'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
export const show = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestables/{prestable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
show.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return show.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
show.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
show.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
    const showForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
        showForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::show
 * @see app/Http/Controllers/PrestableController.php:419
 * @route '/api/prestables/{prestable}'
 */
        showForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PrestableController::update
 * @see app/Http/Controllers/PrestableController.php:478
 * @route '/api/prestables/{prestable}'
 */
export const update = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/prestables/{prestable}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrestableController::update
 * @see app/Http/Controllers/PrestableController.php:478
 * @route '/api/prestables/{prestable}'
 */
update.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return update.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::update
 * @see app/Http/Controllers/PrestableController.php:478
 * @route '/api/prestables/{prestable}'
 */
update.put = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PrestableController::update
 * @see app/Http/Controllers/PrestableController.php:478
 * @route '/api/prestables/{prestable}'
 */
    const updateForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestableController::update
 * @see app/Http/Controllers/PrestableController.php:478
 * @route '/api/prestables/{prestable}'
 */
        updateForm.put = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PrestableController::destroy
 * @see app/Http/Controllers/PrestableController.php:629
 * @route '/api/prestables/{prestable}'
 */
export const destroy = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/prestables/{prestable}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrestableController::destroy
 * @see app/Http/Controllers/PrestableController.php:629
 * @route '/api/prestables/{prestable}'
 */
destroy.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return destroy.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::destroy
 * @see app/Http/Controllers/PrestableController.php:629
 * @route '/api/prestables/{prestable}'
 */
destroy.delete = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PrestableController::destroy
 * @see app/Http/Controllers/PrestableController.php:629
 * @route '/api/prestables/{prestable}'
 */
    const destroyForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestableController::destroy
 * @see app/Http/Controllers/PrestableController.php:629
 * @route '/api/prestables/{prestable}'
 */
        destroyForm.delete = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
export const obtenerStock = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStock.url(args, options),
    method: 'get',
})

obtenerStock.definition = {
    methods: ["get","head"],
    url: '/api/prestables/{prestable}/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
obtenerStock.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return obtenerStock.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
obtenerStock.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStock.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
obtenerStock.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerStock.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
    const obtenerStockForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerStock.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
        obtenerStockForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerStock.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::obtenerStock
 * @see app/Http/Controllers/PrestableController.php:653
 * @route '/api/prestables/{prestable}/stock'
 */
        obtenerStockForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerStock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerStock.form = obtenerStockForm
/**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
export const obtenerDisponibilidad = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDisponibilidad.url(args, options),
    method: 'get',
})

obtenerDisponibilidad.definition = {
    methods: ["get","head"],
    url: '/api/prestables/{prestable}/disponibilidad',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
obtenerDisponibilidad.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return obtenerDisponibilidad.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
obtenerDisponibilidad.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDisponibilidad.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
obtenerDisponibilidad.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDisponibilidad.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
    const obtenerDisponibilidadForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDisponibilidad.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
        obtenerDisponibilidadForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDisponibilidad.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::obtenerDisponibilidad
 * @see app/Http/Controllers/PrestableController.php:672
 * @route '/api/prestables/{prestable}/disponibilidad'
 */
        obtenerDisponibilidadForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDisponibilidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDisponibilidad.form = obtenerDisponibilidadForm
/**
* @see \App\Http\Controllers\PrestableController::incrementarStock
 * @see app/Http/Controllers/PrestableController.php:739
 * @route '/api/prestables/{prestable}/stock/incrementar'
 */
export const incrementarStock = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: incrementarStock.url(args, options),
    method: 'post',
})

incrementarStock.definition = {
    methods: ["post"],
    url: '/api/prestables/{prestable}/stock/incrementar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestableController::incrementarStock
 * @see app/Http/Controllers/PrestableController.php:739
 * @route '/api/prestables/{prestable}/stock/incrementar'
 */
incrementarStock.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return incrementarStock.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::incrementarStock
 * @see app/Http/Controllers/PrestableController.php:739
 * @route '/api/prestables/{prestable}/stock/incrementar'
 */
incrementarStock.post = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: incrementarStock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestableController::incrementarStock
 * @see app/Http/Controllers/PrestableController.php:739
 * @route '/api/prestables/{prestable}/stock/incrementar'
 */
    const incrementarStockForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: incrementarStock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestableController::incrementarStock
 * @see app/Http/Controllers/PrestableController.php:739
 * @route '/api/prestables/{prestable}/stock/incrementar'
 */
        incrementarStockForm.post = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: incrementarStock.url(args, options),
            method: 'post',
        })
    
    incrementarStock.form = incrementarStockForm
/**
* @see \App\Http\Controllers\PrestableController::ajustarStock
 * @see app/Http/Controllers/PrestableController.php:770
 * @route '/api/prestables/{prestable}/stock/ajustar'
 */
export const ajustarStock = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarStock.url(args, options),
    method: 'post',
})

ajustarStock.definition = {
    methods: ["post"],
    url: '/api/prestables/{prestable}/stock/ajustar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestableController::ajustarStock
 * @see app/Http/Controllers/PrestableController.php:770
 * @route '/api/prestables/{prestable}/stock/ajustar'
 */
ajustarStock.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return ajustarStock.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::ajustarStock
 * @see app/Http/Controllers/PrestableController.php:770
 * @route '/api/prestables/{prestable}/stock/ajustar'
 */
ajustarStock.post = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarStock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestableController::ajustarStock
 * @see app/Http/Controllers/PrestableController.php:770
 * @route '/api/prestables/{prestable}/stock/ajustar'
 */
    const ajustarStockForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ajustarStock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestableController::ajustarStock
 * @see app/Http/Controllers/PrestableController.php:770
 * @route '/api/prestables/{prestable}/stock/ajustar'
 */
        ajustarStockForm.post = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ajustarStock.url(args, options),
            method: 'post',
        })
    
    ajustarStock.form = ajustarStockForm
/**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
export const ajusteDocumento = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteDocumento.url(args, options),
    method: 'get',
})

ajusteDocumento.definition = {
    methods: ["get","head"],
    url: '/api/prestables/{prestable}/ajuste-documento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
ajusteDocumento.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return ajusteDocumento.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
ajusteDocumento.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteDocumento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
ajusteDocumento.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ajusteDocumento.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
    const ajusteDocumentoForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ajusteDocumento.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
        ajusteDocumentoForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteDocumento.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestableController::ajusteDocumento
 * @see app/Http/Controllers/PrestableController.php:971
 * @route '/api/prestables/{prestable}/ajuste-documento'
 */
        ajusteDocumentoForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteDocumento.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ajusteDocumento.form = ajusteDocumentoForm
const PrestableController = { index, historialAjustes, movimientos, store, show, update, destroy, obtenerStock, obtenerDisponibilidad, incrementarStock, ajustarStock, ajusteDocumento }

export default PrestableController