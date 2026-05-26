import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
const indexApi5f94bd91c3d48d955f7b536c0a3189e1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'get',
})

indexApi5f94bd91c3d48d955f7b536c0a3189e1.definition = {
    methods: ["get","head"],
    url: '/api/app/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.url = (options?: RouteQueryOptions) => {
    return indexApi5f94bd91c3d48d955f7b536c0a3189e1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
indexApi5f94bd91c3d48d955f7b536c0a3189e1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
    const indexApi5f94bd91c3d48d955f7b536c0a3189e1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
        indexApi5f94bd91c3d48d955f7b536c0a3189e1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/app/productos'
 */
        indexApi5f94bd91c3d48d955f7b536c0a3189e1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi5f94bd91c3d48d955f7b536c0a3189e1.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi5f94bd91c3d48d955f7b536c0a3189e1.form = indexApi5f94bd91c3d48d955f7b536c0a3189e1Form
    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
const indexApica1ca34b4a118f4e84d7e3af666cfc55 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'get',
})

indexApica1ca34b4a118f4e84d7e3af666cfc55.definition = {
    methods: ["get","head"],
    url: '/api/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.url = (options?: RouteQueryOptions) => {
    return indexApica1ca34b4a118f4e84d7e3af666cfc55.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
indexApica1ca34b4a118f4e84d7e3af666cfc55.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
    const indexApica1ca34b4a118f4e84d7e3af666cfc55Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
        indexApica1ca34b4a118f4e84d7e3af666cfc55Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::indexApi
 * @see app/Http/Controllers/ProductoController.php:1342
 * @route '/api/productos'
 */
        indexApica1ca34b4a118f4e84d7e3af666cfc55Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApica1ca34b4a118f4e84d7e3af666cfc55.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApica1ca34b4a118f4e84d7e3af666cfc55.form = indexApica1ca34b4a118f4e84d7e3af666cfc55Form

export const indexApi = {
    '/api/app/productos': indexApi5f94bd91c3d48d955f7b536c0a3189e1,
    '/api/productos': indexApica1ca34b4a118f4e84d7e3af666cfc55,
}

/**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
export const filtros = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtros.url(options),
    method: 'get',
})

filtros.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/filtros',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
filtros.url = (options?: RouteQueryOptions) => {
    return filtros.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
filtros.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtros.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
filtros.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filtros.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
    const filtrosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filtros.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
        filtrosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filtros.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::filtros
 * @see app/Http/Controllers/ProductoController.php:1825
 * @route '/api/app/productos/filtros'
 */
        filtrosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filtros.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filtros.form = filtrosForm
/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
const buscarApi2f647e659f2ae29cad5423e3d6248ee7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'get',
})

buscarApi2f647e659f2ae29cad5423e3d6248ee7.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.url = (options?: RouteQueryOptions) => {
    return buscarApi2f647e659f2ae29cad5423e3d6248ee7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
buscarApi2f647e659f2ae29cad5423e3d6248ee7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
    const buscarApi2f647e659f2ae29cad5423e3d6248ee7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
        buscarApi2f647e659f2ae29cad5423e3d6248ee7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/app/productos/buscar'
 */
        buscarApi2f647e659f2ae29cad5423e3d6248ee7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi2f647e659f2ae29cad5423e3d6248ee7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi2f647e659f2ae29cad5423e3d6248ee7.form = buscarApi2f647e659f2ae29cad5423e3d6248ee7Form
    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
const buscarApi124bf748977a65c9d7e76c3fc9c13e6d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'get',
})

