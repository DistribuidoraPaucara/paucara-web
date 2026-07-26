import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes/credito',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCreditoController::graficos
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
export const graficos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})

graficos.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/graficos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::graficos
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
graficos.url = (options?: RouteQueryOptions) => {
    return graficos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::graficos
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
graficos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: graficos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::graficos
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
graficos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: graficos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCreditoController::vencidos
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
export const vencidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})

vencidos.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::vencidos
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
vencidos.url = (options?: RouteQueryOptions) => {
    return vencidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::vencidos
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
vencidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::vencidos
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
vencidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vencidos.url(options),
    method: 'head',
})
const credito = {
    index,
graficos,
vencidos,
}

export default credito