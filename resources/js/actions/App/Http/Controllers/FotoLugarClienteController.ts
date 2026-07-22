import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/api/clientes/{cliente}/fotos'
 */
const index458ad15718caf58fbbfe67bbeb6711ed = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index458ad15718caf58fbbfe67bbeb6711ed.url(args, options),
    method: 'get',
})

index458ad15718caf58fbbfe67bbeb6711ed.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/api/clientes/{cliente}/fotos'
 */
index458ad15718caf58fbbfe67bbeb6711ed.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index458ad15718caf58fbbfe67bbeb6711ed.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/api/clientes/{cliente}/fotos'
 */
index458ad15718caf58fbbfe67bbeb6711ed.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index458ad15718caf58fbbfe67bbeb6711ed.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/api/clientes/{cliente}/fotos'
 */
index458ad15718caf58fbbfe67bbeb6711ed.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index458ad15718caf58fbbfe67bbeb6711ed.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
const index56ae370be37b0bc83f754f89fc47bac1 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index56ae370be37b0bc83f754f89fc47bac1.url(args, options),
    method: 'get',
})

index56ae370be37b0bc83f754f89fc47bac1.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index56ae370be37b0bc83f754f89fc47bac1.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index56ae370be37b0bc83f754f89fc47bac1.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index56ae370be37b0bc83f754f89fc47bac1.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index56ae370be37b0bc83f754f89fc47bac1.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::index
 * @see app/Http/Controllers/FotoLugarClienteController.php:19
 * @route '/clientes/{cliente}/fotos'
 */
index56ae370be37b0bc83f754f89fc47bac1.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index56ae370be37b0bc83f754f89fc47bac1.url(args, options),
    method: 'head',
})

export const index = {
    '/api/clientes/{cliente}/fotos': index458ad15718caf58fbbfe67bbeb6711ed,
    '/clientes/{cliente}/fotos': index56ae370be37b0bc83f754f89fc47bac1,
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/api/clientes/{cliente}/fotos'
 */
const store458ad15718caf58fbbfe67bbeb6711ed = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store458ad15718caf58fbbfe67bbeb6711ed.url(args, options),
    method: 'post',
})

store458ad15718caf58fbbfe67bbeb6711ed.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/api/clientes/{cliente}/fotos'
 */
store458ad15718caf58fbbfe67bbeb6711ed.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store458ad15718caf58fbbfe67bbeb6711ed.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/api/clientes/{cliente}/fotos'
 */
store458ad15718caf58fbbfe67bbeb6711ed.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store458ad15718caf58fbbfe67bbeb6711ed.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
const store56ae370be37b0bc83f754f89fc47bac1 = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store56ae370be37b0bc83f754f89fc47bac1.url(args, options),
    method: 'post',
})

store56ae370be37b0bc83f754f89fc47bac1.definition = {
    methods: ["post"],
    url: '/clientes/{cliente}/fotos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
store56ae370be37b0bc83f754f89fc47bac1.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store56ae370be37b0bc83f754f89fc47bac1.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::store
 * @see app/Http/Controllers/FotoLugarClienteController.php:69
 * @route '/clientes/{cliente}/fotos'
 */
store56ae370be37b0bc83f754f89fc47bac1.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store56ae370be37b0bc83f754f89fc47bac1.url(args, options),
    method: 'post',
})

export const store = {
    '/api/clientes/{cliente}/fotos': store458ad15718caf58fbbfe67bbeb6711ed,
    '/clientes/{cliente}/fotos': store56ae370be37b0bc83f754f89fc47bac1,
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::uploadMultiple
 * @see app/Http/Controllers/FotoLugarClienteController.php:254
 * @route '/api/clientes/{cliente}/fotos/multiple'
 */
export const uploadMultiple = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMultiple.url(args, options),
    method: 'post',
})

uploadMultiple.definition = {
    methods: ["post"],
    url: '/api/clientes/{cliente}/fotos/multiple',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::uploadMultiple
 * @see app/Http/Controllers/FotoLugarClienteController.php:254
 * @route '/api/clientes/{cliente}/fotos/multiple'
 */
uploadMultiple.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadMultiple.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::uploadMultiple
 * @see app/Http/Controllers/FotoLugarClienteController.php:254
 * @route '/api/clientes/{cliente}/fotos/multiple'
 */
uploadMultiple.post = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMultiple.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
const showe0f767f38b847649456a620735e5ef57 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showe0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'get',
})

