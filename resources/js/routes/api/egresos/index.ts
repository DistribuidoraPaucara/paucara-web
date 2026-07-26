import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EgresosController::index
 * @see app/Http/Controllers/Api/EgresosController.php:24
 * @route '/api/egresos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/egresos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EgresosController::index
 * @see app/Http/Controllers/Api/EgresosController.php:24
 * @route '/api/egresos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosController::index
 * @see app/Http/Controllers/Api/EgresosController.php:24
 * @route '/api/egresos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EgresosController::index
 * @see app/Http/Controllers/Api/EgresosController.php:24
 * @route '/api/egresos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EgresosController::store
 * @see app/Http/Controllers/Api/EgresosController.php:69
 * @route '/api/egresos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/egresos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EgresosController::store
 * @see app/Http/Controllers/Api/EgresosController.php:69
 * @route '/api/egresos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosController::store
 * @see app/Http/Controllers/Api/EgresosController.php:69
 * @route '/api/egresos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EgresosController::show
 * @see app/Http/Controllers/Api/EgresosController.php:275
 * @route '/api/egresos/{egreso}'
 */
export const show = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/egresos/{egreso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EgresosController::show
 * @see app/Http/Controllers/Api/EgresosController.php:275
 * @route '/api/egresos/{egreso}'
 */
show.url = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { egreso: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { egreso: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    egreso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        egreso: typeof args.egreso === 'object'
                ? args.egreso.id
                : args.egreso,
                }

    return show.definition.url
            .replace('{egreso}', parsedArgs.egreso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosController::show
 * @see app/Http/Controllers/Api/EgresosController.php:275
 * @route '/api/egresos/{egreso}'
 */
show.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EgresosController::show
 * @see app/Http/Controllers/Api/EgresosController.php:275
 * @route '/api/egresos/{egreso}'
 */
show.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EgresosController::anular
 * @see app/Http/Controllers/Api/EgresosController.php:294
 * @route '/api/egresos/{egreso}/anular'
 */
export const anular = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

anular.definition = {
    methods: ["post"],
    url: '/api/egresos/{egreso}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EgresosController::anular
 * @see app/Http/Controllers/Api/EgresosController.php:294
 * @route '/api/egresos/{egreso}/anular'
 */
anular.url = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { egreso: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { egreso: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    egreso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        egreso: typeof args.egreso === 'object'
                ? args.egreso.id
                : args.egreso,
                }

    return anular.definition.url
            .replace('{egreso}', parsedArgs.egreso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosController::anular
 * @see app/Http/Controllers/Api/EgresosController.php:294
 * @route '/api/egresos/{egreso}/anular'
 */
anular.post = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})
const egresos = {
    index,
store,
show,
anular,
}

export default egresos