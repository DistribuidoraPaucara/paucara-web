import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas/gastos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:23
 * @route '/cajas/gastos'
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
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/cajas/gastos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GastoController::create
 * @see app/Http/Controllers/GastoController.php:77
 * @route '/cajas/gastos/create'
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
* @see \App\Http\Controllers\GastoController::store
 * @see app/Http/Controllers/GastoController.php:99
 * @route '/cajas/gastos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cajas/gastos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GastoController::store
 * @see app/Http/Controllers/GastoController.php:99
 * @route '/cajas/gastos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::store
 * @see app/Http/Controllers/GastoController.php:99
 * @route '/cajas/gastos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GastoController::store
 * @see app/Http/Controllers/GastoController.php:99
 * @route '/cajas/gastos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GastoController::store
 * @see app/Http/Controllers/GastoController.php:99
 * @route '/cajas/gastos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cajas/gastos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
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
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
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
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
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
    index,
create,
store,
destroy,
}

export default gastos