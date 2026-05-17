import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
const index3f893ed87bfeddb33991dd3ccb9f0af8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
    method: 'get',
})

index3f893ed87bfeddb33991dd3ccb9f0af8.definition = {
    methods: ["get","head"],
    url: '/api/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
index3f893ed87bfeddb33991dd3ccb9f0af8.url = (options?: RouteQueryOptions) => {
    return index3f893ed87bfeddb33991dd3ccb9f0af8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
index3f893ed87bfeddb33991dd3ccb9f0af8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
index3f893ed87bfeddb33991dd3ccb9f0af8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
    const index3f893ed87bfeddb33991dd3ccb9f0af8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
        index3f893ed87bfeddb33991dd3ccb9f0af8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/api/clientes'
 */
        index3f893ed87bfeddb33991dd3ccb9f0af8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index3f893ed87bfeddb33991dd3ccb9f0af8.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index3f893ed87bfeddb33991dd3ccb9f0af8.form = index3f893ed87bfeddb33991dd3ccb9f0af8Form
    /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
const index0627f617c87b7e3ae7d3a946494aca1a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0627f617c87b7e3ae7d3a946494aca1a.url(options),
    method: 'get',
})

index0627f617c87b7e3ae7d3a946494aca1a.definition = {
    methods: ["get","head"],
    url: '/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
index0627f617c87b7e3ae7d3a946494aca1a.url = (options?: RouteQueryOptions) => {
    return index0627f617c87b7e3ae7d3a946494aca1a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
index0627f617c87b7e3ae7d3a946494aca1a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0627f617c87b7e3ae7d3a946494aca1a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
index0627f617c87b7e3ae7d3a946494aca1a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index0627f617c87b7e3ae7d3a946494aca1a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
    const index0627f617c87b7e3ae7d3a946494aca1aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index0627f617c87b7e3ae7d3a946494aca1a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
        index0627f617c87b7e3ae7d3a946494aca1aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index0627f617c87b7e3ae7d3a946494aca1a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::index
 * @see app/Http/Controllers/ClienteController.php:166
 * @route '/clientes'
 */
        index0627f617c87b7e3ae7d3a946494aca1aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index0627f617c87b7e3ae7d3a946494aca1a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index0627f617c87b7e3ae7d3a946494aca1a.form = index0627f617c87b7e3ae7d3a946494aca1aForm

export const index = {
    '/api/clientes': index3f893ed87bfeddb33991dd3ccb9f0af8,
    '/clientes': index0627f617c87b7e3ae7d3a946494aca1a,
}

/**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/api/clientes'
 */
const store3f893ed87bfeddb33991dd3ccb9f0af8 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
    method: 'post',
})

store3f893ed87bfeddb33991dd3ccb9f0af8.definition = {
    methods: ["post"],
    url: '/api/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/api/clientes'
 */
store3f893ed87bfeddb33991dd3ccb9f0af8.url = (options?: RouteQueryOptions) => {
    return store3f893ed87bfeddb33991dd3ccb9f0af8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/api/clientes'
 */
store3f893ed87bfeddb33991dd3ccb9f0af8.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/api/clientes'
 */
    const store3f893ed87bfeddb33991dd3ccb9f0af8Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/api/clientes'
 */
        store3f893ed87bfeddb33991dd3ccb9f0af8Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store3f893ed87bfeddb33991dd3ccb9f0af8.url(options),
            method: 'post',
        })
    
    store3f893ed87bfeddb33991dd3ccb9f0af8.form = store3f893ed87bfeddb33991dd3ccb9f0af8Form
    /**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/clientes'
 */
const store0627f617c87b7e3ae7d3a946494aca1a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store0627f617c87b7e3ae7d3a946494aca1a.url(options),
    method: 'post',
})

