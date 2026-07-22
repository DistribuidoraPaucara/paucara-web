import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/egresos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EgresosAnalisisController::index
 * @see app/Http/Controllers/Api/EgresosAnalisisController.php:19
 * @route '/api/egresos'
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
const EgresosAnalisisController = { index }

export default EgresosAnalisisController