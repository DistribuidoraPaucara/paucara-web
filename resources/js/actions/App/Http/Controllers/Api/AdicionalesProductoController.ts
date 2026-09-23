import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
export const productosComida = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosComida.url(options),
    method: 'get',
})

productosComida.definition = {
    methods: ["get","head"],
    url: '/api/productos-comida',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
productosComida.url = (options?: RouteQueryOptions) => {
    return productosComida.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
productosComida.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosComida.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
productosComida.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosComida.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
    const productosComidaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosComida.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
        productosComidaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosComida.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::productosComida
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:98
 * @route '/api/productos-comida'
 */
        productosComidaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosComida.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosComida.form = productosComidaForm
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
export const obtenerPorProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPorProducto.url(args, options),
    method: 'get',
})

obtenerPorProducto.definition = {
    methods: ["get","head"],
    url: '/api/productos-comida/{producto}/adicionales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
obtenerPorProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerPorProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
obtenerPorProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPorProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
obtenerPorProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerPorProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
    const obtenerPorProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerPorProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
        obtenerPorProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPorProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::obtenerPorProducto
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:16
 * @route '/api/productos-comida/{producto}/adicionales'
 */
        obtenerPorProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPorProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerPorProducto.form = obtenerPorProductoForm
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::store
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:32
 * @route '/api/productos-comida/adicionales'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/productos-comida/adicionales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::store
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:32
 * @route '/api/productos-comida/adicionales'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::store
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:32
 * @route '/api/productos-comida/adicionales'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::store
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:32
 * @route '/api/productos-comida/adicionales'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::store
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:32
 * @route '/api/productos-comida/adicionales'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::update
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:63
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
export const update = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/productos-comida/adicionales/{adicional}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::update
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:63
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
update.url = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adicional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { adicional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    adicional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adicional: typeof args.adicional === 'object'
                ? args.adicional.id
                : args.adicional,
                }

    return update.definition.url
            .replace('{adicional}', parsedArgs.adicional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::update
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:63
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
update.patch = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::update
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:63
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
    const updateForm = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::update
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:63
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
        updateForm.patch = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\AdicionalesProductoController::destroy
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:85
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
export const destroy = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/productos-comida/adicionales/{adicional}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::destroy
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:85
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
destroy.url = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adicional: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { adicional: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    adicional: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adicional: typeof args.adicional === 'object'
                ? args.adicional.id
                : args.adicional,
                }

    return destroy.definition.url
            .replace('{adicional}', parsedArgs.adicional.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::destroy
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:85
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
destroy.delete = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::destroy
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:85
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
    const destroyForm = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AdicionalesProductoController::destroy
 * @see app/Http/Controllers/Api/AdicionalesProductoController.php:85
 * @route '/api/productos-comida/adicionales/{adicional}'
 */
        destroyForm.delete = (args: { adicional: number | { id: number } } | [adicional: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdicionalesProductoController = { productosComida, obtenerPorProducto, store, update, destroy }

export default AdicionalesProductoController