import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reportes-productos-danados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteProductoDanadoAdminController::index
 * @see app/Http/Controllers/ReporteProductoDanadoAdminController.php:14
 * @route '/admin/reportes-productos-danados'
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
const reportesProductosDanados = {
    index,
}

export default reportesProductosDanados