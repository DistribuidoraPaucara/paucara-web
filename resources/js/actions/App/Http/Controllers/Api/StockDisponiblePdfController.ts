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
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
 * @route '/api/app/stock/imagen'
 */
    const imagenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
 * @route '/api/app/stock/imagen'
 */
        imagenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagen
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:143
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
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
    const imagenPythonForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagenPython.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
        imagenPythonForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagenPython.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::imagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:541
 * @route '/api/app/stock/imagen-python'
 */
        imagenPythonForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagenPython.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imagenPython.form = imagenPythonForm
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
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
    const catalogoPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalogoPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
        catalogoPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogoPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoPdf
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:664
 * @route '/api/app/stock/catalogo-pdf'
 */
        catalogoPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogoPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalogoPdf.form = catalogoPdfForm
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

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
    const catalogoImagenPythonForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalogoImagenPython.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
        catalogoImagenPythonForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogoImagenPython.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::catalogoImagenPython
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:746
 * @route '/api/app/stock/catalogo-imagen-python'
 */
        catalogoImagenPythonForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogoImagenPython.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalogoImagenPython.form = catalogoImagenPythonForm
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.url = (options?: RouteQueryOptions) => {
    return test74f97cd302fe4500bf59fb78548813b5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test74f97cd302fe4500bf59fb78548813b5.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
test74f97cd302fe4500bf59fb78548813b5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test74f97cd302fe4500bf59fb78548813b5.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
    const test74f97cd302fe4500bf59fb78548813b5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test74f97cd302fe4500bf59fb78548813b5.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test'
 */
        test74f97cd302fe4500bf59fb78548813b5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test74f97cd302fe4500bf59fb78548813b5.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.url = (options?: RouteQueryOptions) => {
    return testfb66b5768da98d3512e5d911402471bc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testfb66b5768da98d3512e5d911402471bc.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test-local'
 */
testfb66b5768da98d3512e5d911402471bc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testfb66b5768da98d3512e5d911402471bc.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test-local'
 */
    const testfb66b5768da98d3512e5d911402471bcForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: testfb66b5768da98d3512e5d911402471bc.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
 * @route '/api/app/stock/imagen/test-local'
 */
        testfb66b5768da98d3512e5d911402471bcForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testfb66b5768da98d3512e5d911402471bc.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::test
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:446
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
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
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.url = (options?: RouteQueryOptions) => {
    return debug.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
debug.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
    const debugForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: debug.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
 * @route '/api/app/stock/imagen/debug'
 */
        debugForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\StockDisponiblePdfController::debug
 * @see app/Http/Controllers/Api/StockDisponiblePdfController.php:852
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
const StockDisponiblePdfController = { generar, imagen, imagenPython, catalogoPdf, catalogoImagenPython, test, debug }

export default StockDisponiblePdfController