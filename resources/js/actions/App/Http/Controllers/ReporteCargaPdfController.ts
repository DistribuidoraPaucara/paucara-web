import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
export const generarPdf = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarPdf.url(args, options),
    method: 'get',
})

generarPdf.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
generarPdf.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return generarPdf.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
generarPdf.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
generarPdf.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
    const generarPdfForm = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
        generarPdfForm.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:27
 * @route '/api/reportes-carga/{reporte}/pdf'
 */
        generarPdfForm.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generarPdf.form = generarPdfForm
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
export const generarPdfDetallado = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarPdfDetallado.url(args, options),
    method: 'get',
})

generarPdfDetallado.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf-detallado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
generarPdfDetallado.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return generarPdfDetallado.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
generarPdfDetallado.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generarPdfDetallado.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
generarPdfDetallado.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generarPdfDetallado.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
    const generarPdfDetalladoForm = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generarPdfDetallado.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
        generarPdfDetalladoForm.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarPdfDetallado.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::generarPdfDetallado
 * @see app/Http/Controllers/ReporteCargaPdfController.php:75
 * @route '/api/reportes-carga/{reporte}/pdf-detallado'
 */
        generarPdfDetalladoForm.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generarPdfDetallado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generarPdfDetallado.form = generarPdfDetalladoForm
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
export const previewPdf = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPdf.url(args, options),
    method: 'get',
})

previewPdf.definition = {
    methods: ["get","head"],
    url: '/api/reportes-carga/{reporte}/pdf-preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
previewPdf.url = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return previewPdf.definition.url
            .replace('{reporte}', parsedArgs.reporte.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
previewPdf.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
previewPdf.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
    const previewPdfForm = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
        previewPdfForm.get = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCargaPdfController::previewPdf
 * @see app/Http/Controllers/ReporteCargaPdfController.php:126
 * @route '/api/reportes-carga/{reporte}/pdf-preview'
 */
        previewPdfForm.head = (args: { reporte: number | { id: number } } | [reporte: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewPdf.form = previewPdfForm
const ReporteCargaPdfController = { generarPdf, generarPdfDetallado, previewPdf }

export default ReporteCargaPdfController