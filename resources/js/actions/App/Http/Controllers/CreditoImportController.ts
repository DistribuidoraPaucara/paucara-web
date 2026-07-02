import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CreditoImportController::validar
 * @see app/Http/Controllers/CreditoImportController.php:23
 * @route '/api/creditos/importar/validar'
 */
export const validar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validar.url(options),
    method: 'post',
})

validar.definition = {
    methods: ["post"],
    url: '/api/creditos/importar/validar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CreditoImportController::validar
 * @see app/Http/Controllers/CreditoImportController.php:23
 * @route '/api/creditos/importar/validar'
 */
validar.url = (options?: RouteQueryOptions) => {
    return validar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoImportController::validar
 * @see app/Http/Controllers/CreditoImportController.php:23
 * @route '/api/creditos/importar/validar'
 */
validar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditoImportController::importar
 * @see app/Http/Controllers/CreditoImportController.php:66
 * @route '/api/creditos/importar'
 */
export const importar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importar.url(options),
    method: 'post',
})

importar.definition = {
    methods: ["post"],
    url: '/api/creditos/importar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CreditoImportController::importar
 * @see app/Http/Controllers/CreditoImportController.php:66
 * @route '/api/creditos/importar'
 */
importar.url = (options?: RouteQueryOptions) => {
    return importar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoImportController::importar
 * @see app/Http/Controllers/CreditoImportController.php:66
 * @route '/api/creditos/importar'
 */
importar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importar.url(options),
    method: 'post',
})
const CreditoImportController = { validar, importar }

export default CreditoImportController