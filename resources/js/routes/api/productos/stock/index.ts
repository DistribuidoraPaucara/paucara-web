import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:3928
 * @route '/api/productos/stock/multiples'
 */
export const multiples = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: multiples.url(options),
    method: 'post',
})

multiples.definition = {
    methods: ["post"],
    url: '/api/productos/stock/multiples',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:3928
 * @route '/api/productos/stock/multiples'
 */
multiples.url = (options?: RouteQueryOptions) => {
    return multiples.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:3928
 * @route '/api/productos/stock/multiples'
 */
multiples.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: multiples.url(options),
    method: 'post',
})
const stock = {
    multiples,
}

export default stock