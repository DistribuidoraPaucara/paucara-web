import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/gastos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GastoController::index
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
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
* @see \App\Http\Controllers\GastoController::aprobar
 * @see app/Http/Controllers/GastoController.php:221
 * @route '/cajas/admin/gastos/{id}/aprobar'
 */
export const aprobar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/cajas/admin/gastos/{id}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GastoController::aprobar
 * @see app/Http/Controllers/GastoController.php:221
 * @route '/cajas/admin/gastos/{id}/aprobar'
 */
aprobar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return aprobar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::aprobar
 * @see app/Http/Controllers/GastoController.php:221
 * @route '/cajas/admin/gastos/{id}/aprobar'
 */
aprobar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GastoController::aprobar
 * @see app/Http/Controllers/GastoController.php:221
 * @route '/cajas/admin/gastos/{id}/aprobar'
 */
    const aprobarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aprobar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GastoController::aprobar
 * @see app/Http/Controllers/GastoController.php:221
 * @route '/cajas/admin/gastos/{id}/aprobar'
 */
        aprobarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aprobar.url(args, options),
            method: 'post',
        })
    
    aprobar.form = aprobarForm
/**
* @see \App\Http\Controllers\GastoController::rechazar
 * @see app/Http/Controllers/GastoController.php:247
 * @route '/cajas/admin/gastos/{id}/rechazar'
 */
export const rechazar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/cajas/admin/gastos/{id}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GastoController::rechazar
 * @see app/Http/Controllers/GastoController.php:247
 * @route '/cajas/admin/gastos/{id}/rechazar'
 */
rechazar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rechazar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::rechazar
 * @see app/Http/Controllers/GastoController.php:247
 * @route '/cajas/admin/gastos/{id}/rechazar'
 */
rechazar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GastoController::rechazar
 * @see app/Http/Controllers/GastoController.php:247
 * @route '/cajas/admin/gastos/{id}/rechazar'
 */
    const rechazarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rechazar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GastoController::rechazar
 * @see app/Http/Controllers/GastoController.php:247
 * @route '/cajas/admin/gastos/{id}/rechazar'
 */
        rechazarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rechazar.url(args, options),
            method: 'post',
        })
    
    rechazar.form = rechazarForm
/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cajas/admin/gastos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
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
 * @route '/cajas/admin/gastos/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
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
 * @route '/cajas/admin/gastos/{id}'
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
aprobar,
rechazar,
destroy,
}

export default gastos