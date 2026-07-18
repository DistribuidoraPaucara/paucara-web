import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ChoferGastoController::store
 * @see app/Http/Controllers/Api/ChoferGastoController.php:21
 * @route '/api/cajas/gastos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/cajas/gastos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::store
 * @see app/Http/Controllers/Api/ChoferGastoController.php:21
 * @route '/api/cajas/gastos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::store
 * @see app/Http/Controllers/Api/ChoferGastoController.php:21
 * @route '/api/cajas/gastos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ChoferGastoController::store
 * @see app/Http/Controllers/Api/ChoferGastoController.php:21
 * @route '/api/cajas/gastos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::store
 * @see app/Http/Controllers/Api/ChoferGastoController.php:21
 * @route '/api/cajas/gastos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/cajas/gastos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::index
 * @see app/Http/Controllers/Api/ChoferGastoController.php:113
 * @route '/api/cajas/gastos'
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
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/cajas/gastos/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::estadisticas
 * @see app/Http/Controllers/Api/ChoferGastoController.php:201
 * @route '/api/cajas/gastos/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\Api\ChoferGastoController::destroy
 * @see app/Http/Controllers/Api/ChoferGastoController.php:159
 * @route '/api/cajas/gastos/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/cajas/gastos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::destroy
 * @see app/Http/Controllers/Api/ChoferGastoController.php:159
 * @route '/api/cajas/gastos/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferGastoController::destroy
 * @see app/Http/Controllers/Api/ChoferGastoController.php:159
 * @route '/api/cajas/gastos/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\ChoferGastoController::destroy
 * @see app/Http/Controllers/Api/ChoferGastoController.php:159
 * @route '/api/cajas/gastos/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ChoferGastoController::destroy
 * @see app/Http/Controllers/Api/ChoferGastoController.php:159
 * @route '/api/cajas/gastos/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const gastos = {
    store,
index,
estadisticas,
destroy,
}

export default gastos