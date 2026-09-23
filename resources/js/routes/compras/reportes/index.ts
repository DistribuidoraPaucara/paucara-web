import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteComprasController::index
 * @see app/Http/Controllers/ReporteComprasController.php:18
 * @route '/compras/reportes'
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
/**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/compras/reportes/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteComprasController::exportMethod
 * @see app/Http/Controllers/ReporteComprasController.php:245
 * @route '/compras/reportes/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/compras/reportes/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteComprasController::exportPdf
 * @see app/Http/Controllers/ReporteComprasController.php:368
 * @route '/compras/reportes/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
const reportes = {
    index,
export: exportMethod,
exportPdf,
}

export default reportes