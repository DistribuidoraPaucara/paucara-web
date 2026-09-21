import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
export const productosSinCodigo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosSinCodigo.url(options),
    method: 'get',
})

productosSinCodigo.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/productos-sin-codigo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
productosSinCodigo.url = (options?: RouteQueryOptions) => {
    return productosSinCodigo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
productosSinCodigo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosSinCodigo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
productosSinCodigo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosSinCodigo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
    const productosSinCodigoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosSinCodigo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
        productosSinCodigoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosSinCodigo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::productosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:22
 * @route '/reportes/codigos-barra/productos-sin-codigo'
 */
        productosSinCodigoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosSinCodigo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosSinCodigo.form = productosSinCodigoForm
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
export const duplicadosInactivos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: duplicadosInactivos.url(options),
    method: 'get',
})

duplicadosInactivos.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/duplicados-inactivos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
duplicadosInactivos.url = (options?: RouteQueryOptions) => {
    return duplicadosInactivos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
duplicadosInactivos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: duplicadosInactivos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
duplicadosInactivos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: duplicadosInactivos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
    const duplicadosInactivosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: duplicadosInactivos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
        duplicadosInactivosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: duplicadosInactivos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::duplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
        duplicadosInactivosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: duplicadosInactivos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    duplicadosInactivos.form = duplicadosInactivosForm
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
export const historialCambios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCambios.url(options),
    method: 'get',
})

historialCambios.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/historial-cambios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
historialCambios.url = (options?: RouteQueryOptions) => {
    return historialCambios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
historialCambios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCambios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
historialCambios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialCambios.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
    const historialCambiosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialCambios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
        historialCambiosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCambios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::historialCambios
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:155
 * @route '/reportes/codigos-barra/historial-cambios'
 */
        historialCambiosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCambios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialCambios.form = historialCambiosForm
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
export const descargarProductosSinCodigo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarProductosSinCodigo.url(options),
    method: 'get',
})

descargarProductosSinCodigo.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/descargar/productos-sin-codigo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
descargarProductosSinCodigo.url = (options?: RouteQueryOptions) => {
    return descargarProductosSinCodigo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
descargarProductosSinCodigo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarProductosSinCodigo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
descargarProductosSinCodigo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarProductosSinCodigo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
    const descargarProductosSinCodigoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarProductosSinCodigo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
        descargarProductosSinCodigoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarProductosSinCodigo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarProductosSinCodigo
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:229
 * @route '/reportes/codigos-barra/descargar/productos-sin-codigo'
 */
        descargarProductosSinCodigoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarProductosSinCodigo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarProductosSinCodigo.form = descargarProductosSinCodigoForm
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
export const descargarHistorial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarHistorial.url(options),
    method: 'get',
})

descargarHistorial.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/descargar/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
descargarHistorial.url = (options?: RouteQueryOptions) => {
    return descargarHistorial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
descargarHistorial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarHistorial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
descargarHistorial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarHistorial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
    const descargarHistorialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarHistorial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
        descargarHistorialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarHistorial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCodigosBarraController::descargarHistorial
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:253
 * @route '/reportes/codigos-barra/descargar/historial'
 */
        descargarHistorialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarHistorial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarHistorial.form = descargarHistorialForm
const codigosBarra = {
    productosSinCodigo,
duplicadosInactivos,
historialCambios,
descargarProductosSinCodigo,
descargarHistorial,
}

export default codigosBarra