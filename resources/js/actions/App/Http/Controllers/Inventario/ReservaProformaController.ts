import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberar
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:97
 * @route '/inventario/reservas/{id}/liberar'
 */
export const liberar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})

liberar.definition = {
    methods: ["post"],
    url: '/inventario/reservas/{id}/liberar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberar
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:97
 * @route '/inventario/reservas/{id}/liberar'
 */
liberar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return liberar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberar
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:97
 * @route '/inventario/reservas/{id}/liberar'
 */
liberar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberarMasivo
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:131
 * @route '/inventario/reservas/liberar-masivo'
 */
export const liberarMasivo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberarMasivo.url(options),
    method: 'post',
})

liberarMasivo.definition = {
    methods: ["post"],
    url: '/inventario/reservas/liberar-masivo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberarMasivo
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:131
 * @route '/inventario/reservas/liberar-masivo'
 */
liberarMasivo.url = (options?: RouteQueryOptions) => {
    return liberarMasivo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::liberarMasivo
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:131
 * @route '/inventario/reservas/liberar-masivo'
 */
liberarMasivo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberarMasivo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::extender
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:177
 * @route '/inventario/reservas/{id}/extender'
 */
export const extender = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extender.url(args, options),
    method: 'post',
})

extender.definition = {
    methods: ["post"],
    url: '/inventario/reservas/{id}/extender',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::extender
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:177
 * @route '/inventario/reservas/{id}/extender'
 */
extender.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return extender.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Inventario\ReservaProformaController::extender
 * @see app/Http/Controllers/Inventario/ReservaProformaController.php:177
 * @route '/inventario/reservas/{id}/extender'
 */
extender.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extender.url(args, options),
    method: 'post',
})
const ReservaProformaController = { liberar, liberarMasivo, extender }

export default ReservaProformaController