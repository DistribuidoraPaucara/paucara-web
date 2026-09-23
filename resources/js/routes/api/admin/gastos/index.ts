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
/**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
export const cajasAbiertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cajasAbiertas.url(options),
    method: 'get',
})

cajasAbiertas.definition = {
    methods: ["get","head"],
    url: '/api/admin/gastos/cajas-abiertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
cajasAbiertas.url = (options?: RouteQueryOptions) => {
    return cajasAbiertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
cajasAbiertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cajasAbiertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
cajasAbiertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cajasAbiertas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
    const cajasAbiertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cajasAbiertas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
        cajasAbiertasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cajasAbiertas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GastoController::cajasAbiertas
 * @see app/Http/Controllers/GastoController.php:312
 * @route '/api/admin/gastos/cajas-abiertas'
 */
        cajasAbiertasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cajasAbiertas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cajasAbiertas.form = cajasAbiertasForm
const gastos = {
    resumen,
cajasAbiertas,
}

export default gastos