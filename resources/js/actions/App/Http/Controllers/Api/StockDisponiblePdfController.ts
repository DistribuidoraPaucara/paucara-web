import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})

generar.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
generar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
generar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
    const generarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
        generarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::generar
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:40
 * @route '/api/app/stock/pdf'
 */
        generarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generar.form = generarForm
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
const StockDisponiblePdfController = { generar, imagen }

export default StockDisponiblePdfController