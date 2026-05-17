import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/compras-prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraPrestableController::index
 * @see app/Http/Controllers/CompraPrestableController.php:26
 * @route '/api/compras-prestables'
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
* @see \App\Http\Controllers\CompraPrestableController::store
 * @see app/Http/Controllers/CompraPrestableController.php:122
 * @route '/api/compras-prestables'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/compras-prestables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::store
 * @see app/Http/Controllers/CompraPrestableController.php:122
 * @route '/api/compras-prestables'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::store
 * @see app/Http/Controllers/CompraPrestableController.php:122
 * @route '/api/compras-prestables'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::store
 * @see app/Http/Controllers/CompraPrestableController.php:122
 * @route '/api/compras-prestables'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::store
 * @see app/Http/Controllers/CompraPrestableController.php:122
 * @route '/api/compras-prestables'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
export const showApi = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/compras-prestables/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
showApi.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return showApi.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
showApi.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
showApi.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
    const showApiForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
        showApiForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraPrestableController::showApi
 * @see app/Http/Controllers/CompraPrestableController.php:100
 * @route '/api/compras-prestables/{compra}'
 */
        showApiForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApi.form = showApiForm
/**
* @see \App\Http\Controllers\CompraPrestableController::agregarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:190
 * @route '/api/compras-prestables/{compra}/agregar-detalle'
 */
export const agregarDetalle = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarDetalle.url(args, options),
    method: 'post',
})

agregarDetalle.definition = {
    methods: ["post"],
    url: '/api/compras-prestables/{compra}/agregar-detalle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::agregarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:190
 * @route '/api/compras-prestables/{compra}/agregar-detalle'
 */
agregarDetalle.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return agregarDetalle.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::agregarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:190
 * @route '/api/compras-prestables/{compra}/agregar-detalle'
 */
agregarDetalle.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarDetalle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::agregarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:190
 * @route '/api/compras-prestables/{compra}/agregar-detalle'
 */
    const agregarDetalleForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: agregarDetalle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::agregarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:190
 * @route '/api/compras-prestables/{compra}/agregar-detalle'
 */
        agregarDetalleForm.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: agregarDetalle.url(args, options),
            method: 'post',
        })
    
    agregarDetalle.form = agregarDetalleForm
/**
* @see \App\Http\Controllers\CompraPrestableController::eliminarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:257
 * @route '/api/compras-prestables/{compra}/detalles/{detalle}'
 */
export const eliminarDetalle = (args: { compra: number | { id: number }, detalle: number | { id: number } } | [compra: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarDetalle.url(args, options),
    method: 'delete',
})

eliminarDetalle.definition = {
    methods: ["delete"],
    url: '/api/compras-prestables/{compra}/detalles/{detalle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::eliminarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:257
 * @route '/api/compras-prestables/{compra}/detalles/{detalle}'
 */
eliminarDetalle.url = (args: { compra: number | { id: number }, detalle: number | { id: number } } | [compra: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return eliminarDetalle.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::eliminarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:257
 * @route '/api/compras-prestables/{compra}/detalles/{detalle}'
 */
eliminarDetalle.delete = (args: { compra: number | { id: number }, detalle: number | { id: number } } | [compra: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarDetalle.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::eliminarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:257
 * @route '/api/compras-prestables/{compra}/detalles/{detalle}'
 */
    const eliminarDetalleForm = (args: { compra: number | { id: number }, detalle: number | { id: number } } | [compra: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarDetalle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::eliminarDetalle
 * @see app/Http/Controllers/CompraPrestableController.php:257
 * @route '/api/compras-prestables/{compra}/detalles/{detalle}'
 */
        eliminarDetalleForm.delete = (args: { compra: number | { id: number }, detalle: number | { id: number } } | [compra: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminarDetalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminarDetalle.form = eliminarDetalleForm
/**
* @see \App\Http\Controllers\CompraPrestableController::confirmar
 * @see app/Http/Controllers/CompraPrestableController.php:292
 * @route '/api/compras-prestables/{compra}/confirmar'
 */
export const confirmar = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

confirmar.definition = {
    methods: ["post"],
    url: '/api/compras-prestables/{compra}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::confirmar
 * @see app/Http/Controllers/CompraPrestableController.php:292
 * @route '/api/compras-prestables/{compra}/confirmar'
 */
confirmar.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return confirmar.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::confirmar
 * @see app/Http/Controllers/CompraPrestableController.php:292
 * @route '/api/compras-prestables/{compra}/confirmar'
 */
confirmar.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::confirmar
 * @see app/Http/Controllers/CompraPrestableController.php:292
 * @route '/api/compras-prestables/{compra}/confirmar'
 */
    const confirmarForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::confirmar
 * @see app/Http/Controllers/CompraPrestableController.php:292
 * @route '/api/compras-prestables/{compra}/confirmar'
 */
        confirmarForm.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmar.url(args, options),
            method: 'post',
        })
    
    confirmar.form = confirmarForm
/**
* @see \App\Http\Controllers\CompraPrestableController::cancelar
 * @see app/Http/Controllers/CompraPrestableController.php:320
 * @route '/api/compras-prestables/{compra}/cancelar'
 */
export const cancelar = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/api/compras-prestables/{compra}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::cancelar
 * @see app/Http/Controllers/CompraPrestableController.php:320
 * @route '/api/compras-prestables/{compra}/cancelar'
 */
cancelar.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return cancelar.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::cancelar
 * @see app/Http/Controllers/CompraPrestableController.php:320
 * @route '/api/compras-prestables/{compra}/cancelar'
 */
cancelar.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::cancelar
 * @see app/Http/Controllers/CompraPrestableController.php:320
 * @route '/api/compras-prestables/{compra}/cancelar'
 */
    const cancelarForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::cancelar
 * @see app/Http/Controllers/CompraPrestableController.php:320
 * @route '/api/compras-prestables/{compra}/cancelar'
 */
        cancelarForm.post = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
/**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
export const imprimir = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/compras-prestables/{compra}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
imprimir.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return imprimir.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
imprimir.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
imprimir.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
    const imprimirForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
        imprimirForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraPrestableController::imprimir
 * @see app/Http/Controllers/CompraPrestableController.php:354
 * @route '/api/compras-prestables/{compra}/imprimir'
 */
        imprimirForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
export const show = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/prestamos/compras/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
show.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return show.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
show.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
show.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
    const showForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
        showForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:79
 * @route '/prestamos/compras/{compra}'
 */
        showForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const CompraPrestableController = { index, store, showApi, agregarDetalle, eliminarDetalle, confirmar, cancelar, imprimir, show }

export default CompraPrestableController