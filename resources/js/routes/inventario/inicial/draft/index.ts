import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import item from './item'
import productos from './productos'
/**
* @see \App\Http\Controllers\InventarioInicialController::create
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::create
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::create
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::create
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::create
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
        createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
export const get = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/inventario/inventario-inicial/draft/{borrador}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
get.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return get.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
get.get = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
get.head = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
    const getForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: get.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
        getForm.get = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioInicialController::get
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
        getForm.head = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    get.form = getForm
/**
* @see \App\Http\Controllers\InventarioInicialController::complete
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
export const complete = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::complete
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
complete.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return complete.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::complete
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
complete.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::complete
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
    const completeForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::complete
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
        completeForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
const draft = {
    create,
get,
item,
productos,
complete,
}

export default draft