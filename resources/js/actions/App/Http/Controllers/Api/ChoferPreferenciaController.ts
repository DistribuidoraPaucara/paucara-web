import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/user/chofer-preferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::index
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:14
 * @route '/api/user/chofer-preferencias'
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
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::store
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:32
 * @route '/api/user/chofer-preferencias'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/user/chofer-preferencias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::store
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:32
 * @route '/api/user/chofer-preferencias'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::store
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:32
 * @route '/api/user/chofer-preferencias'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::store
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:32
 * @route '/api/user/chofer-preferencias'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferPreferenciaController::store
 * @see app/Http/Controllers/Api/ChoferPreferenciaController.php:32
 * @route '/api/user/chofer-preferencias'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const ChoferPreferenciaController = { index, store }

export default ChoferPreferenciaController