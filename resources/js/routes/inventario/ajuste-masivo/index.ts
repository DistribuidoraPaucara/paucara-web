import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
export const form = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste-masivo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
form.url = (options?: RouteQueryOptions) => {
    return form.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
form.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
form.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
    const formForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: form.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
        formForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: form.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
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
const ajusteMasivo = {
    form,
}

export default ajusteMasivo