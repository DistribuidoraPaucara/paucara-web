import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:4057
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
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
multiples.url = (options?: RouteQueryOptions) => {
    return multiples.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
multiples.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: multiples.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
    const multiplesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: multiples.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::multiples
 * @see app/Http/Controllers/ProductoController.php:4057
 * @route '/api/productos/stock/multiples'
 */
        multiplesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: multiples.url(options),
            method: 'post',
        })
    
    multiples.form = multiplesForm
const stock = {
    multiples,
}

export default stock