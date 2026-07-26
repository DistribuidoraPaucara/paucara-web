import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2206
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
 * @see app/Http/Controllers/CajaController.php:2206
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.url = (options?: RouteQueryOptions) => {
    return porTipoPago.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2206
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porTipoPago.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::porTipoPago
 * @see app/Http/Controllers/CajaController.php:2206
 * @route '/cajas/resumen/por-tipo-pago'
 */
porTipoPago.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porTipoPago.url(options),
    method: 'head',
})
const resumen = {
    porTipoPago,
}

export default resumen