buscarApi124bf748977a65c9d7e76c3fc9c13e6d.definition = {
    methods: ["get","head"],
    url: '/api/productos/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url = (options?: RouteQueryOptions) => {
    return buscarApi124bf748977a65c9d7e76c3fc9c13e6d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscarApi124bf748977a65c9d7e76c3fc9c13e6d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
    const buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
        buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::buscarApi
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
        buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi124bf748977a65c9d7e76c3fc9c13e6d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi124bf748977a65c9d7e76c3fc9c13e6d.form = buscarApi124bf748977a65c9d7e76c3fc9c13e6dForm

export const buscarApi = {
    '/api/app/productos/buscar': buscarApi2f647e659f2ae29cad5423e3d6248ee7,
    '/api/productos/buscar': buscarApi124bf748977a65c9d7e76c3fc9c13e6d,
}

/**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
export const listarApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarApi.url(options),
    method: 'get',
})

listarApi.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/listar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
listarApi.url = (options?: RouteQueryOptions) => {
    return listarApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
listarApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
listarApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listarApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
    const listarApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listarApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
        listarApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::listarApi
 * @see app/Http/Controllers/ProductoController.php:4087
 * @route '/api/app/productos/listar'
 */
        listarApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listarApi.form = listarApiForm
/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
const showApibf7395ef11ddc0ca3b5c235b5d86f8b9 = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'get',
})

showApibf7395ef11ddc0ca3b5c235b5d86f8b9.definition = {
    methods: ["get","head"],
    url: '/api/app/productos/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return showApibf7395ef11ddc0ca3b5c235b5d86f8b9.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
showApibf7395ef11ddc0ca3b5c235b5d86f8b9.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
    const showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
        showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/app/productos/{producto}'
 */
        showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApibf7395ef11ddc0ca3b5c235b5d86f8b9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApibf7395ef11ddc0ca3b5c235b5d86f8b9.form = showApibf7395ef11ddc0ca3b5c235b5d86f8b9Form
    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
const showApib4e9327e675be9b4660423209f3885e4 = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'get',
})

showApib4e9327e675be9b4660423209f3885e4.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return showApib4e9327e675be9b4660423209f3885e4.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
showApib4e9327e675be9b4660423209f3885e4.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
    const showApib4e9327e675be9b4660423209f3885e4Form = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
        showApib4e9327e675be9b4660423209f3885e4Form.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApib4e9327e675be9b4660423209f3885e4.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::showApi
 * @see app/Http/Controllers/ProductoController.php:1918
 * @route '/api/productos/{producto}'
 */
        showApib4e9327e675be9b4660423209f3885e4Form.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApib4e9327e675be9b4660423209f3885e4.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApib4e9327e675be9b4660423209f3885e4.form = showApib4e9327e675be9b4660423209f3885e4Form

export const showApi = {
    '/api/app/productos/{producto}': showApibf7395ef11ddc0ca3b5c235b5d86f8b9,
    '/api/productos/{producto}': showApib4e9327e675be9b4660423209f3885e4,
}

/**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
export const obtenerStock = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStock.url(args, options),
    method: 'get',
})

obtenerStock.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
obtenerStock.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerStock.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
obtenerStock.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStock.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
obtenerStock.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerStock.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
    const obtenerStockForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerStock.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
        obtenerStockForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerStock.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::obtenerStock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
        obtenerStockForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProductoController::obtenerStockMultiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
export const obtenerStockMultiples = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: obtenerStockMultiples.url(options),
    method: 'post',
})

obtenerStockMultiples.definition = {
    methods: ["post"],
    url: '/api/productos/stock/multiples',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::obtenerStockMultiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
obtenerStockMultiples.url = (options?: RouteQueryOptions) => {
    return obtenerStockMultiples.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::obtenerStockMultiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
obtenerStockMultiples.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: obtenerStockMultiples.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::obtenerStockMultiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
    const obtenerStockMultiplesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: obtenerStockMultiples.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::obtenerStockMultiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
        obtenerStockMultiplesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: obtenerStockMultiples.url(options),
            method: 'post',
        })
    
    obtenerStockMultiples.form = obtenerStockMultiplesForm
/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see app/Http/Controllers/ProductoController.php:2078
 * @route '/api/productos'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see app/Http/Controllers/ProductoController.php:2078
 * @route '/api/productos'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see app/Http/Controllers/ProductoController.php:2078
 * @route '/api/productos'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see app/Http/Controllers/ProductoController.php:2078
 * @route '/api/productos'
 */
    const storeApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::storeApi
 * @see app/Http/Controllers/ProductoController.php:2078
 * @route '/api/productos'
 */
        storeApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeApi.url(options),
            method: 'post',
        })
    
    storeApi.form = storeApiForm
