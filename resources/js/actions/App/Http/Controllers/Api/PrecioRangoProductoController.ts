import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
export const index = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/rangos-precio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
index.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return index.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
index.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
index.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
    const indexForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
        indexForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::index
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:30
 * @route '/api/productos/{producto}/rangos-precio'
 */
        indexForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::store
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:47
 * @route '/api/productos/{producto}/rangos-precio'
 */
export const store = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/productos/{producto}/rangos-precio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::store
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:47
 * @route '/api/productos/{producto}/rangos-precio'
 */
store.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return store.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::store
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:47
 * @route '/api/productos/{producto}/rangos-precio'
 */
store.post = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::store
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:47
 * @route '/api/productos/{producto}/rangos-precio'
 */
    const storeForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::store
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:47
 * @route '/api/productos/{producto}/rangos-precio'
 */
        storeForm.post = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
export const show = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/rangos-precio/{rango}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
show.url = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                    rango: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                                rango: typeof args.rango === 'object'
                ? args.rango.id
                : args.rango,
                }

    return show.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace('{rango}', parsedArgs.rango.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
show.get = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
show.head = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
    const showForm = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
        showForm.get = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::show
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:80
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
        showForm.head = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::update
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:109
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
export const update = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/productos/{producto}/rangos-precio/{rango}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::update
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:109
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
update.url = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                    rango: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                                rango: typeof args.rango === 'object'
                ? args.rango.id
                : args.rango,
                }

    return update.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace('{rango}', parsedArgs.rango.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::update
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:109
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
update.put = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::update
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:109
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
    const updateForm = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::update
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:109
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
        updateForm.put = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::destroy
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:154
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
export const destroy = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/productos/{producto}/rangos-precio/{rango}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::destroy
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:154
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
destroy.url = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                    rango: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                                rango: typeof args.rango === 'object'
                ? args.rango.id
                : args.rango,
                }

    return destroy.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace('{rango}', parsedArgs.rango.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::destroy
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:154
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
destroy.delete = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::destroy
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:154
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
    const destroyForm = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::destroy
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:154
 * @route '/api/productos/{producto}/rangos-precio/{rango}'
 */
        destroyForm.delete = (args: { producto: number | { id: number }, rango: number | { id: number } } | [producto: number | { id: number }, rango: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
export const validarIntegridad = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validarIntegridad.url(args, options),
    method: 'get',
})

validarIntegridad.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/rangos-precio/validar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
validarIntegridad.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return validarIntegridad.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
validarIntegridad.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validarIntegridad.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
validarIntegridad.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: validarIntegridad.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
    const validarIntegridadForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: validarIntegridad.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
        validarIntegridadForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validarIntegridad.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::validarIntegridad
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:261
 * @route '/api/productos/{producto}/rangos-precio/validar'
 */
        validarIntegridadForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validarIntegridad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    validarIntegridad.form = validarIntegridadForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::copiarRangos
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:276
 * @route '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}'
 */
export const copiarRangos = (args: { producto: string | number, productoDestino: number | { id: number } } | [producto: string | number, productoDestino: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copiarRangos.url(args, options),
    method: 'post',
})

copiarRangos.definition = {
    methods: ["post"],
    url: '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::copiarRangos
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:276
 * @route '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}'
 */
copiarRangos.url = (args: { producto: string | number, productoDestino: number | { id: number } } | [producto: string | number, productoDestino: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                    productoDestino: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: args.producto,
                                productoDestino: typeof args.productoDestino === 'object'
                ? args.productoDestino.id
                : args.productoDestino,
                }

    return copiarRangos.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace('{productoDestino}', parsedArgs.productoDestino.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::copiarRangos
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:276
 * @route '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}'
 */
copiarRangos.post = (args: { producto: string | number, productoDestino: number | { id: number } } | [producto: string | number, productoDestino: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: copiarRangos.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::copiarRangos
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:276
 * @route '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}'
 */
    const copiarRangosForm = (args: { producto: string | number, productoDestino: number | { id: number } } | [producto: string | number, productoDestino: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: copiarRangos.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::copiarRangos
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:276
 * @route '/api/productos/{producto}/rangos-precio/copiar/{productoDestino}'
 */
        copiarRangosForm.post = (args: { producto: string | number, productoDestino: number | { id: number } } | [producto: string | number, productoDestino: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: copiarRangos.url(args, options),
            method: 'post',
        })
    
    copiarRangos.form = copiarRangosForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularPrecio
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:190
 * @route '/api/productos/{producto}/calcular-precio'
 */
export const calcularPrecio = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularPrecio.url(args, options),
    method: 'post',
})

calcularPrecio.definition = {
    methods: ["post"],
    url: '/api/productos/{producto}/calcular-precio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularPrecio
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:190
 * @route '/api/productos/{producto}/calcular-precio'
 */
calcularPrecio.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return calcularPrecio.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularPrecio
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:190
 * @route '/api/productos/{producto}/calcular-precio'
 */
calcularPrecio.post = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularPrecio.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularPrecio
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:190
 * @route '/api/productos/{producto}/calcular-precio'
 */
    const calcularPrecioForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: calcularPrecio.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularPrecio
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:190
 * @route '/api/productos/{producto}/calcular-precio'
 */
        calcularPrecioForm.post = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: calcularPrecio.url(args, options),
            method: 'post',
        })
    
    calcularPrecio.form = calcularPrecioForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::previsualizarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:341
 * @route '/api/productos/rangos-precio/previsualizar-csv'
 */
export const previsualizarCSV = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previsualizarCSV.url(options),
    method: 'post',
})

previsualizarCSV.definition = {
    methods: ["post"],
    url: '/api/productos/rangos-precio/previsualizar-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::previsualizarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:341
 * @route '/api/productos/rangos-precio/previsualizar-csv'
 */
previsualizarCSV.url = (options?: RouteQueryOptions) => {
    return previsualizarCSV.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::previsualizarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:341
 * @route '/api/productos/rangos-precio/previsualizar-csv'
 */
previsualizarCSV.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previsualizarCSV.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::previsualizarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:341
 * @route '/api/productos/rangos-precio/previsualizar-csv'
 */
    const previsualizarCSVForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: previsualizarCSV.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::previsualizarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:341
 * @route '/api/productos/rangos-precio/previsualizar-csv'
 */
        previsualizarCSVForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: previsualizarCSV.url(options),
            method: 'post',
        })
    
    previsualizarCSV.form = previsualizarCSVForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::importarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:400
 * @route '/api/productos/rangos-precio/importar-csv'
 */
export const importarCSV = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarCSV.url(options),
    method: 'post',
})

importarCSV.definition = {
    methods: ["post"],
    url: '/api/productos/rangos-precio/importar-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::importarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:400
 * @route '/api/productos/rangos-precio/importar-csv'
 */
importarCSV.url = (options?: RouteQueryOptions) => {
    return importarCSV.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::importarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:400
 * @route '/api/productos/rangos-precio/importar-csv'
 */
importarCSV.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarCSV.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::importarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:400
 * @route '/api/productos/rangos-precio/importar-csv'
 */
    const importarCSVForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importarCSV.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::importarCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:400
 * @route '/api/productos/rangos-precio/importar-csv'
 */
        importarCSVForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importarCSV.url(options),
            method: 'post',
        })
    
    importarCSV.form = importarCSVForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
export const descargarPlantillaCSV = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPlantillaCSV.url(options),
    method: 'get',
})

