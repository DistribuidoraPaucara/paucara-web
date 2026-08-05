import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\CreditoImportController::validar
 * @see app/Http/Controllers/CreditoImportController.php:23
 * @route '/api/creditos/importar/validar'
 */
    const validarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CreditoImportController::validar
 * @see app/Http/Controllers/CreditoImportController.php:23
 * @route '/api/creditos/importar/validar'
 */
        validarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validar.url(options),
            method: 'post',
        })
    
    validar.form = validarForm
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

    /**
* @see \App\Http\Controllers\CreditoImportController::importar
 * @see app/Http/Controllers/CreditoImportController.php:66
 * @route '/api/creditos/importar'
 */
    const importarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CreditoImportController::importar
 * @see app/Http/Controllers/CreditoImportController.php:66
 * @route '/api/creditos/importar'
 */
        importarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importar.url(options),
            method: 'post',
        })
    
    importar.form = importarForm
const CreditoImportController = { validar, importar }

export default CreditoImportController