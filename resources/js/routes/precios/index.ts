import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
export const management = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})

management.definition = {
    methods: ["get","head"],
    url: '/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.url = (options?: RouteQueryOptions) => {
    return management.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
management.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: management.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
    const managementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: management.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
        managementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: management.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::management
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
        managementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: management.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    management.form = managementForm
const precios = {
    management,
}

export default precios