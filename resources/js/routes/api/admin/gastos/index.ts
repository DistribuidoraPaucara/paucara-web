import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
export const resumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/admin/gastos/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumen.url = (options?: RouteQueryOptions) => {
    return resumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
    const resumenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
        resumenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumen
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
        resumenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
const gastos = {
    resumen,
}

export default gastos