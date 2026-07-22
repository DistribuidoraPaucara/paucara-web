import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:159
 * @route '/admin/creditos/importar'
 */
export const importar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importar.url(options),
    method: 'get',
})

importar.definition = {
    methods: ["get","head"],
    url: '/admin/creditos/importar',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:159
 * @route '/admin/creditos/importar'
 */
importar.url = (options?: RouteQueryOptions) => {
    return importar.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:159
 * @route '/admin/creditos/importar'
 */
importar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importar.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:159
 * @route '/admin/creditos/importar'
 */
importar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/admin/creditos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})
const creditos = {
    importar,
crear,
}

export default creditos