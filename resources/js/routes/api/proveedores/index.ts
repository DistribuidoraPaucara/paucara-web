import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})

buscar.definition = {
    methods: ["get","head"],
    url: '/api/proveedores/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
buscar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
buscar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
        buscarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProveedorController::buscar
 * @see app/Http/Controllers/ProveedorController.php:68
 * @route '/api/proveedores/buscar'
 */
        buscarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscar.form = buscarForm
const proveedores = {
    buscar,
}

export default proveedores