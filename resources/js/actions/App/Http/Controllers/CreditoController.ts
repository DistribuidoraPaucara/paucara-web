import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CreditoController::store
 * @see app/Http/Controllers/CreditoController.php:35
 * @route '/api/creditos/crear'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/creditos/crear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CreditoController::store
 * @see app/Http/Controllers/CreditoController.php:35
 * @route '/api/creditos/crear'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoController::store
 * @see app/Http/Controllers/CreditoController.php:35
 * @route '/api/creditos/crear'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditoController::create
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/creditos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CreditoController::create
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoController::create
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CreditoController::create
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})
const CreditoController = { store, create }

export default CreditoController