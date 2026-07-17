import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:1052
 * @route '/inventario/ajuste'
 */
export const form = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:1052
 * @route '/inventario/ajuste'
 */
form.url = (options?: RouteQueryOptions) => {
    return form.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:1052
 * @route '/inventario/ajuste'
 */
form.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::form
 * @see app/Http/Controllers/InventarioController.php:1052
 * @route '/inventario/ajuste'
 */
form.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::procesar
 * @see app/Http/Controllers/InventarioController.php:1219
 * @route '/inventario/ajuste'
 */
export const procesar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesar.url(options),
    method: 'post',
})

procesar.definition = {
    methods: ["post"],
    url: '/inventario/ajuste',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::procesar
 * @see app/Http/Controllers/InventarioController.php:1219
 * @route '/inventario/ajuste'
 */
procesar.url = (options?: RouteQueryOptions) => {
    return procesar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::procesar
 * @see app/Http/Controllers/InventarioController.php:1219
 * @route '/inventario/ajuste'
 */
procesar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:3713
 * @route '/inventario/ajuste/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:3713
 * @route '/inventario/ajuste/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:3713
 * @route '/inventario/ajuste/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::imprimir
 * @see app/Http/Controllers/InventarioController.php:3713
 * @route '/inventario/ajuste/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})
const ajuste = {
    form,
procesar,
imprimir,
}

export default ajuste