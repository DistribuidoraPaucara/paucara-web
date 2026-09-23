import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import draft from './draft'
/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/inventario-inicial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
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
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const inicial = {
    index,
store,
draft,
}

export default inicial