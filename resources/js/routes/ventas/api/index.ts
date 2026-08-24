import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
export const choferes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: choferes.url(options),
    method: 'get',
})

choferes.definition = {
    methods: ["get","head"],
    url: '/ventas/api/choferes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
choferes.url = (options?: RouteQueryOptions) => {
    return choferes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
choferes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: choferes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
choferes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: choferes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
    const choferesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: choferes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
        choferesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: choferes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::choferes
 * @see app/Http/Controllers/VentaController.php:2960
 * @route '/ventas/api/choferes'
 */
        choferesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: choferes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    choferes.form = choferesForm
const api = {
    choferes,
}

export default api