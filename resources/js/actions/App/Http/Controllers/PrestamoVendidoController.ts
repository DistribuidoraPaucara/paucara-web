import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoVendidoController::index
 * @see app/Http/Controllers/PrestamoVendidoController.php:25
 * @route '/api/prestamos-vendidos'
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
* @see \App\Http\Controllers\PrestamoVendidoController::store
 * @see app/Http/Controllers/PrestamoVendidoController.php:121
 * @route '/api/prestamos-vendidos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestamos-vendidos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::store
 * @see app/Http/Controllers/PrestamoVendidoController.php:121
 * @route '/api/prestamos-vendidos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::store
 * @see app/Http/Controllers/PrestamoVendidoController.php:121
 * @route '/api/prestamos-vendidos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::store
 * @see app/Http/Controllers/PrestamoVendidoController.php:121
 * @route '/api/prestamos-vendidos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::store
 * @see app/Http/Controllers/PrestamoVendidoController.php:121
 * @route '/api/prestamos-vendidos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
export const show = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-vendidos/{venta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
show.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return show.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
show.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
show.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
    const showForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
        showForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:99
 * @route '/api/prestamos-vendidos/{venta}'
 */
        showForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PrestamoVendidoController::agregarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:179
 * @route '/api/prestamos-vendidos/{venta}/agregar-detalle'
 */
export const agregarDetalle = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarDetalle.url(args, options),
    method: 'post',
})

agregarDetalle.definition = {
    methods: ["post"],
    url: '/api/prestamos-vendidos/{venta}/agregar-detalle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::agregarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:179
 * @route '/api/prestamos-vendidos/{venta}/agregar-detalle'
 */
agregarDetalle.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return agregarDetalle.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::agregarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:179
 * @route '/api/prestamos-vendidos/{venta}/agregar-detalle'
 */
agregarDetalle.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarDetalle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::agregarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:179
 * @route '/api/prestamos-vendidos/{venta}/agregar-detalle'
 */
    const agregarDetalleForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: agregarDetalle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::agregarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:179
 * @route '/api/prestamos-vendidos/{venta}/agregar-detalle'
 */
        agregarDetalleForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: agregarDetalle.url(args, options),
            method: 'post',
        })
    
    agregarDetalle.form = agregarDetalleForm
/**
* @see \App\Http\Controllers\PrestamoVendidoController::eliminarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:229
 * @route '/api/prestamos-vendidos/{venta}/detalles/{detalle}'
 */
export const eliminarDetalle = (args: { venta: number | { id: number }, detalle: number | { id: number } } | [venta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarDetalle.url(args, options),
    method: 'delete',
})

eliminarDetalle.definition = {
    methods: ["delete"],
    url: '/api/prestamos-vendidos/{venta}/detalles/{detalle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::eliminarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:229
 * @route '/api/prestamos-vendidos/{venta}/detalles/{detalle}'
 */
eliminarDetalle.url = (args: { venta: number | { id: number }, detalle: number | { id: number } } | [venta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return eliminarDetalle.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::eliminarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:229
 * @route '/api/prestamos-vendidos/{venta}/detalles/{detalle}'
 */
eliminarDetalle.delete = (args: { venta: number | { id: number }, detalle: number | { id: number } } | [venta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarDetalle.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::eliminarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:229
 * @route '/api/prestamos-vendidos/{venta}/detalles/{detalle}'
 */
    const eliminarDetalleForm = (args: { venta: number | { id: number }, detalle: number | { id: number } } | [venta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarDetalle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::eliminarDetalle
 * @see app/Http/Controllers/PrestamoVendidoController.php:229
 * @route '/api/prestamos-vendidos/{venta}/detalles/{detalle}'
 */
        eliminarDetalleForm.delete = (args: { venta: number | { id: number }, detalle: number | { id: number } } | [venta: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PrestamoVendidoController::confirmar
 * @see app/Http/Controllers/PrestamoVendidoController.php:264
 * @route '/api/prestamos-vendidos/{venta}/confirmar'
 */
export const confirmar = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

confirmar.definition = {
    methods: ["post"],
    url: '/api/prestamos-vendidos/{venta}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::confirmar
 * @see app/Http/Controllers/PrestamoVendidoController.php:264
 * @route '/api/prestamos-vendidos/{venta}/confirmar'
 */
confirmar.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return confirmar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::confirmar
 * @see app/Http/Controllers/PrestamoVendidoController.php:264
 * @route '/api/prestamos-vendidos/{venta}/confirmar'
 */
confirmar.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::confirmar
 * @see app/Http/Controllers/PrestamoVendidoController.php:264
 * @route '/api/prestamos-vendidos/{venta}/confirmar'
 */
    const confirmarForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::confirmar
 * @see app/Http/Controllers/PrestamoVendidoController.php:264
 * @route '/api/prestamos-vendidos/{venta}/confirmar'
 */
        confirmarForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmar.url(args, options),
            method: 'post',
        })
    
    confirmar.form = confirmarForm
/**
* @see \App\Http\Controllers\PrestamoVendidoController::cancelar
 * @see app/Http/Controllers/PrestamoVendidoController.php:292
 * @route '/api/prestamos-vendidos/{venta}/cancelar'
 */
export const cancelar = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/api/prestamos-vendidos/{venta}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::cancelar
 * @see app/Http/Controllers/PrestamoVendidoController.php:292
 * @route '/api/prestamos-vendidos/{venta}/cancelar'
 */
cancelar.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return cancelar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::cancelar
 * @see app/Http/Controllers/PrestamoVendidoController.php:292
 * @route '/api/prestamos-vendidos/{venta}/cancelar'
 */
cancelar.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::cancelar
 * @see app/Http/Controllers/PrestamoVendidoController.php:292
 * @route '/api/prestamos-vendidos/{venta}/cancelar'
 */
    const cancelarForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::cancelar
 * @see app/Http/Controllers/PrestamoVendidoController.php:292
 * @route '/api/prestamos-vendidos/{venta}/cancelar'
 */
        cancelarForm.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
/**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
export const imprimir = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-vendidos/{venta}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
imprimir.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return imprimir.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
imprimir.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
imprimir.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
    const imprimirForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
        imprimirForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoVendidoController::imprimir
 * @see app/Http/Controllers/PrestamoVendidoController.php:326
 * @route '/api/prestamos-vendidos/{venta}/imprimir'
 */
        imprimirForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
export const descargarPdf = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPdf.url(args, options),
    method: 'get',
})

descargarPdf.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-vendidos/{venta}/descargar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
descargarPdf.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return descargarPdf.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
descargarPdf.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
descargarPdf.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
    const descargarPdfForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
        descargarPdfForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoVendidoController::descargarPdf
 * @see app/Http/Controllers/PrestamoVendidoController.php:357
 * @route '/api/prestamos-vendidos/{venta}/descargar-pdf'
 */
        descargarPdfForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarPdf.form = descargarPdfForm
/**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
export const showWeb = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showWeb.url(args, options),
    method: 'get',
})

showWeb.definition = {
    methods: ["get","head"],
    url: '/prestamos/ventas/{venta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
showWeb.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return showWeb.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
showWeb.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showWeb.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
showWeb.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showWeb.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
    const showWebForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showWeb.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
        showWebForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showWeb.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoVendidoController::showWeb
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
        showWebForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showWeb.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showWeb.form = showWebForm
const PrestamoVendidoController = { index, store, show, agregarDetalle, eliminarDetalle, confirmar, cancelar, imprimir, descargarPdf, showWeb }

export default PrestamoVendidoController