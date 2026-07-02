import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimir
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/proformas/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimir
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimir
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimir
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})
const ImpresionProformasController = { imprimir }

export default ImpresionProformasController