/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see app/Http/Controllers/ProductoController.php:2124
 * @route '/api/productos/{producto}'
 */
export const updateApi = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

updateApi.definition = {
    methods: ["put"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see app/Http/Controllers/ProductoController.php:2124
 * @route '/api/productos/{producto}'
 */
updateApi.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateApi.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see app/Http/Controllers/ProductoController.php:2124
 * @route '/api/productos/{producto}'
 */
updateApi.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see app/Http/Controllers/ProductoController.php:2124
 * @route '/api/productos/{producto}'
 */
    const updateApiForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::updateApi
 * @see app/Http/Controllers/ProductoController.php:2124
 * @route '/api/productos/{producto}'
 */
        updateApiForm.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateApi.form = updateApiForm
/**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see app/Http/Controllers/ProductoController.php:2158
 * @route '/api/productos/{producto}'
 */
export const destroyApi = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

destroyApi.definition = {
    methods: ["delete"],
    url: '/api/productos/{producto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see app/Http/Controllers/ProductoController.php:2158
 * @route '/api/productos/{producto}'
 */
destroyApi.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyApi.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see app/Http/Controllers/ProductoController.php:2158
 * @route '/api/productos/{producto}'
 */
destroyApi.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see app/Http/Controllers/ProductoController.php:2158
 * @route '/api/productos/{producto}'
 */
    const destroyApiForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyApi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::destroyApi
 * @see app/Http/Controllers/ProductoController.php:2158
 * @route '/api/productos/{producto}'
 */
        destroyApiForm.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyApi.form = destroyApiForm
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
const historialPrecios0c937dd5e26e036352e6a5c6b0e5435f = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, options),
    method: 'get',
})

historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/historial-precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
    const historialPrecios0c937dd5e26e036352e6a5c6b0e5435fForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
        historialPrecios0c937dd5e26e036352e6a5c6b0e5435fForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/api/productos/{producto}/historial-precios'
 */
        historialPrecios0c937dd5e26e036352e6a5c6b0e5435fForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialPrecios0c937dd5e26e036352e6a5c6b0e5435f.form = historialPrecios0c937dd5e26e036352e6a5c6b0e5435fForm
    /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
const historialPrecios91e45b35dc8bead9d21dd496abe33a36 = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, options),
    method: 'get',
})

historialPrecios91e45b35dc8bead9d21dd496abe33a36.definition = {
    methods: ["get","head"],
    url: '/productos/{producto}/historial-precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios91e45b35dc8bead9d21dd496abe33a36.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return historialPrecios91e45b35dc8bead9d21dd496abe33a36.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios91e45b35dc8bead9d21dd496abe33a36.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios91e45b35dc8bead9d21dd496abe33a36.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
    const historialPrecios91e45b35dc8bead9d21dd496abe33a36Form = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
        historialPrecios91e45b35dc8bead9d21dd496abe33a36Form.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
        historialPrecios91e45b35dc8bead9d21dd496abe33a36Form.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios91e45b35dc8bead9d21dd496abe33a36.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialPrecios91e45b35dc8bead9d21dd496abe33a36.form = historialPrecios91e45b35dc8bead9d21dd496abe33a36Form

export const historialPrecios = {
    '/api/productos/{producto}/historial-precios': historialPrecios0c937dd5e26e036352e6a5c6b0e5435f,
    '/productos/{producto}/historial-precios': historialPrecios91e45b35dc8bead9d21dd496abe33a36,
}

/**
* @see \App\Http\Controllers\ProductoController::importarProductosMasivos
 * @see app/Http/Controllers/ProductoController.php:2795
 * @route '/api/productos/importar-masivo'
 */
export const importarProductosMasivos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarProductosMasivos.url(options),
    method: 'post',
})

