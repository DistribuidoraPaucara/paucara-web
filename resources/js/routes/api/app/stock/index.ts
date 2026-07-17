import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
import imagen from './imagen'
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
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
 * @route '/api/app/stock/imagen'
 */
imagen.url = (options?: RouteQueryOptions) => {
    return imagen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
 * @route '/api/app/stock/imagen'
 */
imagen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
 * @route '/api/app/stock/imagen'
 */
imagen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagen.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
export const imagenPython = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagenPython.url(options),
    method: 'get',
})

imagenPython.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen-python',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
imagenPython.url = (options?: RouteQueryOptions) => {
    return imagenPython.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
imagenPython.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagenPython.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
imagenPython.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagenPython.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
export const catalogoPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogoPdf.url(options),
    method: 'get',
})

catalogoPdf.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/catalogo-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
catalogoPdf.url = (options?: RouteQueryOptions) => {
    return catalogoPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
catalogoPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogoPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
catalogoPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalogoPdf.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
export const catalogoImagenPython = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogoImagenPython.url(options),
    method: 'get',
})

catalogoImagenPython.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/catalogo-imagen-python',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
catalogoImagenPython.url = (options?: RouteQueryOptions) => {
    return catalogoImagenPython.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
catalogoImagenPython.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogoImagenPython.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
catalogoImagenPython.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalogoImagenPython.url(options),
    method: 'head',
})
const stock = {
    pdf,
imagen,
imagenPython,
catalogoPdf,
catalogoImagenPython,
}

export default stock