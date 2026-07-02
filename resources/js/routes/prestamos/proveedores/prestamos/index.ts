import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:125
 * @route '/prestamos/proveedores/prestamos/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/prestamos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:125
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:125
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:125
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})
const prestamos = {
    crear,
}

export default prestamos