store0627f617c87b7e3ae7d3a946494aca1a.definition = {
    methods: ["post"],
    url: '/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/clientes'
 */
store0627f617c87b7e3ae7d3a946494aca1a.url = (options?: RouteQueryOptions) => {
    return store0627f617c87b7e3ae7d3a946494aca1a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/clientes'
 */
store0627f617c87b7e3ae7d3a946494aca1a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store0627f617c87b7e3ae7d3a946494aca1a.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/clientes'
 */
    const store0627f617c87b7e3ae7d3a946494aca1aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store0627f617c87b7e3ae7d3a946494aca1a.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::store
 * @see app/Http/Controllers/ClienteController.php:263
 * @route '/clientes'
 */
        store0627f617c87b7e3ae7d3a946494aca1aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store0627f617c87b7e3ae7d3a946494aca1a.url(options),
            method: 'post',
        })
    
    store0627f617c87b7e3ae7d3a946494aca1a.form = store0627f617c87b7e3ae7d3a946494aca1aForm

export const store = {
    '/api/clientes': store3f893ed87bfeddb33991dd3ccb9f0af8,
    '/clientes': store0627f617c87b7e3ae7d3a946494aca1a,
}

/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
export const buscarApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})

buscarApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
buscarApi.url = (options?: RouteQueryOptions) => {
    return buscarApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
buscarApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
buscarApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
    const buscarApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
        buscarApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::buscarApi
 * @see app/Http/Controllers/ClienteController.php:981
 * @route '/api/clientes/buscar'
 */
        buscarApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarApi.form = buscarApiForm
/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/clientes/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::search
 * @see app/Http/Controllers/ClienteController.php:2454
 * @route '/api/clientes/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
export const miPerfil = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: miPerfil.url(options),
    method: 'get',
})

miPerfil.definition = {
    methods: ["get","head"],
    url: '/api/clientes/mi-perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
miPerfil.url = (options?: RouteQueryOptions) => {
    return miPerfil.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
miPerfil.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: miPerfil.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
miPerfil.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: miPerfil.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
    const miPerfilForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: miPerfil.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
        miPerfilForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: miPerfil.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::miPerfil
 * @see app/Http/Controllers/ClienteController.php:752
 * @route '/api/clientes/mi-perfil'
 */
        miPerfilForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: miPerfil.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    miPerfil.form = miPerfilForm
/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
export const showApi = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
showApi.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return showApi.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
showApi.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
showApi.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
    const showApiForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
        showApiForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::showApi
 * @see app/Http/Controllers/ClienteController.php:699
 * @route '/api/clientes/{cliente}'
 */
        showApiForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/api/clientes/{cliente}'
 */
const updateb4aecc3f2a1150c4870c6b2353680aa8 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateb4aecc3f2a1150c4870c6b2353680aa8.url(args, options),
    method: 'put',
})

updateb4aecc3f2a1150c4870c6b2353680aa8.definition = {
    methods: ["put"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/api/clientes/{cliente}'
 */
updateb4aecc3f2a1150c4870c6b2353680aa8.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateb4aecc3f2a1150c4870c6b2353680aa8.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/api/clientes/{cliente}'
 */
updateb4aecc3f2a1150c4870c6b2353680aa8.put = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateb4aecc3f2a1150c4870c6b2353680aa8.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/api/clientes/{cliente}'
 */
    const updateb4aecc3f2a1150c4870c6b2353680aa8Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateb4aecc3f2a1150c4870c6b2353680aa8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/api/clientes/{cliente}'
 */
        updateb4aecc3f2a1150c4870c6b2353680aa8Form.put = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateb4aecc3f2a1150c4870c6b2353680aa8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateb4aecc3f2a1150c4870c6b2353680aa8.form = updateb4aecc3f2a1150c4870c6b2353680aa8Form
    /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
const update5b845d2a69a6f256699117f439758ef1 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update5b845d2a69a6f256699117f439758ef1.url(args, options),
    method: 'put',
})

