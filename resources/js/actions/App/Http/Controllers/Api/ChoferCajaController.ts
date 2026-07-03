import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerEstado
 * @see app/Http/Controllers/Api/ChoferCajaController.php:22
 * @route '/api/chofer/cajas/estado'
 */
export const obtenerEstado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEstado.url(options),
    method: 'get',
})

obtenerEstado.definition = {
    methods: ["get","head"],
    url: '/api/chofer/cajas/estado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerEstado
 * @see app/Http/Controllers/Api/ChoferCajaController.php:22
 * @route '/api/chofer/cajas/estado'
 */
obtenerEstado.url = (options?: RouteQueryOptions) => {
    return obtenerEstado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerEstado
 * @see app/Http/Controllers/Api/ChoferCajaController.php:22
 * @route '/api/chofer/cajas/estado'
 */
obtenerEstado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEstado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerEstado
 * @see app/Http/Controllers/Api/ChoferCajaController.php:22
 * @route '/api/chofer/cajas/estado'
 */
obtenerEstado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerEstado.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::abrirCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:80
 * @route '/api/chofer/cajas/abrir'
 */
export const abrirCaja = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja.url(options),
    method: 'post',
})

abrirCaja.definition = {
    methods: ["post"],
    url: '/api/chofer/cajas/abrir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::abrirCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:80
 * @route '/api/chofer/cajas/abrir'
 */
abrirCaja.url = (options?: RouteQueryOptions) => {
    return abrirCaja.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::abrirCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:80
 * @route '/api/chofer/cajas/abrir'
 */
abrirCaja.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::cerrarCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:180
 * @route '/api/chofer/cajas/cerrar'
 */
export const cerrarCaja = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCaja.url(options),
    method: 'post',
})

cerrarCaja.definition = {
    methods: ["post"],
    url: '/api/chofer/cajas/cerrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::cerrarCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:180
 * @route '/api/chofer/cajas/cerrar'
 */
cerrarCaja.url = (options?: RouteQueryOptions) => {
    return cerrarCaja.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::cerrarCaja
 * @see app/Http/Controllers/Api/ChoferCajaController.php:180
 * @route '/api/chofer/cajas/cerrar'
 */
cerrarCaja.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCaja.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerMovimientos
 * @see app/Http/Controllers/Api/ChoferCajaController.php:279
 * @route '/api/chofer/cajas/movimientos'
 */
export const obtenerMovimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMovimientos.url(options),
    method: 'get',
})

obtenerMovimientos.definition = {
    methods: ["get","head"],
    url: '/api/chofer/cajas/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerMovimientos
 * @see app/Http/Controllers/Api/ChoferCajaController.php:279
 * @route '/api/chofer/cajas/movimientos'
 */
obtenerMovimientos.url = (options?: RouteQueryOptions) => {
    return obtenerMovimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerMovimientos
 * @see app/Http/Controllers/Api/ChoferCajaController.php:279
 * @route '/api/chofer/cajas/movimientos'
 */
obtenerMovimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMovimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerMovimientos
 * @see app/Http/Controllers/Api/ChoferCajaController.php:279
 * @route '/api/chofer/cajas/movimientos'
 */
obtenerMovimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerMovimientos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerResumen
 * @see app/Http/Controllers/Api/ChoferCajaController.php:329
 * @route '/api/chofer/cajas/resumen'
 */
export const obtenerResumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(options),
    method: 'get',
})

obtenerResumen.definition = {
    methods: ["get","head"],
    url: '/api/chofer/cajas/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerResumen
 * @see app/Http/Controllers/Api/ChoferCajaController.php:329
 * @route '/api/chofer/cajas/resumen'
 */
obtenerResumen.url = (options?: RouteQueryOptions) => {
    return obtenerResumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerResumen
 * @see app/Http/Controllers/Api/ChoferCajaController.php:329
 * @route '/api/chofer/cajas/resumen'
 */
obtenerResumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ChoferCajaController::obtenerResumen
 * @see app/Http/Controllers/Api/ChoferCajaController.php:329
 * @route '/api/chofer/cajas/resumen'
 */
obtenerResumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumen.url(options),
    method: 'head',
})
const ChoferCajaController = { obtenerEstado, abrirCaja, cerrarCaja, obtenerMovimientos, obtenerResumen }

export default ChoferCajaController