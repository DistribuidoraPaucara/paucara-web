import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/estados-logistica',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::index
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:251
 * @route '/api/estados-logistica'
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
const estadosLogistica = {
    index,
}

export default estadosLogistica