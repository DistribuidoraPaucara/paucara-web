import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
export const productosVendidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})

productosVendidos.definition = {
    methods: ["get","head"],
    url: '/api/reportes/productos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.url = (options?: RouteQueryOptions) => {
    return productosVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
productosVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosVendidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
    const productosVendidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosVendidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
        productosVendidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosVendidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ApiReporteVentasController::productosVendidos
 * @see app/Http/Controllers/Api/ApiReporteVentasController.php:24
 * @route '/api/reportes/productos-vendidos'
 */
        productosVendidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosVendidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosVendidos.form = productosVendidosForm
const reportes = {
    productosVendidos,
}

export default reportes