update5b845d2a69a6f256699117f439758ef1.definition = {
    methods: ["put","patch"],
    url: '/clientes/{cliente}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
update5b845d2a69a6f256699117f439758ef1.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update5b845d2a69a6f256699117f439758ef1.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
update5b845d2a69a6f256699117f439758ef1.put = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update5b845d2a69a6f256699117f439758ef1.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
update5b845d2a69a6f256699117f439758ef1.patch = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update5b845d2a69a6f256699117f439758ef1.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
    const update5b845d2a69a6f256699117f439758ef1Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update5b845d2a69a6f256699117f439758ef1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
        update5b845d2a69a6f256699117f439758ef1Form.put = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update5b845d2a69a6f256699117f439758ef1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ClienteController::update
 * @see app/Http/Controllers/ClienteController.php:347
 * @route '/clientes/{cliente}'
 */
        update5b845d2a69a6f256699117f439758ef1Form.patch = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update5b845d2a69a6f256699117f439758ef1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update5b845d2a69a6f256699117f439758ef1.form = update5b845d2a69a6f256699117f439758ef1Form

export const update = {
    '/api/clientes/{cliente}': updateb4aecc3f2a1150c4870c6b2353680aa8,
    '/clientes/{cliente}': update5b845d2a69a6f256699117f439758ef1,
}

/**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/api/clientes/{cliente}'
 */
const destroyb4aecc3f2a1150c4870c6b2353680aa8 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyb4aecc3f2a1150c4870c6b2353680aa8.url(args, options),
    method: 'delete',
})

destroyb4aecc3f2a1150c4870c6b2353680aa8.definition = {
    methods: ["delete"],
    url: '/api/clientes/{cliente}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/api/clientes/{cliente}'
 */
destroyb4aecc3f2a1150c4870c6b2353680aa8.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyb4aecc3f2a1150c4870c6b2353680aa8.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/api/clientes/{cliente}'
 */
destroyb4aecc3f2a1150c4870c6b2353680aa8.delete = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyb4aecc3f2a1150c4870c6b2353680aa8.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/api/clientes/{cliente}'
 */
    const destroyb4aecc3f2a1150c4870c6b2353680aa8Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyb4aecc3f2a1150c4870c6b2353680aa8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/api/clientes/{cliente}'
 */
        destroyb4aecc3f2a1150c4870c6b2353680aa8Form.delete = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyb4aecc3f2a1150c4870c6b2353680aa8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyb4aecc3f2a1150c4870c6b2353680aa8.form = destroyb4aecc3f2a1150c4870c6b2353680aa8Form
    /**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/clientes/{cliente}'
 */
const destroy5b845d2a69a6f256699117f439758ef1 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5b845d2a69a6f256699117f439758ef1.url(args, options),
    method: 'delete',
})

destroy5b845d2a69a6f256699117f439758ef1.definition = {
    methods: ["delete"],
    url: '/clientes/{cliente}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/clientes/{cliente}'
 */
destroy5b845d2a69a6f256699117f439758ef1.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy5b845d2a69a6f256699117f439758ef1.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/clientes/{cliente}'
 */
destroy5b845d2a69a6f256699117f439758ef1.delete = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy5b845d2a69a6f256699117f439758ef1.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/clientes/{cliente}'
 */
    const destroy5b845d2a69a6f256699117f439758ef1Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy5b845d2a69a6f256699117f439758ef1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::destroy
 * @see app/Http/Controllers/ClienteController.php:647
 * @route '/clientes/{cliente}'
 */
        destroy5b845d2a69a6f256699117f439758ef1Form.delete = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy5b845d2a69a6f256699117f439758ef1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy5b845d2a69a6f256699117f439758ef1.form = destroy5b845d2a69a6f256699117f439758ef1Form

export const destroy = {
    '/api/clientes/{cliente}': destroyb4aecc3f2a1150c4870c6b2353680aa8,
    '/clientes/{cliente}': destroy5b845d2a69a6f256699117f439758ef1,
}

/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
export const saldoCuentasPorCobrar = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'get',
})

saldoCuentasPorCobrar.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/saldo-cuentas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return saldoCuentasPorCobrar.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
saldoCuentasPorCobrar.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: saldoCuentasPorCobrar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
    const saldoCuentasPorCobrarForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: saldoCuentasPorCobrar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
        saldoCuentasPorCobrarForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: saldoCuentasPorCobrar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::saldoCuentasPorCobrar
 * @see app/Http/Controllers/ClienteController.php:1010
 * @route '/api/clientes/{cliente}/saldo-cuentas'
 */
        saldoCuentasPorCobrarForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: saldoCuentasPorCobrar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    saldoCuentasPorCobrar.form = saldoCuentasPorCobrarForm
