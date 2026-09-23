import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
export const store = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
store.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
store.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
    const storeForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
        storeForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\InventarioInicialController::deleteMethod
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
export const deleteMethod = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/inventario/inventario-inicial/draft/{borrador}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::deleteMethod
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
deleteMethod.url = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                                item: args.item,
                }

    return deleteMethod.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::deleteMethod
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
deleteMethod.delete = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::deleteMethod
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
    const deleteMethodForm = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::deleteMethod
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
        deleteMethodForm.delete = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const item = {
    store,
delete: deleteMethod,
}

export default item