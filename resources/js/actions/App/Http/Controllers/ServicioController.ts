import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ServicioController::index
 * @see app/Http/Controllers/ServicioController.php:40
 * @route '/servicios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/servicios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServicioController::index
 * @see app/Http/Controllers/ServicioController.php:40
 * @route '/servicios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServicioController::index
 * @see app/Http/Controllers/ServicioController.php:40
 * @route '/servicios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServicioController::index
 * @see app/Http/Controllers/ServicioController.php:40
 * @route '/servicios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ServicioController::create
 * @see app/Http/Controllers/ServicioController.php:87
 * @route '/servicios/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/servicios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServicioController::create
 * @see app/Http/Controllers/ServicioController.php:87
 * @route '/servicios/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServicioController::create
 * @see app/Http/Controllers/ServicioController.php:87
 * @route '/servicios/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServicioController::create
 * @see app/Http/Controllers/ServicioController.php:87
 * @route '/servicios/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ServicioController::store
 * @see app/Http/Controllers/ServicioController.php:118
 * @route '/servicios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/servicios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ServicioController::store
 * @see app/Http/Controllers/ServicioController.php:118
 * @route '/servicios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServicioController::store
 * @see app/Http/Controllers/ServicioController.php:118
 * @route '/servicios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ServicioController::show
 * @see app/Http/Controllers/ServicioController.php:188
 * @route '/servicios/{servicio}'
 */
export const show = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/servicios/{servicio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServicioController::show
 * @see app/Http/Controllers/ServicioController.php:188
 * @route '/servicios/{servicio}'
 */
show.url = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { servicio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { servicio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    servicio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        servicio: typeof args.servicio === 'object'
                ? args.servicio.id
                : args.servicio,
                }

    return show.definition.url
            .replace('{servicio}', parsedArgs.servicio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServicioController::show
 * @see app/Http/Controllers/ServicioController.php:188
 * @route '/servicios/{servicio}'
 */
show.get = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServicioController::show
 * @see app/Http/Controllers/ServicioController.php:188
 * @route '/servicios/{servicio}'
 */
show.head = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const ServicioController = { index, create, store, show }

export default ServicioController