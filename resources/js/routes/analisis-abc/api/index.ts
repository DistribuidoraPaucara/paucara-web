import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AnalisisAbcController::calcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
export const calcularAnalisis = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularAnalisis.url(options),
    method: 'post',
})

calcularAnalisis.definition = {
    methods: ["post"],
    url: '/inventario/analisis-abc/api/calcular-analisis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::calcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
calcularAnalisis.url = (options?: RouteQueryOptions) => {
    return calcularAnalisis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::calcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
calcularAnalisis.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcularAnalisis.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::recomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
export const recomendaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})

recomendaciones.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/api/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::recomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
recomendaciones.url = (options?: RouteQueryOptions) => {
    return recomendaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::recomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
recomendaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recomendaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::recomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
recomendaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recomendaciones.url(options),
    method: 'head',
})
const api = {
    calcularAnalisis,
recomendaciones,
}

export default api