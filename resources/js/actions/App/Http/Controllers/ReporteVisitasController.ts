import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteVisitasController::index
 * @see app/Http/Controllers/ReporteVisitasController.php:19
 * @route '/reportes/visitas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes/visitas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVisitasController::index
 * @see app/Http/Controllers/ReporteVisitasController.php:19
 * @route '/reportes/visitas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVisitasController::index
 * @see app/Http/Controllers/ReporteVisitasController.php:19
 * @route '/reportes/visitas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVisitasController::index
 * @see app/Http/Controllers/ReporteVisitasController.php:19
 * @route '/reportes/visitas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReporteVisitasController::exportarExcel
 * @see app/Http/Controllers/ReporteVisitasController.php:80
 * @route '/reportes/visitas/exportar-excel'
 */
export const exportarExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/reportes/visitas/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVisitasController::exportarExcel
 * @see app/Http/Controllers/ReporteVisitasController.php:80
 * @route '/reportes/visitas/exportar-excel'
 */
exportarExcel.url = (options?: RouteQueryOptions) => {
    return exportarExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVisitasController::exportarExcel
 * @see app/Http/Controllers/ReporteVisitasController.php:80
 * @route '/reportes/visitas/exportar-excel'
 */
exportarExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVisitasController::exportarExcel
 * @see app/Http/Controllers/ReporteVisitasController.php:80
 * @route '/reportes/visitas/exportar-excel'
 */
exportarExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(options),
    method: 'head',
})
const ReporteVisitasController = { index, exportarExcel }

export default ReporteVisitasController