descargarPlantillaCSV.definition = {
    methods: ["get","head"],
    url: '/api/productos/rangos-precio/plantilla-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
descargarPlantillaCSV.url = (options?: RouteQueryOptions) => {
    return descargarPlantillaCSV.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
descargarPlantillaCSV.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPlantillaCSV.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
descargarPlantillaCSV.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarPlantillaCSV.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
    const descargarPlantillaCSVForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarPlantillaCSV.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
        descargarPlantillaCSVForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPlantillaCSV.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::descargarPlantillaCSV
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:442
 * @route '/api/productos/rangos-precio/plantilla-csv'
 */
        descargarPlantillaCSVForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPlantillaCSV.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarPlantillaCSV.form = descargarPlantillaCSVForm
/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularCarrito
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:223
 * @route '/api/carrito/calcular'
 */
export const calcularCarrito = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularCarrito.url(options),
    method: 'post',
})

calcularCarrito.definition = {
    methods: ["post"],
    url: '/api/carrito/calcular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularCarrito
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:223
 * @route '/api/carrito/calcular'
 */
calcularCarrito.url = (options?: RouteQueryOptions) => {
    return calcularCarrito.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularCarrito
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:223
 * @route '/api/carrito/calcular'
 */
calcularCarrito.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularCarrito.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularCarrito
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:223
 * @route '/api/carrito/calcular'
 */
    const calcularCarritoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: calcularCarrito.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PrecioRangoProductoController::calcularCarrito
 * @see app/Http/Controllers/Api/PrecioRangoProductoController.php:223
 * @route '/api/carrito/calcular'
 */
        calcularCarritoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: calcularCarrito.url(options),
            method: 'post',
        })
    
    calcularCarrito.form = calcularCarritoForm
const PrecioRangoProductoController = { index, store, show, update, destroy, validarIntegridad, copiarRangos, calcularPrecio, previsualizarCSV, importarCSV, descargarPlantillaCSV, calcularCarrito }

export default PrecioRangoProductoController