import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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

    /**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EstadoDocumentoController::index
 * @see app/Http/Controllers/Api/EstadoDocumentoController.php:16
 * @route '/api/estados-documento'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const EstadoDocumentoController = { index }

export default EstadoDocumentoController