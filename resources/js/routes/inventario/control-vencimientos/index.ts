import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionControlVencimientosController::imprimir
 * @see app/Http/Controllers/ImpresionControlVencimientosController.php:12
 * @route '/inventario/control-vencimientos/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/inventario/control-vencimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionControlVencimientosController::imprimir
 * @see app/Http/Controllers/ImpresionControlVencimientosController.php:12
 * @route '/inventario/control-vencimientos/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionControlVencimientosController::imprimir
 * @see app/Http/Controllers/ImpresionControlVencimientosController.php:12
 * @route '/inventario/control-vencimientos/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionControlVencimientosController::imprimir
 * @see app/Http/Controllers/ImpresionControlVencimientosController.php:12
 * @route '/inventario/control-vencimientos/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})
const controlVencimientos = {
    imprimir,
}

export default controlVencimientos