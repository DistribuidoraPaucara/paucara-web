import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
export const imprimir = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/movimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimir.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return imprimir.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimir.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimir.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
    const imprimirForm = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
        imprimirForm.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1864
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
        imprimirForm.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
export const exportarExcel = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/cajas/{caja}/movimientos/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.url = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { caja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { caja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        caja: typeof args.caja === 'object'
                ? args.caja.id
                : args.caja,
                }

    return exportarExcel.definition.url
            .replace('{caja}', parsedArgs.caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
    const exportarExcelForm = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
        exportarExcelForm.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1917
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
        exportarExcelForm.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarExcel.form = exportarExcelForm
/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
export const exportarPdf = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/cajas/{caja}/movimientos/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.url = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { caja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { caja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        caja: typeof args.caja === 'object'
                ? args.caja.id
                : args.caja,
                }

    return exportarPdf.definition.url
            .replace('{caja}', parsedArgs.caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
    const exportarPdfForm = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
        exportarPdfForm.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
        exportarPdfForm.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarPdf.form = exportarPdfForm
const movimientos = {
    imprimir,
exportarExcel,
exportarPdf,
}

export default movimientos