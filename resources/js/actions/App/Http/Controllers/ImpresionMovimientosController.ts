import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
const imprimir953cb93fd8911e668220e194a2a1d792 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir953cb93fd8911e668220e194a2a1d792.url(options),
    method: 'get',
})

imprimir953cb93fd8911e668220e194a2a1d792.definition = {
    methods: ["get","head"],
    url: '/inventario/movimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir953cb93fd8911e668220e194a2a1d792.url = (options?: RouteQueryOptions) => {
    return imprimir953cb93fd8911e668220e194a2a1d792.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir953cb93fd8911e668220e194a2a1d792.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir953cb93fd8911e668220e194a2a1d792.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/inventario/movimientos/imprimir'
 */
imprimir953cb93fd8911e668220e194a2a1d792.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir953cb93fd8911e668220e194a2a1d792.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/movimientos/imprimir'
 */
const imprimir0b6bc42e50c7f83de29cdb7d98bede71 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir0b6bc42e50c7f83de29cdb7d98bede71.url(options),
    method: 'get',
})

imprimir0b6bc42e50c7f83de29cdb7d98bede71.definition = {
    methods: ["get","head"],
    url: '/movimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/movimientos/imprimir'
 */
imprimir0b6bc42e50c7f83de29cdb7d98bede71.url = (options?: RouteQueryOptions) => {
    return imprimir0b6bc42e50c7f83de29cdb7d98bede71.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/movimientos/imprimir'
 */
imprimir0b6bc42e50c7f83de29cdb7d98bede71.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir0b6bc42e50c7f83de29cdb7d98bede71.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::imprimir
 * @see app/Http/Controllers/ImpresionMovimientosController.php:16
 * @route '/movimientos/imprimir'
 */
imprimir0b6bc42e50c7f83de29cdb7d98bede71.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir0b6bc42e50c7f83de29cdb7d98bede71.url(options),
    method: 'head',
})

export const imprimir = {
    '/inventario/movimientos/imprimir': imprimir953cb93fd8911e668220e194a2a1d792,
    '/movimientos/imprimir': imprimir0b6bc42e50c7f83de29cdb7d98bede71,
}

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::preview
 * @see app/Http/Controllers/ImpresionMovimientosController.php:0
 * @route '/movimientos/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/movimientos/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::preview
 * @see app/Http/Controllers/ImpresionMovimientosController.php:0
 * @route '/movimientos/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionMovimientosController::preview
 * @see app/Http/Controllers/ImpresionMovimientosController.php:0
 * @route '/movimientos/preview'
 */
preview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionMovimientosController::preview
 * @see app/Http/Controllers/ImpresionMovimientosController.php:0
 * @route '/movimientos/preview'
 */
preview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(options),
    method: 'head',
})
const ImpresionMovimientosController = { imprimir, preview }

export default ImpresionMovimientosController