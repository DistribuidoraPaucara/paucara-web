import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
export const pdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
pdf.url = (options?: RouteQueryOptions) => {
    return pdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
pdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
pdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
    const pdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
        pdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::pdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
        pdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
export const imagen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(options),
    method: 'get',
})

imagen.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
imagen.url = (options?: RouteQueryOptions) => {
    return imagen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
imagen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
imagen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
    const imagenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
        imagenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:130
 * @route '/api/app/stock/imagen'
 */
        imagenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imagen.form = imagenForm
const stock = {
    pdf,
imagen,
}

export default stock