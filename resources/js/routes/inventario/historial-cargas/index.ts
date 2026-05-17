import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
export const form = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/inventario/historial-cargas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
form.url = (options?: RouteQueryOptions) => {
    return form.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
form.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
form.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
    const formForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: form.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
        formForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: form.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
        formForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: form.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    form.form = formForm
const historialCargas = {
    form,
}

export default historialCargas