showe0f767f38b847649456a620735e5ef57.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
showe0f767f38b847649456a620735e5ef57.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return showe0f767f38b847649456a620735e5ef57.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
showe0f767f38b847649456a620735e5ef57.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showe0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
showe0f767f38b847649456a620735e5ef57.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showe0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
const show4753cea5abcfb03c077939bf3f1fd235 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'get',
})

show4753cea5abcfb03c077939bf3f1fd235.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show4753cea5abcfb03c077939bf3f1fd235.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return show4753cea5abcfb03c077939bf3f1fd235.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show4753cea5abcfb03c077939bf3f1fd235.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::show
 * @see app/Http/Controllers/FotoLugarClienteController.php:114
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
show4753cea5abcfb03c077939bf3f1fd235.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'head',
})

export const show = {
    '/api/clientes/{cliente}/fotos/{foto}': showe0f767f38b847649456a620735e5ef57,
    '/clientes/{cliente}/fotos/{foto}': show4753cea5abcfb03c077939bf3f1fd235,
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
const updatee0f767f38b847649456a620735e5ef57 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatee0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'put',
})

updatee0f767f38b847649456a620735e5ef57.definition = {
    methods: ["put"],
    url: '/api/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
updatee0f767f38b847649456a620735e5ef57.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return updatee0f767f38b847649456a620735e5ef57.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
updatee0f767f38b847649456a620735e5ef57.put = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatee0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
const update4753cea5abcfb03c077939bf3f1fd235 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'put',
})

update4753cea5abcfb03c077939bf3f1fd235.definition = {
    methods: ["put"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
update4753cea5abcfb03c077939bf3f1fd235.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return update4753cea5abcfb03c077939bf3f1fd235.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::update
 * @see app/Http/Controllers/FotoLugarClienteController.php:167
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
update4753cea5abcfb03c077939bf3f1fd235.put = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'put',
})

export const update = {
    '/api/clientes/{cliente}/fotos/{foto}': updatee0f767f38b847649456a620735e5ef57,
    '/clientes/{cliente}/fotos/{foto}': update4753cea5abcfb03c077939bf3f1fd235,
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
const destroye0f767f38b847649456a620735e5ef57 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroye0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'delete',
})

destroye0f767f38b847649456a620735e5ef57.definition = {
    methods: ["delete"],
    url: '/api/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
destroye0f767f38b847649456a620735e5ef57.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return destroye0f767f38b847649456a620735e5ef57.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/api/clientes/{cliente}/fotos/{foto}'
 */
destroye0f767f38b847649456a620735e5ef57.delete = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroye0f767f38b847649456a620735e5ef57.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
const destroy4753cea5abcfb03c077939bf3f1fd235 = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'delete',
})

destroy4753cea5abcfb03c077939bf3f1fd235.definition = {
    methods: ["delete"],
    url: '/clientes/{cliente}/fotos/{foto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
destroy4753cea5abcfb03c077939bf3f1fd235.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return destroy4753cea5abcfb03c077939bf3f1fd235.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::destroy
 * @see app/Http/Controllers/FotoLugarClienteController.php:220
 * @route '/clientes/{cliente}/fotos/{foto}'
 */
destroy4753cea5abcfb03c077939bf3f1fd235.delete = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4753cea5abcfb03c077939bf3f1fd235.url(args, options),
    method: 'delete',
})

export const destroy = {
    '/api/clientes/{cliente}/fotos/{foto}': destroye0f767f38b847649456a620735e5ef57,
    '/clientes/{cliente}/fotos/{foto}': destroy4753cea5abcfb03c077939bf3f1fd235,
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
export const create = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::create
 * @see app/Http/Controllers/FotoLugarClienteController.php:48
 * @route '/clientes/{cliente}/fotos/create'
 */
create.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
export const edit = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/clientes/{cliente}/fotos/{foto}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.url = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    foto: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                foto: typeof args.foto === 'object'
                ? args.foto.id
                : args.foto,
                }

    return edit.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{foto}', parsedArgs.foto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.get = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FotoLugarClienteController::edit
 * @see app/Http/Controllers/FotoLugarClienteController.php:141
 * @route '/clientes/{cliente}/fotos/{foto}/edit'
 */
edit.head = (args: { cliente: number | { id: number }, foto: number | { id: number } } | [cliente: number | { id: number }, foto: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})
const FotoLugarClienteController = { index, store, uploadMultiple, show, update, destroy, create, edit }

export default FotoLugarClienteController