import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/devoluciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DevolucionController::index
 * @see app/Http/Controllers/DevolucionController.php:46
 * @route '/devoluciones'
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
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
export const show = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/devoluciones/{devolucion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
show.url = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { devolucion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { devolucion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    devolucion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return show.definition.url
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
show.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
show.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
    const showForm = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
        showForm.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DevolucionController::show
 * @see app/Http/Controllers/DevolucionController.php:258
 * @route '/devoluciones/{devolucion}'
 */
        showForm.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
export const create = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/devoluciones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
create.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
create.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
create.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
    const createForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
        createForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DevolucionController::create
 * @see app/Http/Controllers/DevolucionController.php:114
 * @route '/ventas/{venta}/devoluciones/create'
 */
        createForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\DevolucionController::store
 * @see app/Http/Controllers/DevolucionController.php:167
 * @route '/ventas/{venta}/devoluciones'
 */
export const store = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/devoluciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DevolucionController::store
 * @see app/Http/Controllers/DevolucionController.php:167
 * @route '/ventas/{venta}/devoluciones'
 */
store.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return store.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DevolucionController::store
 * @see app/Http/Controllers/DevolucionController.php:167
 * @route '/ventas/{venta}/devoluciones'
 */
store.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DevolucionController::store
 * @see app/Http/Controllers/DevolucionController.php:167
 * @route '/ventas/{venta}/devoluciones'
 */
    const storeForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DevolucionController::store
 * @see app/Http/Controllers/DevolucionController.php:167
 * @route '/ventas/{venta}/devoluciones'
 */
        storeForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const devoluciones = {
    index,
show,
create,
store,
}

export default devoluciones