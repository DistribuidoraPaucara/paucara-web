import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes/ganancias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reportes/ganancias/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})
const ganancias = {
    index,
export: exportMethod,
}

export default ganancias