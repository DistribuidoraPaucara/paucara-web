import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
export const porTipoPago = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porTipoPago.url(options),
    method: 'get',
})

porTipoPago.definition = {
    methods: ["get","head"],
    url: '/cajas/resumen/por-tipo-pago',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.url = (options?: RouteQueryOptions) => {
    return porTipoPago.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porTipoPago.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porTipoPago.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
    const porTipoPagoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porTipoPago.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
        porTipoPagoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porTipoPago.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2081
 * @route '/cajas/resumen/por-tipo-pago'
 */
        porTipoPagoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porTipoPago.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    porTipoPago.form = porTipoPagoForm
const resumen = {
    porTipoPago,
}

export default resumen