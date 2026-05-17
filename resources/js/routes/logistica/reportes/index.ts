import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/logistica/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
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
const reportes = {
    index,
}

export default reportes