import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
export const calendario = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendario.url(options),
    method: 'get',
})

calendario.definition = {
    methods: ["get","head"],
    url: '/api/prestamos/calendario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
calendario.url = (options?: RouteQueryOptions) => {
    return calendario.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
calendario.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendario.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
calendario.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendario.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
    const calendarioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: calendario.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
        calendarioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendario.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::calendario
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
        calendarioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendario.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    calendario.form = calendarioForm
const prestamos = {
    calendario,
}

export default prestamos