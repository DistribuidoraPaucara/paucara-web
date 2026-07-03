import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/entregas/{entregaId}/ubicaciones'
 */
const obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4 = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.url(args, options),
    method: 'get',
})

obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.definition = {
    methods: ["get","head"],
    url: '/api/tracking/entregas/{entregaId}/ubicaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/entregas/{entregaId}/ubicaciones'
 */
obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.url = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entregaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entregaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entregaId: args.entregaId,
                }

    return obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.definition.url
            .replace('{entregaId}', parsedArgs.entregaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/entregas/{entregaId}/ubicaciones'
 */
obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.get = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/entregas/{entregaId}/ubicaciones'
 */
obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.head = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/ubicaciones/{entregaId}'
 */
const obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6 = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.url(args, options),
    method: 'get',
})

obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.definition = {
    methods: ["get","head"],
    url: '/api/tracking/ubicaciones/{entregaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/ubicaciones/{entregaId}'
 */
obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.url = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entregaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entregaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entregaId: args.entregaId,
                }

    return obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.definition.url
            .replace('{entregaId}', parsedArgs.entregaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/ubicaciones/{entregaId}'
 */
obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.get = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TrackingController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/TrackingController.php:16
 * @route '/api/tracking/ubicaciones/{entregaId}'
 */
obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.head = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6.url(args, options),
    method: 'head',
})

export const obtenerUbicaciones = {
    '/api/tracking/entregas/{entregaId}/ubicaciones': obtenerUbicacionesea6f005e3f2f0b7c9c7cdfffbeedccb4,
    '/api/tracking/ubicaciones/{entregaId}': obtenerUbicacionesf42f8fcb211059ed28ae845c4e0eb5a6,
}

/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/entregas/{entregaId}/ultima-ubicacion'
 */
const ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528 = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.url(args, options),
    method: 'get',
})

ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.definition = {
    methods: ["get","head"],
    url: '/api/tracking/entregas/{entregaId}/ultima-ubicacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/entregas/{entregaId}/ultima-ubicacion'
 */
ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.url = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entregaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entregaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entregaId: args.entregaId,
                }

    return ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.definition.url
            .replace('{entregaId}', parsedArgs.entregaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/entregas/{entregaId}/ultima-ubicacion'
 */
ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.get = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/entregas/{entregaId}/ultima-ubicacion'
 */
ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.head = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/ultima-ubicacion/{entregaId}'
 */
const ultimaUbicacionfdc3628d74f6c816d18de12533df85de = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ultimaUbicacionfdc3628d74f6c816d18de12533df85de.url(args, options),
    method: 'get',
})

ultimaUbicacionfdc3628d74f6c816d18de12533df85de.definition = {
    methods: ["get","head"],
    url: '/api/tracking/ultima-ubicacion/{entregaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/ultima-ubicacion/{entregaId}'
 */
ultimaUbicacionfdc3628d74f6c816d18de12533df85de.url = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entregaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entregaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entregaId: args.entregaId,
                }

    return ultimaUbicacionfdc3628d74f6c816d18de12533df85de.definition.url
            .replace('{entregaId}', parsedArgs.entregaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/ultima-ubicacion/{entregaId}'
 */
ultimaUbicacionfdc3628d74f6c816d18de12533df85de.get = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ultimaUbicacionfdc3628d74f6c816d18de12533df85de.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TrackingController::ultimaUbicacion
 * @see app/Http/Controllers/Api/TrackingController.php:67
 * @route '/api/tracking/ultima-ubicacion/{entregaId}'
 */
ultimaUbicacionfdc3628d74f6c816d18de12533df85de.head = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ultimaUbicacionfdc3628d74f6c816d18de12533df85de.url(args, options),
    method: 'head',
})

export const ultimaUbicacion = {
    '/api/tracking/entregas/{entregaId}/ultima-ubicacion': ultimaUbicaciondcaf2cc4745dd6439ed40c530e4da528,
    '/api/tracking/ultima-ubicacion/{entregaId}': ultimaUbicacionfdc3628d74f6c816d18de12533df85de,
}

/**
* @see \App\Http\Controllers\Api\TrackingController::calcularETA
 * @see app/Http/Controllers/Api/TrackingController.php:119
 * @route '/api/tracking/entregas/{entregaId}/calcular-eta'
 */
export const calcularETA = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularETA.url(args, options),
    method: 'post',
})

calcularETA.definition = {
    methods: ["post"],
    url: '/api/tracking/entregas/{entregaId}/calcular-eta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TrackingController::calcularETA
 * @see app/Http/Controllers/Api/TrackingController.php:119
 * @route '/api/tracking/entregas/{entregaId}/calcular-eta'
 */
calcularETA.url = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entregaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entregaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entregaId: args.entregaId,
                }

    return calcularETA.definition.url
            .replace('{entregaId}', parsedArgs.entregaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TrackingController::calcularETA
 * @see app/Http/Controllers/Api/TrackingController.php:119
 * @route '/api/tracking/entregas/{entregaId}/calcular-eta'
 */
calcularETA.post = (args: { entregaId: string | number } | [entregaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularETA.url(args, options),
    method: 'post',
})
const TrackingController = { obtenerUbicaciones, ultimaUbicacion, calcularETA }

export default TrackingController