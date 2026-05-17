import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import usuario from './usuario'
import rol from './rol'
/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/permisos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:23
 * @route '/permisos'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const permisos = {
    index,
usuario,
rol,
}

export default permisos