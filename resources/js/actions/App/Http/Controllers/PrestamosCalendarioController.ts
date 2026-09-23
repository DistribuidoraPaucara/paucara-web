import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
export const obtenerPrestamosDelMes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPrestamosDelMes.url(options),
    method: 'get',
})

obtenerPrestamosDelMes.definition = {
    methods: ["get","head"],
    url: '/api/prestamos/calendario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
obtenerPrestamosDelMes.url = (options?: RouteQueryOptions) => {
    return obtenerPrestamosDelMes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
obtenerPrestamosDelMes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPrestamosDelMes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
obtenerPrestamosDelMes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerPrestamosDelMes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
    const obtenerPrestamosDelMesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerPrestamosDelMes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
        obtenerPrestamosDelMesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPrestamosDelMes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::obtenerPrestamosDelMes
 * @see app/Http/Controllers/PrestamosCalendarioController.php:49
 * @route '/api/prestamos/calendario'
 */
        obtenerPrestamosDelMesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerPrestamosDelMes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerPrestamosDelMes.form = obtenerPrestamosDelMesForm
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/prestamos/calendario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosCalendarioController::index
 * @see app/Http/Controllers/PrestamosCalendarioController.php:20
 * @route '/prestamos/calendario'
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
const PrestamosCalendarioController = { obtenerPrestamosDelMes, index }

export default PrestamosCalendarioController