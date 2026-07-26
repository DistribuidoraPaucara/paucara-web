import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EntregaController::search
 * @see app/Http/Controllers/EntregaController.php:1015
 * @route '/logistica/entregas/ventas/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/logistica/entregas/ventas/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaController::search
 * @see app/Http/Controllers/EntregaController.php:1015
 * @route '/logistica/entregas/ventas/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaController::search
 * @see app/Http/Controllers/EntregaController.php:1015
 * @route '/logistica/entregas/ventas/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaController::search
 * @see app/Http/Controllers/EntregaController.php:1015
 * @route '/logistica/entregas/ventas/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})
const ventas = {
    search,
}

export default ventas