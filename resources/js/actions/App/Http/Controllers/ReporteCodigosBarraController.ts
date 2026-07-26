import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ReporteCodigosBarraController::codigosDuplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
export const codigosDuplicadosInactivos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codigosDuplicadosInactivos.url(options),
    method: 'get',
})

codigosDuplicadosInactivos.definition = {
    methods: ["get","head"],
    url: '/reportes/codigos-barra/duplicados-inactivos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::codigosDuplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
codigosDuplicadosInactivos.url = (options?: RouteQueryOptions) => {
    return codigosDuplicadosInactivos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::codigosDuplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
codigosDuplicadosInactivos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codigosDuplicadosInactivos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCodigosBarraController::codigosDuplicadosInactivos
 * @see app/Http/Controllers/ReporteCodigosBarraController.php:78
 * @route '/reportes/codigos-barra/duplicados-inactivos'
 */
codigosDuplicadosInactivos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: codigosDuplicadosInactivos.url(options),
    method: 'head',
})

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
const ReporteCodigosBarraController = { productosSinCodigo, codigosDuplicadosInactivos, historialCambios, descargarProductosSinCodigo, descargarHistorial }

export default ReporteCodigosBarraController