import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProveedorController::indexJson
 * @see app/Http/Controllers/ProveedorController.php:105
 * @route '/api/proveedores/index-json'
 */
export const indexJson = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexJson.url(options),
    method: 'get',
})

indexJson.definition = {
    methods: ["get","head"],
    url: '/api/proveedores/index-json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProveedorController::indexJson
 * @see app/Http/Controllers/ProveedorController.php:105
 * @route '/api/proveedores/index-json'
 */
indexJson.url = (options?: RouteQueryOptions) => {
    return indexJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProveedorController::indexJson
 * @see app/Http/Controllers/ProveedorController.php:105
 * @route '/api/proveedores/index-json'
 */
indexJson.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexJson.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProveedorController::indexJson
 * @see app/Http/Controllers/ProveedorController.php:105
 * @route '/api/proveedores/index-json'
 */
indexJson.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexJson.url(options),
    method: 'head',
})

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
const proveedores = {
    indexJson,
buscar,
}

export default proveedores