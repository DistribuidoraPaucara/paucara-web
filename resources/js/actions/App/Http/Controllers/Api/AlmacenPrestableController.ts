import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/almacenes-prestables/index-json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
    const indexApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
        indexApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexApi
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
        indexApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi.form = indexApiForm
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
export const prestablesPorAlmacen = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestablesPorAlmacen.url(args, options),
    method: 'get',
})

prestablesPorAlmacen.definition = {
    methods: ["get","head"],
    url: '/api/almacenes-prestables/{almacen}/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestablesPorAlmacen.url = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacen: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { almacen: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    almacen: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacen: typeof args.almacen === 'object'
                ? args.almacen.id
                : args.almacen,
                }

    return prestablesPorAlmacen.definition.url
            .replace('{almacen}', parsedArgs.almacen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestablesPorAlmacen.get = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestablesPorAlmacen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestablesPorAlmacen.head = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prestablesPorAlmacen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
    const prestablesPorAlmacenForm = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: prestablesPorAlmacen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
        prestablesPorAlmacenForm.get = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestablesPorAlmacen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestablesPorAlmacen
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
        prestablesPorAlmacenForm.head = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestablesPorAlmacen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    prestablesPorAlmacen.form = prestablesPorAlmacenForm
const AlmacenPrestableController = { indexApi, prestablesPorAlmacen }

export default AlmacenPrestableController