importarProductosMasivos.definition = {
    methods: ["post"],
    url: '/api/productos/importar-masivo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::importarProductosMasivos
 * @see app/Http/Controllers/ProductoController.php:2795
 * @route '/api/productos/importar-masivo'
 */
importarProductosMasivos.url = (options?: RouteQueryOptions) => {
    return importarProductosMasivos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::importarProductosMasivos
 * @see app/Http/Controllers/ProductoController.php:2795
 * @route '/api/productos/importar-masivo'
 */
importarProductosMasivos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarProductosMasivos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::importarProductosMasivos
 * @see app/Http/Controllers/ProductoController.php:2795
 * @route '/api/productos/importar-masivo'
 */
    const importarProductosMasivosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importarProductosMasivos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::importarProductosMasivos
 * @see app/Http/Controllers/ProductoController.php:2795
 * @route '/api/productos/importar-masivo'
 */
        importarProductosMasivosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importarProductosMasivos.url(options),
            method: 'post',
        })
    
    importarProductosMasivos.form = importarProductosMasivosForm
/**
* @see \App\Http\Controllers\ProductoController::validarProductosCSV
 * @see app/Http/Controllers/ProductoController.php:3271
 * @route '/api/productos/validar-csv'
 */
export const validarProductosCSV = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validarProductosCSV.url(options),
    method: 'post',
})

validarProductosCSV.definition = {
    methods: ["post"],
    url: '/api/productos/validar-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::validarProductosCSV
 * @see app/Http/Controllers/ProductoController.php:3271
 * @route '/api/productos/validar-csv'
 */
validarProductosCSV.url = (options?: RouteQueryOptions) => {
    return validarProductosCSV.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::validarProductosCSV
 * @see app/Http/Controllers/ProductoController.php:3271
 * @route '/api/productos/validar-csv'
 */
validarProductosCSV.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validarProductosCSV.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::validarProductosCSV
 * @see app/Http/Controllers/ProductoController.php:3271
 * @route '/api/productos/validar-csv'
 */
    const validarProductosCSVForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validarProductosCSV.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::validarProductosCSV
 * @see app/Http/Controllers/ProductoController.php:3271
 * @route '/api/productos/validar-csv'
 */
        validarProductosCSVForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validarProductosCSV.url(options),
            method: 'post',
        })
    
    validarProductosCSV.form = validarProductosCSVForm
/**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
export const listarCargasMasivas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCargasMasivas.url(options),
    method: 'get',
})

listarCargasMasivas.definition = {
    methods: ["get","head"],
    url: '/api/productos/cargas-masivas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
listarCargasMasivas.url = (options?: RouteQueryOptions) => {
    return listarCargasMasivas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
listarCargasMasivas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCargasMasivas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
listarCargasMasivas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listarCargasMasivas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
    const listarCargasMasivasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listarCargasMasivas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
        listarCargasMasivasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCargasMasivas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::listarCargasMasivas
 * @see app/Http/Controllers/ProductoController.php:3392
 * @route '/api/productos/cargas-masivas'
 */
        listarCargasMasivasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCargasMasivas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listarCargasMasivas.form = listarCargasMasivasForm
/**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
export const verCargaMasiva = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verCargaMasiva.url(args, options),
    method: 'get',
})

verCargaMasiva.definition = {
    methods: ["get","head"],
    url: '/api/productos/cargas-masivas/{cargo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
verCargaMasiva.url = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cargo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cargo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cargo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cargo: typeof args.cargo === 'object'
                ? args.cargo.id
                : args.cargo,
                }

    return verCargaMasiva.definition.url
            .replace('{cargo}', parsedArgs.cargo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
verCargaMasiva.get = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verCargaMasiva.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
verCargaMasiva.head = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verCargaMasiva.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
    const verCargaMasivaForm = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verCargaMasiva.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
        verCargaMasivaForm.get = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verCargaMasiva.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::verCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3418
 * @route '/api/productos/cargas-masivas/{cargo}'
 */
        verCargaMasivaForm.head = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verCargaMasiva.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verCargaMasiva.form = verCargaMasivaForm