/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
export const historialVentas = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialVentas.url(args, options),
    method: 'get',
})

historialVentas.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/historial-ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return historialVentas.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialVentas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
historialVentas.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialVentas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
    const historialVentasForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialVentas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
        historialVentasForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialVentas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::historialVentas
 * @see app/Http/Controllers/ClienteController.php:1038
 * @route '/api/clientes/{cliente}/historial-ventas'
 */
        historialVentasForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialVentas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialVentas.form = historialVentasForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
const obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, options),
    method: 'get',
})

obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
    const obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
        obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237Form.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito/detalles'
 */
        obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237Form.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237.form = obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237Form
    /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
const obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, options),
    method: 'get',
})

obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito-detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
    const obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
        obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6Form.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerDetallesCreditoApi
 * @see app/Http/Controllers/ClienteController.php:1067
 * @route '/api/clientes/{cliente}/credito-detalles'
 */
        obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6Form.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6.form = obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6Form

export const obtenerDetallesCreditoApi = {
    '/api/clientes/{cliente}/credito/detalles': obtenerDetallesCreditoApi2d52a992b009e201e85c73eda1e88237,
    '/api/clientes/{cliente}/credito-detalles': obtenerDetallesCreditoApiba537ab0b5ba0daa0946f1450acab7f6,
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
export const obtenerAuditoriaCreditoApi = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAuditoriaCreditoApi.url(args, options),
    method: 'get',
})

obtenerAuditoriaCreditoApi.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/auditoria-credito',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
obtenerAuditoriaCreditoApi.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerAuditoriaCreditoApi.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
obtenerAuditoriaCreditoApi.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAuditoriaCreditoApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
obtenerAuditoriaCreditoApi.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerAuditoriaCreditoApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
    const obtenerAuditoriaCreditoApiForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerAuditoriaCreditoApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
        obtenerAuditoriaCreditoApiForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerAuditoriaCreditoApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerAuditoriaCreditoApi
 * @see app/Http/Controllers/ClienteController.php:803
 * @route '/api/clientes/{cliente}/auditoria-credito'
 */
        obtenerAuditoriaCreditoApiForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerAuditoriaCreditoApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerAuditoriaCreditoApi.form = obtenerAuditoriaCreditoApiForm
/**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/pagos'
 */
const registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.url(args, options),
    method: 'post',
})

registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/pagos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/pagos'
 */
registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/pagos'
 */
registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/pagos'
 */
    const registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/pagos'
 */
        registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934Form.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.url(args, options),
            method: 'post',
        })
    
    registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934.form = registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934Form
    /**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
const registrarPagoApi23a11197b3c624748d05c2199de0f6b8 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoApi23a11197b3c624748d05c2199de0f6b8.url(args, options),
    method: 'post',
})

registrarPagoApi23a11197b3c624748d05c2199de0f6b8.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
registrarPagoApi23a11197b3c624748d05c2199de0f6b8.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return registrarPagoApi23a11197b3c624748d05c2199de0f6b8.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
registrarPagoApi23a11197b3c624748d05c2199de0f6b8.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoApi23a11197b3c624748d05c2199de0f6b8.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
    const registrarPagoApi23a11197b3c624748d05c2199de0f6b8Form = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPagoApi23a11197b3c624748d05c2199de0f6b8.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::registrarPagoApi
 * @see app/Http/Controllers/ClienteController.php:1223
 * @route '/api/clientes/{cliente}/registrar-pago'
 */
        registrarPagoApi23a11197b3c624748d05c2199de0f6b8Form.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPagoApi23a11197b3c624748d05c2199de0f6b8.url(args, options),
            method: 'post',
        })
    
    registrarPagoApi23a11197b3c624748d05c2199de0f6b8.form = registrarPagoApi23a11197b3c624748d05c2199de0f6b8Form

