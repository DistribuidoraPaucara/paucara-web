import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCSV
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
export const procesarCSV = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCSV.url(options),
    method: 'post',
})

procesarCSV.definition = {
    methods: ["post"],
    url: '/api/actualizar-stock-masivo/procesar-csv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCSV
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
procesarCSV.url = (options?: RouteQueryOptions) => {
    return procesarCSV.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCSV
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
procesarCSV.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCSV.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCSV
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
    const procesarCSVForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarCSV.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::procesarCSV
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:117
 * @route '/api/actualizar-stock-masivo/procesar-csv'
 */
        procesarCSVForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarCSV.url(options),
            method: 'post',
        })
    
    procesarCSV.form = procesarCSVForm
/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/actualizar-stock-masivo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ActualizarStockMasivoController::index
 * @see app/Http/Controllers/ActualizarStockMasivoController.php:38
 * @route '/inventario/actualizar-stock-masivo'
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
const ActualizarStockMasivoController = { descargarPlantilla, procesarCSV, index }

export default ActualizarStockMasivoController