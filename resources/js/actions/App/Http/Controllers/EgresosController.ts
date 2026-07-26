import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:17
 * @route '/egresos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/egresos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:17
 * @route '/egresos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:17
 * @route '/egresos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:17
 * @route '/egresos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:54
 * @route '/egresos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/egresos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:54
 * @route '/egresos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:54
 * @route '/egresos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:54
 * @route '/egresos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:68
 * @route '/egresos/{egreso}'
 */
export const show = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/egresos/{egreso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:68
 * @route '/egresos/{egreso}'
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
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:68
 * @route '/egresos/{egreso}'
 */
show.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:68
 * @route '/egresos/{egreso}'
 */
show.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const EgresosController = { index, create, show }

export default EgresosController