export const registrarPagoApi = {
    '/api/clientes/{cliente}/pagos': registrarPagoApi8ef3e57bff7d87fadd96cf75cc339934,
    '/api/clientes/{cliente}/registrar-pago': registrarPagoApi23a11197b3c624748d05c2199de0f6b8,
}

/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:1565
 * @route '/api/clientes/cambiar-credenciales'
 */
export const cambiarCredenciales = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cambiarCredenciales.url(options),
    method: 'post',
})

cambiarCredenciales.definition = {
    methods: ["post"],
    url: '/api/clientes/cambiar-credenciales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:1565
 * @route '/api/clientes/cambiar-credenciales'
 */
cambiarCredenciales.url = (options?: RouteQueryOptions) => {
    return cambiarCredenciales.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:1565
 * @route '/api/clientes/cambiar-credenciales'
 */
cambiarCredenciales.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cambiarCredenciales.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:1565
 * @route '/api/clientes/cambiar-credenciales'
 */
    const cambiarCredencialesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cambiarCredenciales.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::cambiarCredenciales
 * @see app/Http/Controllers/ClienteController.php:1565
 * @route '/api/clientes/cambiar-credenciales'
 */
        cambiarCredencialesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cambiarCredenciales.url(options),
            method: 'post',
        })
    
    cambiarCredenciales.form = cambiarCredencialesForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
export const obtenerCuentasPendientes = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerCuentasPendientes.url(args, options),
    method: 'get',
})

obtenerCuentasPendientes.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/cuentas-pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
obtenerCuentasPendientes.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerCuentasPendientes.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
obtenerCuentasPendientes.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerCuentasPendientes.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
obtenerCuentasPendientes.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerCuentasPendientes.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
    const obtenerCuentasPendientesForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerCuentasPendientes.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
        obtenerCuentasPendientesForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerCuentasPendientes.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasPendientes
 * @see app/Http/Controllers/ClienteController.php:1723
 * @route '/api/clientes/{cliente}/cuentas-pendientes'
 */
        obtenerCuentasPendientesForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerCuentasPendientes.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerCuentasPendientes.form = obtenerCuentasPendientesForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
export const obtenerCuentasVencidas = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerCuentasVencidas.url(args, options),
    method: 'get',
})

obtenerCuentasVencidas.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/cuentas-vencidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
obtenerCuentasVencidas.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerCuentasVencidas.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
obtenerCuentasVencidas.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerCuentasVencidas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
obtenerCuentasVencidas.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerCuentasVencidas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
    const obtenerCuentasVencidasForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerCuentasVencidas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
        obtenerCuentasVencidasForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerCuentasVencidas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerCuentasVencidas
 * @see app/Http/Controllers/ClienteController.php:1741
 * @route '/api/clientes/{cliente}/cuentas-vencidas'
 */
        obtenerCuentasVencidasForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerCuentasVencidas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerCuentasVencidas.form = obtenerCuentasVencidasForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
export const obtenerHistorialPagos = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerHistorialPagos.url(args, options),
    method: 'get',
})

obtenerHistorialPagos.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
obtenerHistorialPagos.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerHistorialPagos.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
obtenerHistorialPagos.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerHistorialPagos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
obtenerHistorialPagos.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerHistorialPagos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
    const obtenerHistorialPagosForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerHistorialPagos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
        obtenerHistorialPagosForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerHistorialPagos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerHistorialPagos
 * @see app/Http/Controllers/ClienteController.php:1759
 * @route '/api/clientes/{cliente}/pagos'
 */
        obtenerHistorialPagosForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerHistorialPagos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerHistorialPagos.form = obtenerHistorialPagosForm
