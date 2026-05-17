import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
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
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
    const crearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: crear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
        crearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
        crearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    crear.form = crearForm
const prestamos = {
    crear,
}

export default prestamos