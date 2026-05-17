import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
export const disponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})

disponibles.definition = {
    methods: ["get","head"],
    url: '/api/ventas/impresoras/disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.url = (options?: RouteQueryOptions) => {
    return disponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
disponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disponibles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
    const disponiblesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: disponibles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
        disponiblesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disponibles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::disponibles
 * @see app/Http/Controllers/ReporteVentasController.php:1041
 * @route '/api/ventas/impresoras/disponibles'
 */
        disponiblesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disponibles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    disponibles.form = disponiblesForm
const impresoras = {
    disponibles,
}

export default impresoras