/**
* @see \App\Http\Controllers\ClienteController::anularPago
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
export const anularPago = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

anularPago.definition = {
    methods: ["post"],
    url: '/api/clientes/pagos/{pago}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::anularPago
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
anularPago.url = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pago: args.pago,
                }

    return anularPago.definition.url
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::anularPago
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
anularPago.post = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::anularPago
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
    const anularPagoForm = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::anularPago
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
        anularPagoForm.post = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularPago.url(args, options),
            method: 'post',
        })
    
    anularPago.form = anularPagoForm
/**
* @see \App\Http\Controllers\ClienteController::ajustarLimiteCredito
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
export const ajustarLimiteCredito = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarLimiteCredito.url(args, options),
    method: 'post',
})

ajustarLimiteCredito.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/ajustar-limite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::ajustarLimiteCredito
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
ajustarLimiteCredito.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return ajustarLimiteCredito.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::ajustarLimiteCredito
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
ajustarLimiteCredito.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ajustarLimiteCredito.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::ajustarLimiteCredito
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
    const ajustarLimiteCreditoForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ajustarLimiteCredito.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::ajustarLimiteCredito
 * @see app/Http/Controllers/ClienteController.php:1984
 * @route '/api/clientes/{cliente}/ajustar-limite'
 */
        ajustarLimiteCreditoForm.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ajustarLimiteCredito.url(args, options),
            method: 'post',
        })
    
    ajustarLimiteCredito.form = ajustarLimiteCreditoForm
/**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
export const imprimirCredito = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirCredito.url(args, options),
    method: 'get',
})

imprimirCredito.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimirCredito.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimirCredito.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimirCredito.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirCredito.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimirCredito.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirCredito.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
    const imprimirCreditoForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirCredito.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
        imprimirCreditoForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirCredito.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::imprimirCredito
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
        imprimirCreditoForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirCredito.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirCredito.form = imprimirCreditoForm
/**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
export const previewCredito = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewCredito.url(args, options),
    method: 'get',
})

previewCredito.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
previewCredito.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return previewCredito.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
previewCredito.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewCredito.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
previewCredito.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewCredito.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
    const previewCreditoForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewCredito.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
        previewCreditoForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewCredito.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::previewCredito
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
        previewCreditoForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewCredito.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewCredito.form = previewCreditoForm
/**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
export const imprimirPago = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirPago.url(args, options),
    method: 'get',
})

imprimirPago.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos/{pago}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimirPago.url = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return imprimirPago.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimirPago.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirPago.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimirPago.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirPago.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
    const imprimirPagoForm = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirPago.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
        imprimirPagoForm.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirPago.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::imprimirPago
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
        imprimirPagoForm.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirPago.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirPago.form = imprimirPagoForm
/**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
export const previewPago = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPago.url(args, options),
    method: 'get',
})

previewPago.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos/{pago}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
previewPago.url = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return previewPago.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
previewPago.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPago.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
previewPago.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewPago.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
    const previewPagoForm = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewPago.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
        previewPagoForm.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPago.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::previewPago
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
        previewPagoForm.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPago.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewPago.form = previewPagoForm
/**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
export const listarCreditos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCreditos.url(options),
    method: 'get',
})

listarCreditos.definition = {
    methods: ["get","head"],
    url: '/api/creditos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
listarCreditos.url = (options?: RouteQueryOptions) => {
    return listarCreditos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
listarCreditos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCreditos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
listarCreditos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listarCreditos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
    const listarCreditosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listarCreditos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
        listarCreditosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCreditos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::listarCreditos
 * @see app/Http/Controllers/ClienteController.php:1781
 * @route '/api/creditos'
 */
        listarCreditosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCreditos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listarCreditos.form = listarCreditosForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
export const obtenerMiCredito = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMiCredito.url(options),
    method: 'get',
})

obtenerMiCredito.definition = {
    methods: ["get","head"],
    url: '/api/creditos/mi-credito',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
obtenerMiCredito.url = (options?: RouteQueryOptions) => {
    return obtenerMiCredito.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
obtenerMiCredito.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMiCredito.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
obtenerMiCredito.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerMiCredito.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
    const obtenerMiCreditoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerMiCredito.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
        obtenerMiCreditoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerMiCredito.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerMiCredito
 * @see app/Http/Controllers/ClienteController.php:1849
 * @route '/api/creditos/mi-credito'
 */
        obtenerMiCreditoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerMiCredito.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerMiCredito.form = obtenerMiCreditoForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
export const obtenerResumenCredito = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenCredito.url(args, options),
    method: 'get',
})

