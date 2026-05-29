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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
 * @route '/api/app/stock/imagen'
 */
imagen.url = (options?: RouteQueryOptions) => {
    return imagen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
 * @route '/api/app/stock/imagen'
 */
imagen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
 * @route '/api/app/stock/imagen'
 */
imagen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
 * @route '/api/app/stock/imagen'
 */
    const imagenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
 * @route '/api/app/stock/imagen'
 */
        imagenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:139
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
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
const test74f97cd302fe4500bf59fb78548813b5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test74f97cd302fe4500bf59fb78548813b5.url(options),
    method: 'get',
})

test74f97cd302fe4500bf59fb78548813b5.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.url = (options?: RouteQueryOptions) => {
    return test74f97cd302fe4500bf59fb78548813b5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test74f97cd302fe4500bf59fb78548813b5.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test74f97cd302fe4500bf59fb78548813b5.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
    const test74f97cd302fe4500bf59fb78548813b5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test74f97cd302fe4500bf59fb78548813b5.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
        test74f97cd302fe4500bf59fb78548813b5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test74f97cd302fe4500bf59fb78548813b5.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test'
 */
        test74f97cd302fe4500bf59fb78548813b5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test74f97cd302fe4500bf59fb78548813b5.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    test74f97cd302fe4500bf59fb78548813b5.form = test74f97cd302fe4500bf59fb78548813b5Form
    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
const testfb66b5768da98d3512e5d911402471bc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testfb66b5768da98d3512e5d911402471bc.url(options),
    method: 'get',
})

testfb66b5768da98d3512e5d911402471bc.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/test-local',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.url = (options?: RouteQueryOptions) => {
    return testfb66b5768da98d3512e5d911402471bc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testfb66b5768da98d3512e5d911402471bc.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testfb66b5768da98d3512e5d911402471bc.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
    const testfb66b5768da98d3512e5d911402471bcForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: testfb66b5768da98d3512e5d911402471bc.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
        testfb66b5768da98d3512e5d911402471bcForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testfb66b5768da98d3512e5d911402471bc.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:427
 * @route '/api/app/stock/imagen/test-local'
 */
        testfb66b5768da98d3512e5d911402471bcForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testfb66b5768da98d3512e5d911402471bc.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    testfb66b5768da98d3512e5d911402471bc.form = testfb66b5768da98d3512e5d911402471bcForm

export const test = {
    '/api/app/stock/imagen/test': test74f97cd302fe4500bf59fb78548813b5,
    '/api/app/stock/imagen/test-local': testfb66b5768da98d3512e5d911402471bc,
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
export const debug = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})

debug.definition = {
    methods: ["get","head"],
    url: '/api/app/stock/imagen/debug',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.url = (options?: RouteQueryOptions) => {
    return debug.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
debug.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
    const debugForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: debug.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
        debugForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:513
 * @route '/api/app/stock/imagen/debug'
 */
        debugForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    debug.form = debugForm
const StockDisponiblePdfController = { generar, imagen, test, debug }

export default StockDisponiblePdfController