import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::generarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
export const generarReporte = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarReporte.url(options),
    method: 'post',
})

generarReporte.definition = {
    methods: ["post"],
    url: '/api/reportes-carga',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::generarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
generarReporte.url = (options?: RouteQueryOptions) => {
    return generarReporte.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::generarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
generarReporte.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarReporte.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::formatosDisponibles
 * @see app/Http/Controllers/Api/ReporteCargoController.php:283
 * @route '/api/reportes-carga/formatos-disponibles'
 */
export const formatosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})

formatosDisponibles.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/formatos-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::formatosDisponibles
 * @see app/Http/Controllers/Api/ReporteCargoController.php:283
 * @route '/api/reportes-carga/formatos-disponibles'
 */
formatosDisponibles.url = (options?: RouteQueryOptions) => {
    return formatosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::formatosDisponibles
 * @see app/Http/Controllers/Api/ReporteCargoController.php:283
 * @route '/api/reportes-carga/formatos-disponibles'
 */
formatosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::formatosDisponibles
 * @see app/Http/Controllers/Api/ReporteCargoController.php:283
 * @route '/api/reportes-carga/formatos-disponibles'
 */
formatosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formatosDisponibles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::show
 * @see app/Http/Controllers/Api/ReporteCargoController.php:63
 * @route '/api/reportes-carga/{reporte}'
 */
export const show = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::show
 * @see app/Http/Controllers/Api/ReporteCargoController.php:63
 * @route '/api/reportes-carga/{reporte}'
 */
show.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return show.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::show
 * @see app/Http/Controllers/Api/ReporteCargoController.php:63
 * @route '/api/reportes-carga/{reporte}'
 */
show.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::show
 * @see app/Http/Controllers/Api/ReporteCargoController.php:63
 * @route '/api/reportes-carga/{reporte}'
 */
show.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::preview
 * @see app/Http/Controllers/Api/ReporteCargoController.php:311
 * @route '/api/reportes-carga/{reporte}/preview'
 */
export const preview = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::preview
 * @see app/Http/Controllers/Api/ReporteCargoController.php:311
 * @route '/api/reportes-carga/{reporte}/preview'
 */
preview.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return preview.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::preview
 * @see app/Http/Controllers/Api/ReporteCargoController.php:311
 * @route '/api/reportes-carga/{reporte}/preview'
 */
preview.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::preview
 * @see app/Http/Controllers/Api/ReporteCargoController.php:311
 * @route '/api/reportes-carga/{reporte}/preview'
 */
preview.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::descargar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:235
 * @route '/api/reportes-carga/{reporte}/descargar'
 */
export const descargar = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

descargar.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/descargar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::descargar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:235
 * @route '/api/reportes-carga/{reporte}/descargar'
 */
descargar.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return descargar.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::descargar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:235
 * @route '/api/reportes-carga/{reporte}/descargar'
 */
descargar.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::descargar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:235
 * @route '/api/reportes-carga/{reporte}/descargar'
 */
descargar.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::actualizarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:82
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}'
 */
export const actualizarDetalle = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarDetalle.url(args, options),
    method: 'patch',
})

actualizarDetalle.definition = {
    methods: ["patch"],
    url: '/api/reportes-carga/{reporte}/detalles/{detalle}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::actualizarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:82
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}'
 */
actualizarDetalle.url = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return actualizarDetalle.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::actualizarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:82
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}'
 */
actualizarDetalle.patch = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarDetalle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::verificarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:124
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}/verificar'
 */
export const verificarDetalle = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarDetalle.url(args, options),
    method: 'post',
})

verificarDetalle.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/detalles/{detalle}/verificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::verificarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:124
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}/verificar'
 */
verificarDetalle.url = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                    detalle: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                                detalle: typeof args.detalle === 'object'
                ? args.detalle.id
                : args.detalle,
                }

    return verificarDetalle.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::verificarDetalle
 * @see app/Http/Controllers/Api/ReporteCargoController.php:124
 * @route '/api/reportes-carga/{reporte}/detalles/{detalle}/verificar'
 */
verificarDetalle.post = (args: { reporte: number | { id: number }, detalle: number | { id: number } } | [reporte: number | { id: number }, detalle: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarDetalle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmarCarga
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
export const confirmarCarga = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarCarga.url(args, options),
    method: 'post',
})

confirmarCarga.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmarCarga
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
confirmarCarga.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return confirmarCarga.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmarCarga
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
confirmarCarga.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarCarga.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
export const marcarListoParaEntrega = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarListoParaEntrega.url(args, options),
    method: 'post',
})

marcarListoParaEntrega.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/listo-para-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
marcarListoParaEntrega.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return marcarListoParaEntrega.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
marcarListoParaEntrega.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarListoParaEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
export const cancelarReporte = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarReporte.url(args, options),
    method: 'post',
})

cancelarReporte.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
cancelarReporte.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reporte: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reporte: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reporte: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reporte: typeof args.reporte === 'object'
                ? args.reporte.id
                : args.reporte,
                }

    return cancelarReporte.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelarReporte
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
cancelarReporte.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarReporte.url(args, options),
    method: 'post',
})
const ReporteCargoController = { generarReporte, formatosDisponibles, show, preview, descargar, actualizarDetalle, verificarDetalle, confirmarCarga, marcarListoParaEntrega, cancelarReporte }

export default ReporteCargoController