obtenerResumenCredito.definition = {
    methods: ["get","head"],
    url: '/api/creditos/cliente/{clienteId}/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
obtenerResumenCredito.url = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clienteId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clienteId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clienteId: args.clienteId,
                }

    return obtenerResumenCredito.definition.url
            .replace('{clienteId}', parsedArgs.clienteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
obtenerResumenCredito.get = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenCredito.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
obtenerResumenCredito.head = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumenCredito.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
    const obtenerResumenCreditoForm = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerResumenCredito.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
        obtenerResumenCreditoForm.get = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumenCredito.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerResumenCredito
 * @see app/Http/Controllers/ClienteController.php:1899
 * @route '/api/creditos/cliente/{clienteId}/resumen'
 */
        obtenerResumenCreditoForm.head = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumenCredito.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerResumenCredito.form = obtenerResumenCreditoForm
/**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
export const obtenerEstadisticasCreditos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEstadisticasCreditos.url(options),
    method: 'get',
})

obtenerEstadisticasCreditos.definition = {
    methods: ["get","head"],
    url: '/api/creditos/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
obtenerEstadisticasCreditos.url = (options?: RouteQueryOptions) => {
    return obtenerEstadisticasCreditos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
obtenerEstadisticasCreditos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEstadisticasCreditos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
obtenerEstadisticasCreditos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerEstadisticasCreditos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
    const obtenerEstadisticasCreditosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerEstadisticasCreditos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
        obtenerEstadisticasCreditosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEstadisticasCreditos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::obtenerEstadisticasCreditos
 * @see app/Http/Controllers/ClienteController.php:1932
 * @route '/api/creditos/estadisticas'
 */
        obtenerEstadisticasCreditosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEstadisticasCreditos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerEstadisticasCreditos.form = obtenerEstadisticasCreditosForm
/**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
export const exportarReporteCreditos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarReporteCreditos.url(options),
    method: 'get',
})

exportarReporteCreditos.definition = {
    methods: ["get","head"],
    url: '/api/creditos/exportar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
exportarReporteCreditos.url = (options?: RouteQueryOptions) => {
    return exportarReporteCreditos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
exportarReporteCreditos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarReporteCreditos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
exportarReporteCreditos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarReporteCreditos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
    const exportarReporteCreditosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarReporteCreditos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
        exportarReporteCreditosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarReporteCreditos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::exportarReporteCreditos
 * @see app/Http/Controllers/ClienteController.php:1955
 * @route '/api/creditos/exportar'
 */
        exportarReporteCreditosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarReporteCreditos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarReporteCreditos.form = exportarReporteCreditosForm
/**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/clientes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::create
 * @see app/Http/Controllers/ClienteController.php:240
 * @route '/clientes/create'
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
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
export const show = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
show.url = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: args.cliente,
                }

    return show.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
show.get = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
show.head = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
    const showForm = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
        showForm.get = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::show
 * @see app/Http/Controllers/ClienteController.php:0
 * @route '/clientes/{cliente}'
 */
        showForm.head = (args: { cliente: string | number } | [cliente: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
export const edit = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
edit.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
edit.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
edit.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
    const editForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
        editForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::edit
 * @see app/Http/Controllers/ClienteController.php:308
 * @route '/clientes/{cliente}/edit'
 */
        editForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const ClienteController = { index, store, buscarApi, search, miPerfil, showApi, update, destroy, saldoCuentasPorCobrar, historialVentas, obtenerDetallesCreditoApi, obtenerAuditoriaCreditoApi, registrarPagoApi, cambiarCredenciales, obtenerCuentasPendientes, obtenerCuentasVencidas, obtenerHistorialPagos, anularPago, ajustarLimiteCredito, imprimirCredito, previewCredito, imprimirPago, previewPago, listarCreditos, obtenerMiCredito, obtenerResumenCredito, obtenerEstadisticasCreditos, exportarReporteCreditos, create, show, edit }

export default ClienteController