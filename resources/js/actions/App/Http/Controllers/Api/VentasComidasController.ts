import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VentasComidasController::store
 * @see app/Http/Controllers/Api/VentasComidasController.php:55
 * @route '/api/ventas-comidas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/ventas-comidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VentasComidasController::store
 * @see app/Http/Controllers/Api/VentasComidasController.php:55
 * @route '/api/ventas-comidas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentasComidasController::store
 * @see app/Http/Controllers/Api/VentasComidasController.php:55
 * @route '/api/ventas-comidas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const VentasComidasController = { store }

export default VentasComidasController