import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexJson
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
export const indexJson = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexJson.url(options),
    method: 'get',
})

indexJson.definition = {
    methods: ["get","head"],
    url: '/api/almacenes-prestables/index-json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexJson
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexJson.url = (options?: RouteQueryOptions) => {
    return indexJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexJson
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexJson.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexJson.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::indexJson
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:18
 * @route '/api/almacenes-prestables/index-json'
 */
indexJson.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexJson.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestables
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
export const prestables = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(args, options),
    method: 'get',
})

prestables.definition = {
    methods: ["get","head"],
    url: '/api/almacenes-prestables/{almacen}/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestables
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestables.url = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return prestables.definition.url
            .replace('{almacen}', parsedArgs.almacen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestables
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestables.get = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AlmacenPrestableController::prestables
 * @see app/Http/Controllers/Api/AlmacenPrestableController.php:63
 * @route '/api/almacenes-prestables/{almacen}/prestables'
 */
prestables.head = (args: { almacen: number | { id: number } } | [almacen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prestables.url(args, options),
    method: 'head',
})
const almacenesPrestables = {
    indexJson,
prestables,
}

export default almacenesPrestables