import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReporteCargoController::crear
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crear.url(options),
    method: 'post',
})

crear.definition = {
    methods: ["post"],
    url: '/api/reportes-carga',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::crear
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::crear
 * @see app/Http/Controllers/Api/ReporteCargoController.php:28
 * @route '/api/reportes-carga'
 */
crear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crear.url(options),
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
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
export const confirmar = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

confirmar.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
confirmar.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirmar.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::confirmar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:161
 * @route '/api/reportes-carga/{reporte}/confirmar'
 */
confirmar.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::listoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
export const listoParaEntrega = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listoParaEntrega.url(args, options),
    method: 'post',
})

listoParaEntrega.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/listo-para-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::listoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
listoParaEntrega.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return listoParaEntrega.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::listoParaEntrega
 * @see app/Http/Controllers/Api/ReporteCargoController.php:183
 * @route '/api/reportes-carga/{reporte}/listo-para-entrega'
 */
listoParaEntrega.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listoParaEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
export const cancelar = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/api/reportes-carga/{reporte}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
cancelar.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelar.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteCargoController::cancelar
 * @see app/Http/Controllers/Api/ReporteCargoController.php:205
 * @route '/api/reportes-carga/{reporte}/cancelar'
 */
cancelar.post = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
export const pdf = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
pdf.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
pdf.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
pdf.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
export const pdfDetallado = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdfDetallado.url(args, options),
    method: 'get',
})

pdfDetallado.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf-detallado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
pdfDetallado.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pdfDetallado.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
pdfDetallado.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdfDetallado.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
pdfDetallado.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdfDetallado.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfPreview
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
export const pdfPreview = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdfPreview.url(args, options),
    method: 'get',
})

pdfPreview.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf-preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfPreview
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
pdfPreview.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pdfPreview.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfPreview
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
pdfPreview.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdfPreview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::pdfPreview
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
pdfPreview.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdfPreview.url(args, options),
    method: 'head',
})
const reportesCarga = {
    crear,
formatosDisponibles,
show,
preview,
descargar,
actualizarDetalle,
verificarDetalle,
confirmar,
listoParaEntrega,
cancelar,
pdf,
pdfDetallado,
pdfPreview,
}

export default reportesCarga