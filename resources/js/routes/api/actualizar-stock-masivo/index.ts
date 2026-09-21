import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
export const descargarPlantilla = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPlantilla.url(options),
    method: 'get',
})

descargarPlantilla.definition = {
    methods: ["get","head"],
    url: '/api/actualizar-stock-masivo/descargar-plantilla',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
descargarPlantilla.url = (options?: RouteQueryOptions) => {
    return descargarPlantilla.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
descargarPlantilla.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarPlantilla.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
descargarPlantilla.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarPlantilla.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
    const descargarPlantillaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarPlantilla.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
        descargarPlantillaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPlantilla.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::descargarPlantilla
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:52
 * @route '/api/actualizar-stock-masivo/descargar-plantilla'
 */
        descargarPlantillaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarPlantilla.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarPlantilla.form = descargarPlantillaForm
/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCsv
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
export const procesarCsv = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCsv.url(options),
    method: 'post',
})

procesarCsv.definition = {
    methods: ["post"],
    url: '/api/actualizar-stock-masivo/procesar-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCsv
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
procesarCsv.url = (options?: RouteQueryOptions) => {
    return procesarCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCsv
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
procesarCsv.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCsv.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCsv
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
    const procesarCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarCsv.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCsv
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
        procesarCsvForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarCsv.url(options),
            method: 'post',
        })
    
    procesarCsv.form = procesarCsvForm
const actualizarStockMasivo = {
    descargarPlantilla,
procesarCsv,
}

export default actualizarStockMasivo