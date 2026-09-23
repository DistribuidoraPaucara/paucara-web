import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/pagos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PagoController::index
 * @see app/Http/Controllers/PagoController.php:18
 * @route '/compras/pagos'
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
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/compras/pagos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PagoController::create
 * @see app/Http/Controllers/PagoController.php:90
 * @route '/compras/pagos/create'
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
* @see \App\Http\Controllers\PagoController::store
 * @see app/Http/Controllers/PagoController.php:105
 * @route '/compras/pagos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/compras/pagos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PagoController::store
 * @see app/Http/Controllers/PagoController.php:105
 * @route '/compras/pagos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::store
 * @see app/Http/Controllers/PagoController.php:105
 * @route '/compras/pagos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PagoController::store
 * @see app/Http/Controllers/PagoController.php:105
 * @route '/compras/pagos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PagoController::store
 * @see app/Http/Controllers/PagoController.php:105
 * @route '/compras/pagos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
export const show = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compras/pagos/{pago}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
show.url = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pago: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pago: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return show.definition.url
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
show.get = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
show.head = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
    const showForm = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
        showForm.get = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PagoController::show
 * @see app/Http/Controllers/PagoController.php:164
 * @route '/compras/pagos/{pago}'
 */
        showForm.head = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
export const imprimir = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/compras/pagos/{pago}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
imprimir.url = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pago: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pago: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return imprimir.definition.url
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
imprimir.get = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
imprimir.head = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
    const imprimirForm = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
        imprimirForm.get = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PagoController::imprimir
 * @see app/Http/Controllers/PagoController.php:215
 * @route '/compras/pagos/{pago}/imprimir'
 */
        imprimirForm.head = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\PagoController::destroy
 * @see app/Http/Controllers/PagoController.php:173
 * @route '/compras/pagos/{pago}'
 */
export const destroy = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/compras/pagos/{pago}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PagoController::destroy
 * @see app/Http/Controllers/PagoController.php:173
 * @route '/compras/pagos/{pago}'
 */
destroy.url = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pago: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pago: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return destroy.definition.url
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::destroy
 * @see app/Http/Controllers/PagoController.php:173
 * @route '/compras/pagos/{pago}'
 */
destroy.delete = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PagoController::destroy
 * @see app/Http/Controllers/PagoController.php:173
 * @route '/compras/pagos/{pago}'
 */
    const destroyForm = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PagoController::destroy
 * @see app/Http/Controllers/PagoController.php:173
 * @route '/compras/pagos/{pago}'
 */
        destroyForm.delete = (args: { pago: number | { id: number } } | [pago: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/compras/pagos/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PagoController::exportMethod
 * @see app/Http/Controllers/PagoController.php:190
 * @route '/compras/pagos/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const PagoController = { index, create, store, show, imprimir, destroy, exportMethod, export: exportMethod }

export default PagoController