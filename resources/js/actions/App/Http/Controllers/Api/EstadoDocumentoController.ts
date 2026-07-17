import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/estados-documento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const EstadoDocumentoController = { index }

export default EstadoDocumentoController