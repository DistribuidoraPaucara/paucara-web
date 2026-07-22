import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCargoListController::estadisticas
 * @see app/Http/Controllers/ReporteCargoListController.php:185
 * @route '/api/reportes/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/reportes/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargoListController::estadisticas
 * @see app/Http/Controllers/ReporteCargoListController.php:185
 * @route '/api/reportes/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargoListController::estadisticas
 * @see app/Http/Controllers/ReporteCargoListController.php:185
 * @route '/api/reportes/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargoListController::estadisticas
 * @see app/Http/Controllers/ReporteCargoListController.php:185
 * @route '/api/reportes/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteCargoListController::exportarZip
 * @see app/Http/Controllers/ReporteCargoListController.php:202
 * @route '/api/reportes/exportar-zip'
 */
export const exportarZip = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportarZip.url(options),
    method: 'post',
})

exportarZip.definition = {
    methods: ["post"],
    url: '/api/reportes/exportar-zip',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReporteCargoListController::exportarZip
 * @see app/Http/Controllers/ReporteCargoListController.php:202
 * @route '/api/reportes/exportar-zip'
 */
exportarZip.url = (options?: RouteQueryOptions) => {
    return exportarZip.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargoListController::exportarZip
 * @see app/Http/Controllers/ReporteCargoListController.php:202
 * @route '/api/reportes/exportar-zip'
 */
exportarZip.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportarZip.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/logistica/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCargoListController::index
 * @see app/Http/Controllers/ReporteCargoListController.php:31
 * @route '/logistica/reportes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const ReporteCargoListController = { estadisticas, exportarZip, index }

export default ReporteCargoListController