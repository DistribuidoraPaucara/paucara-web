import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:234
 * @route '/prestamos/proveedores/compras/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/compras/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:234
 * @route '/prestamos/proveedores/compras/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:234
 * @route '/prestamos/proveedores/compras/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:234
 * @route '/prestamos/proveedores/compras/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})
const compras = {
    crear,
}

export default compras