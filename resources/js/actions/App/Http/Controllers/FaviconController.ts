import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FaviconController::__invoke
 * @see app/Http/Controllers/FaviconController.php:12
 * @route '/dynamic-favicon'
 */
const FaviconController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: FaviconController.url(options),
    method: 'get',
})

FaviconController.definition = {
    methods: ["get","head"],
    url: '/dynamic-favicon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FaviconController::__invoke
 * @see app/Http/Controllers/FaviconController.php:12
 * @route '/dynamic-favicon'
 */
FaviconController.url = (options?: RouteQueryOptions) => {
    return FaviconController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaviconController::__invoke
 * @see app/Http/Controllers/FaviconController.php:12
 * @route '/dynamic-favicon'
 */
FaviconController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: FaviconController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FaviconController::__invoke
 * @see app/Http/Controllers/FaviconController.php:12
 * @route '/dynamic-favicon'
 */
FaviconController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: FaviconController.url(options),
    method: 'head',
})
export default FaviconController