/**
* @see \App\Http\Controllers\ProductoController::revertirCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3433
 * @route '/api/productos/cargas-masivas/{cargo}/revertir'
 */
export const revertirCargaMasiva = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revertirCargaMasiva.url(args, options),
    method: 'post',
})

revertirCargaMasiva.definition = {
    methods: ["post"],
    url: '/api/productos/cargas-masivas/{cargo}/revertir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::revertirCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3433
 * @route '/api/productos/cargas-masivas/{cargo}/revertir'
 */
revertirCargaMasiva.url = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cargo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cargo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cargo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cargo: typeof args.cargo === 'object'
                ? args.cargo.id
                : args.cargo,
                }

    return revertirCargaMasiva.definition.url
            .replace('{cargo}', parsedArgs.cargo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::revertirCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3433
 * @route '/api/productos/cargas-masivas/{cargo}/revertir'
 */
revertirCargaMasiva.post = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revertirCargaMasiva.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::revertirCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3433
 * @route '/api/productos/cargas-masivas/{cargo}/revertir'
 */
    const revertirCargaMasivaForm = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revertirCargaMasiva.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::revertirCargaMasiva
 * @see app/Http/Controllers/ProductoController.php:3433
 * @route '/api/productos/cargas-masivas/{cargo}/revertir'
 */
        revertirCargaMasivaForm.post = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revertirCargaMasiva.url(args, options),
            method: 'post',
        })
    
    revertirCargaMasiva.form = revertirCargaMasivaForm
/**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
export const createModerno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createModerno.url(options),
    method: 'get',
})

createModerno.definition = {
    methods: ["get","head"],
    url: '/productos/crear/moderno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
createModerno.url = (options?: RouteQueryOptions) => {
    return createModerno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
createModerno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createModerno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
createModerno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createModerno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
    const createModernoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createModerno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
        createModernoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createModerno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::createModerno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
        createModernoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createModerno.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createModerno.form = createModernoForm
/**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
export const getPaginados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaginados.url(options),
    method: 'get',
})

getPaginados.definition = {
    methods: ["get","head"],
    url: '/productos/paginados/listar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
getPaginados.url = (options?: RouteQueryOptions) => {
    return getPaginados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
getPaginados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaginados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
getPaginados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPaginados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
    const getPaginadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPaginados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
        getPaginadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPaginados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::getPaginados
 * @see app/Http/Controllers/ProductoController.php:3892
 * @route '/productos/paginados/listar'
 */
        getPaginadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPaginados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPaginados.form = getPaginadosForm
/**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
export const getFiltrosData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFiltrosData.url(options),
    method: 'get',
})

getFiltrosData.definition = {
    methods: ["get","head"],
    url: '/productos/filtros/datos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
getFiltrosData.url = (options?: RouteQueryOptions) => {
    return getFiltrosData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
getFiltrosData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFiltrosData.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
getFiltrosData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFiltrosData.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
    const getFiltrosDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getFiltrosData.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
        getFiltrosDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFiltrosData.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::getFiltrosData
 * @see app/Http/Controllers/ProductoController.php:4010
 * @route '/productos/filtros/datos'
 */
        getFiltrosDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getFiltrosData.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getFiltrosData.form = getFiltrosDataForm
/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
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
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/productos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
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
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
export const edit = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/productos/{producto}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
    const editForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
        editForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
        editForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
export const update = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/productos/{producto}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.patch = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
    const updateForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
        updateForm.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
        updateForm.patch = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
export const destroy = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/productos/{producto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
destroy.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
destroy.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
    const destroyForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
        destroyForm.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProductoController = { indexApi, filtros, buscarApi, listarApi, showApi, obtenerStock, obtenerStockMultiples, storeApi, updateApi, destroyApi, historialPrecios, importarProductosMasivos, validarProductosCSV, listarCargasMasivas, verCargaMasiva, revertirCargaMasiva, createModerno, getPaginados, getFiltrosData, index, create, store, edit, update, destroy }

export default ProductoController