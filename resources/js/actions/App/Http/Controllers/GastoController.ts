import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
 */
const destroy4ab6184622b080e66c3b258ad541dcfa = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4ab6184622b080e66c3b258ad541dcfa.url(args, options),
    method: 'delete',
})

destroy4ab6184622b080e66c3b258ad541dcfa.definition = {
    methods: ["delete"],
    url: '/cajas/gastos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
 */
destroy4ab6184622b080e66c3b258ad541dcfa.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy4ab6184622b080e66c3b258ad541dcfa.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/gastos/{id}'
 */
destroy4ab6184622b080e66c3b258ad541dcfa.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4ab6184622b080e66c3b258ad541dcfa.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
 */
const destroyba66746d3d635f06703bf6dda264c591 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyba66746d3d635f06703bf6dda264c591.url(args, options),
    method: 'delete',
})

destroyba66746d3d635f06703bf6dda264c591.definition = {
    methods: ["delete"],
    url: '/cajas/admin/gastos/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
 */
destroyba66746d3d635f06703bf6dda264c591.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroyba66746d3d635f06703bf6dda264c591.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::destroy
 * @see app/Http/Controllers/GastoController.php:286
 * @route '/cajas/admin/gastos/{id}'
 */
destroyba66746d3d635f06703bf6dda264c591.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyba66746d3d635f06703bf6dda264c591.url(args, options),
    method: 'delete',
})

export const destroy = {
    '/cajas/gastos/{id}': destroy4ab6184622b080e66c3b258ad541dcfa,
    '/cajas/admin/gastos/{id}': destroyba66746d3d635f06703bf6dda264c591,
}

/**
* @see \App\Http\Controllers\GastoController::adminIndex
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
export const adminIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})

adminIndex.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/gastos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GastoController::adminIndex
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
adminIndex.url = (options?: RouteQueryOptions) => {
    return adminIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::adminIndex
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
adminIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GastoController::adminIndex
 * @see app/Http/Controllers/GastoController.php:139
 * @route '/cajas/admin/gastos'
 */
adminIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adminIndex.url(options),
    method: 'head',
})

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
const GastoController = { index, create, store, destroy, adminIndex, aprobar, rechazar }

export default GastoController