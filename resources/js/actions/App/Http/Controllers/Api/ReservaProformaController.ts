import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReservaProformaController::index
 * @see app/Http/Controllers/Api/ReservaProformaController.php:18
 * @route '/api/reservas-proforma'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/reservas-proforma',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::index
 * @see app/Http/Controllers/Api/ReservaProformaController.php:18
 * @route '/api/reservas-proforma'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::index
 * @see app/Http/Controllers/Api/ReservaProformaController.php:18
 * @route '/api/reservas-proforma'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReservaProformaController::index
 * @see app/Http/Controllers/Api/ReservaProformaController.php:18
 * @route '/api/reservas-proforma'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::show
 * @see app/Http/Controllers/Api/ReservaProformaController.php:205
 * @route '/api/reservas-proforma/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/reservas-proforma/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::show
 * @see app/Http/Controllers/Api/ReservaProformaController.php:205
 * @route '/api/reservas-proforma/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::show
 * @see app/Http/Controllers/Api/ReservaProformaController.php:205
 * @route '/api/reservas-proforma/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReservaProformaController::show
 * @see app/Http/Controllers/Api/ReservaProformaController.php:205
 * @route '/api/reservas-proforma/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::liberar
 * @see app/Http/Controllers/Api/ReservaProformaController.php:290
 * @route '/api/reservas-proforma/{id}/liberar'
 */
export const liberar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})

liberar.definition = {
    methods: ["post"],
    url: '/api/reservas-proforma/{id}/liberar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReservaProformaController::liberar
 * @see app/Http/Controllers/Api/ReservaProformaController.php:290
 * @route '/api/reservas-proforma/{id}/liberar'
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
* @see \App\Http\Controllers\Api\ReservaProformaController::liberar
 * @see app/Http/Controllers/Api/ReservaProformaController.php:290
 * @route '/api/reservas-proforma/{id}/liberar'
 */
liberar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})
const ReservaProformaController = { index, show, liberar }

export default ReservaProformaController