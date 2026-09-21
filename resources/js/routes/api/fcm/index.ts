import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::registrar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:16
 * @route '/api/fcm/registrar-token'
 */
export const registrar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(options),
    method: 'post',
})

registrar.definition = {
    methods: ["post"],
    url: '/api/fcm/registrar-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::registrar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:16
 * @route '/api/fcm/registrar-token'
 */
registrar.url = (options?: RouteQueryOptions) => {
    return registrar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::registrar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:16
 * @route '/api/fcm/registrar-token'
 */
registrar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::registrar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:16
 * @route '/api/fcm/registrar-token'
 */
    const registrarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::registrar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:16
 * @route '/api/fcm/registrar-token'
 */
        registrarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrar.url(options),
            method: 'post',
        })
    
    registrar.form = registrarForm
/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::desactivar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:83
 * @route '/api/fcm/desactivar-token'
 */
export const desactivar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: desactivar.url(options),
    method: 'post',
})

desactivar.definition = {
    methods: ["post"],
    url: '/api/fcm/desactivar-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::desactivar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:83
 * @route '/api/fcm/desactivar-token'
 */
desactivar.url = (options?: RouteQueryOptions) => {
    return desactivar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::desactivar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:83
 * @route '/api/fcm/desactivar-token'
 */
desactivar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: desactivar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::desactivar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:83
 * @route '/api/fcm/desactivar-token'
 */
    const desactivarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: desactivar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::desactivar
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:83
 * @route '/api/fcm/desactivar-token'
 */
        desactivarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: desactivar.url(options),
            method: 'post',
        })
    
    desactivar.form = desactivarForm
/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::enviarPrueba
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:125
 * @route '/api/fcm/enviar-prueba'
 */
export const enviarPrueba = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarPrueba.url(options),
    method: 'post',
})

enviarPrueba.definition = {
    methods: ["post"],
    url: '/api/fcm/enviar-prueba',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::enviarPrueba
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:125
 * @route '/api/fcm/enviar-prueba'
 */
enviarPrueba.url = (options?: RouteQueryOptions) => {
    return enviarPrueba.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispositivoTokenFcmController::enviarPrueba
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:125
 * @route '/api/fcm/enviar-prueba'
 */
enviarPrueba.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarPrueba.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::enviarPrueba
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:125
 * @route '/api/fcm/enviar-prueba'
 */
    const enviarPruebaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviarPrueba.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DispositivoTokenFcmController::enviarPrueba
 * @see app/Http/Controllers/DispositivoTokenFcmController.php:125
 * @route '/api/fcm/enviar-prueba'
 */
        enviarPruebaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviarPrueba.url(options),
            method: 'post',
        })
    
    enviarPrueba.form = enviarPruebaForm
const fcm = {
    registrar,
desactivar,
enviarPrueba,
}

export default fcm