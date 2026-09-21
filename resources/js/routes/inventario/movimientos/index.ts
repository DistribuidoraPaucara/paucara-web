import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/inventario/movimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
    const imprimirForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
        imprimirForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
        imprimirForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
const movimientos = {
    imprimir,
}

export default movimientos