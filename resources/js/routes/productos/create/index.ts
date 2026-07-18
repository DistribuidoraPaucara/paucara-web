import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
export const moderno = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: moderno.url(options),
    method: 'get',
})

moderno.definition = {
    methods: ["get","head"],
    url: '/productos/crear/moderno',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
moderno.url = (options?: RouteQueryOptions) => {
    return moderno.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
moderno.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: moderno.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
moderno.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: moderno.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
    const modernoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: moderno.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
        modernoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: moderno.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::moderno
 * @see app/Http/Controllers/ProductoController.php:321
 * @route '/productos/crear/moderno'
 */
        modernoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: moderno.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    moderno.form = modernoForm