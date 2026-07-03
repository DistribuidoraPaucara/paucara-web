import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DireccionClienteApiController::index
 * @see app/Http/Controllers/DireccionClienteApiController.php:25
 * @route '/api/clientes/{cliente}/direcciones'
 */
export const index = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/direcciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DireccionClienteApiController::index
 * @see app/Http/Controllers/DireccionClienteApiController.php:25
 * @route '/api/clientes/{cliente}/direcciones'
 */
index.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return index.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DireccionClienteApiController::index
 * @see app/Http/Controllers/DireccionClienteApiController.php:25
 * @route '/api/clientes/{cliente}/direcciones'
 */
index.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DireccionClienteApiController::index
 * @see app/Http/Controllers/DireccionClienteApiController.php:25
 * @route '/api/clientes/{cliente}/direcciones'
 */
index.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DireccionClienteApiController::store
 * @see app/Http/Controllers/DireccionClienteApiController.php:39
 * @route '/api/clientes/{cliente}/direcciones'
 */
export const store = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/direcciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DireccionClienteApiController::store
 * @see app/Http/Controllers/DireccionClienteApiController.php:39
 * @route '/api/clientes/{cliente}/direcciones'
 */
store.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return store.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DireccionClienteApiController::store
 * @see app/Http/Controllers/DireccionClienteApiController.php:39
 * @route '/api/clientes/{cliente}/direcciones'
 */
store.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DireccionClienteApiController::update
 * @see app/Http/Controllers/DireccionClienteApiController.php:84
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
export const update = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/clientes/{cliente}/direcciones/{direccion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DireccionClienteApiController::update
 * @see app/Http/Controllers/DireccionClienteApiController.php:84
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
update.url = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    direccion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                direccion: typeof args.direccion === 'object'
                ? args.direccion.id
                : args.direccion,
                }

    return update.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{direccion}', parsedArgs.direccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DireccionClienteApiController::update
 * @see app/Http/Controllers/DireccionClienteApiController.php:84
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
update.put = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DireccionClienteApiController::destroy
 * @see app/Http/Controllers/DireccionClienteApiController.php:121
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
export const destroy = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/clientes/{cliente}/direcciones/{direccion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DireccionClienteApiController::destroy
 * @see app/Http/Controllers/DireccionClienteApiController.php:121
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
destroy.url = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    direccion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                direccion: typeof args.direccion === 'object'
                ? args.direccion.id
                : args.direccion,
                }

    return destroy.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{direccion}', parsedArgs.direccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DireccionClienteApiController::destroy
 * @see app/Http/Controllers/DireccionClienteApiController.php:121
 * @route '/api/clientes/{cliente}/direcciones/{direccion}'
 */
destroy.delete = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DireccionClienteApiController::establecerPrincipal
 * @see app/Http/Controllers/DireccionClienteApiController.php:141
 * @route '/api/clientes/{cliente}/direcciones/{direccion}/principal'
 */
export const establecerPrincipal = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: establecerPrincipal.url(args, options),
    method: 'patch',
})

establecerPrincipal.definition = {
    methods: ["patch"],
    url: '/api/clientes/{cliente}/direcciones/{direccion}/principal',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\DireccionClienteApiController::establecerPrincipal
 * @see app/Http/Controllers/DireccionClienteApiController.php:141
 * @route '/api/clientes/{cliente}/direcciones/{direccion}/principal'
 */
establecerPrincipal.url = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    direccion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                direccion: typeof args.direccion === 'object'
                ? args.direccion.id
                : args.direccion,
                }

    return establecerPrincipal.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{direccion}', parsedArgs.direccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DireccionClienteApiController::establecerPrincipal
 * @see app/Http/Controllers/DireccionClienteApiController.php:141
 * @route '/api/clientes/{cliente}/direcciones/{direccion}/principal'
 */
establecerPrincipal.patch = (args: { cliente: number | { id: number }, direccion: number | { id: number } } | [cliente: number | { id: number }, direccion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: establecerPrincipal.url(args, options),
    method: 'patch',
})
const DireccionClienteApiController = { index, store, update, destroy, establecerPrincipal }

export default DireccionClienteApiController