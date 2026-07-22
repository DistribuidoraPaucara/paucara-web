import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1970
 * @route '/inventario/mermas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1970
 * @route '/inventario/mermas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1970
 * @route '/inventario/mermas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1970
 * @route '/inventario/mermas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::registrar
 * @see app/Http/Controllers/InventarioController.php:2075
 * @route '/inventario/mermas/registrar'
 */
export const registrar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registrar.url(options),
    method: 'get',
})

registrar.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/registrar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::registrar
 * @see app/Http/Controllers/InventarioController.php:2075
 * @route '/inventario/mermas/registrar'
 */
registrar.url = (options?: RouteQueryOptions) => {
    return registrar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::registrar
 * @see app/Http/Controllers/InventarioController.php:2075
 * @route '/inventario/mermas/registrar'
 */
registrar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registrar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::registrar
 * @see app/Http/Controllers/InventarioController.php:2075
 * @route '/inventario/mermas/registrar'
 */
registrar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: registrar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1724
 * @route '/inventario/mermas/registrar'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/mermas/registrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1724
 * @route '/inventario/mermas/registrar'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1724
 * @route '/inventario/mermas/registrar'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:2314
 * @route '/inventario/mermas/{merma}'
 */
export const show = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/{merma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:2314
 * @route '/inventario/mermas/{merma}'
 */
show.url = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { merma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: typeof args.merma === 'object'
                ? args.merma.id
                : args.merma,
                }

    return show.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:2314
 * @route '/inventario/mermas/{merma}'
 */
show.get = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:2314
 * @route '/inventario/mermas/{merma}'
 */
show.head = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::aprobar
 * @see app/Http/Controllers/InventarioController.php:2462
 * @route '/inventario/mermas/{merma}/aprobar'
 */
export const aprobar = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/inventario/mermas/{merma}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::aprobar
 * @see app/Http/Controllers/InventarioController.php:2462
 * @route '/inventario/mermas/{merma}/aprobar'
 */
aprobar.url = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: args.merma,
                }

    return aprobar.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::aprobar
 * @see app/Http/Controllers/InventarioController.php:2462
 * @route '/inventario/mermas/{merma}/aprobar'
 */
aprobar.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::rechazar
 * @see app/Http/Controllers/InventarioController.php:2512
 * @route '/inventario/mermas/{merma}/rechazar'
 */
export const rechazar = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/inventario/mermas/{merma}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::rechazar
 * @see app/Http/Controllers/InventarioController.php:2512
 * @route '/inventario/mermas/{merma}/rechazar'
 */
rechazar.url = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: args.merma,
                }

    return rechazar.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::rechazar
 * @see app/Http/Controllers/InventarioController.php:2512
 * @route '/inventario/mermas/{merma}/rechazar'
 */
rechazar.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:4096
 * @route '/inventario/mermas/{id}/imprimir'
 */
export const imprimir = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/{id}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:4096
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimir.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return imprimir.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:4096
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimir.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:4096
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimir.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})
const mermas = {
    index,
registrar,
store,
show,
aprobar,
rechazar,
imprimir,
}

export default mermas