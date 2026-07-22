import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
export const obtenerGraficosCreditoApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'get',
})

obtenerGraficosCreditoApi.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/graficos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.url = (options?: RouteQueryOptions) => {
    return obtenerGraficosCreditoApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
export const obtenerClientesVencidosApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'get',
})

obtenerClientesVencidosApi.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.url = (options?: RouteQueryOptions) => {
    return obtenerClientesVencidosApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'head',
})
const ReporteCreditoController = { index, obtenerGraficosCreditoApi, obtenerClientesVencidosApi }

export default ReporteCreditoController