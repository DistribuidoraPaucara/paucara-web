import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SectorController::index
 * @see app/Http/Controllers/Api/SectorController.php:24
 * @route '/api/sectores'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/sectores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SectorController::index
 * @see app/Http/Controllers/Api/SectorController.php:24
 * @route '/api/sectores'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::index
 * @see app/Http/Controllers/Api/SectorController.php:24
 * @route '/api/sectores'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SectorController::index
 * @see app/Http/Controllers/Api/SectorController.php:24
 * @route '/api/sectores'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SectorController::store
 * @see app/Http/Controllers/Api/SectorController.php:112
 * @route '/api/sectores'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/sectores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SectorController::store
 * @see app/Http/Controllers/Api/SectorController.php:112
 * @route '/api/sectores'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::store
 * @see app/Http/Controllers/Api/SectorController.php:112
 * @route '/api/sectores'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SectorController::show
 * @see app/Http/Controllers/Api/SectorController.php:76
 * @route '/api/sectores/{sectore}'
 */
export const show = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/sectores/{sectore}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SectorController::show
 * @see app/Http/Controllers/Api/SectorController.php:76
 * @route '/api/sectores/{sectore}'
 */
show.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return show.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::show
 * @see app/Http/Controllers/Api/SectorController.php:76
 * @route '/api/sectores/{sectore}'
 */
show.get = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SectorController::show
 * @see app/Http/Controllers/Api/SectorController.php:76
 * @route '/api/sectores/{sectore}'
 */
show.head = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SectorController::update
 * @see app/Http/Controllers/Api/SectorController.php:193
 * @route '/api/sectores/{sectore}'
 */
export const update = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/sectores/{sectore}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\SectorController::update
 * @see app/Http/Controllers/Api/SectorController.php:193
 * @route '/api/sectores/{sectore}'
 */
update.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return update.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::update
 * @see app/Http/Controllers/Api/SectorController.php:193
 * @route '/api/sectores/{sectore}'
 */
update.put = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\SectorController::update
 * @see app/Http/Controllers/Api/SectorController.php:193
 * @route '/api/sectores/{sectore}'
 */
update.patch = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\SectorController::destroy
 * @see app/Http/Controllers/Api/SectorController.php:278
 * @route '/api/sectores/{sectore}'
 */
export const destroy = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/sectores/{sectore}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\SectorController::destroy
 * @see app/Http/Controllers/Api/SectorController.php:278
 * @route '/api/sectores/{sectore}'
 */
destroy.url = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sectore: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    sectore: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sectore: args.sectore,
                }

    return destroy.definition.url
            .replace('{sectore}', parsedArgs.sectore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::destroy
 * @see app/Http/Controllers/Api/SectorController.php:278
 * @route '/api/sectores/{sectore}'
 */
destroy.delete = (args: { sectore: string | number } | [sectore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerGenerico
 * @see app/Http/Controllers/Api/SectorController.php:339
 * @route '/api/almacenes/{almacenId}/sector-generico'
 */
export const obtenerGenerico = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGenerico.url(args, options),
    method: 'get',
})

obtenerGenerico.definition = {
    methods: ["get","head"],
    url: '/api/almacenes/{almacenId}/sector-generico',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerGenerico
 * @see app/Http/Controllers/Api/SectorController.php:339
 * @route '/api/almacenes/{almacenId}/sector-generico'
 */
obtenerGenerico.url = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenId: args.almacenId,
                }

    return obtenerGenerico.definition.url
            .replace('{almacenId}', parsedArgs.almacenId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerGenerico
 * @see app/Http/Controllers/Api/SectorController.php:339
 * @route '/api/almacenes/{almacenId}/sector-generico'
 */
obtenerGenerico.get = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGenerico.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SectorController::obtenerGenerico
 * @see app/Http/Controllers/Api/SectorController.php:339
 * @route '/api/almacenes/{almacenId}/sector-generico'
 */
obtenerGenerico.head = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerGenerico.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerPorAlmacen
 * @see app/Http/Controllers/Api/SectorController.php:384
 * @route '/api/almacenes/{almacenId}/sectores'
 */
export const obtenerPorAlmacen = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPorAlmacen.url(args, options),
    method: 'get',
})

obtenerPorAlmacen.definition = {
    methods: ["get","head"],
    url: '/api/almacenes/{almacenId}/sectores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerPorAlmacen
 * @see app/Http/Controllers/Api/SectorController.php:384
 * @route '/api/almacenes/{almacenId}/sectores'
 */
obtenerPorAlmacen.url = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacenId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacenId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacenId: args.almacenId,
                }

    return obtenerPorAlmacen.definition.url
            .replace('{almacenId}', parsedArgs.almacenId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SectorController::obtenerPorAlmacen
 * @see app/Http/Controllers/Api/SectorController.php:384
 * @route '/api/almacenes/{almacenId}/sectores'
 */
obtenerPorAlmacen.get = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPorAlmacen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\SectorController::obtenerPorAlmacen
 * @see app/Http/Controllers/Api/SectorController.php:384
 * @route '/api/almacenes/{almacenId}/sectores'
 */
obtenerPorAlmacen.head = (args: { almacenId: string | number } | [almacenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerPorAlmacen.url(args, options),
    method: 'head',
})
const sectores = {
    index,
store,
show,
update,
destroy,
obtenerGenerico,
obtenerPorAlmacen,
}

export default sectores