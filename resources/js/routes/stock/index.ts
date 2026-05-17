import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
export const exportarExcel = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/stock/{stock}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stock: typeof args.stock === 'object'
                ? args.stock.id
                : args.stock,
                }

    return exportarExcel.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
    const exportarExcelForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
        exportarExcelForm.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
        exportarExcelForm.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
export const exportarPdf = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/stock/{stock}/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stock: typeof args.stock === 'object'
                ? args.stock.id
                : args.stock,
                }

    return exportarPdf.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
    const exportarPdfForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
        exportarPdfForm.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
        exportarPdfForm.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarPdf.form = exportarPdfForm
/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/stock/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
    const imprimirForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
        imprimirForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionStockController::imprimir
 * @see app/Http/Controllers/ImpresionStockController.php:17
 * @route '/stock/imprimir'
 */
        imprimirForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/stock/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
preview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
    const previewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
        previewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionStockController::preview
 * @see app/Http/Controllers/ImpresionStockController.php:106
 * @route '/stock/preview'
 */
        previewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const stock = {
    exportarExcel,
exportarPdf,
imprimir,
preview,
}

export default stock