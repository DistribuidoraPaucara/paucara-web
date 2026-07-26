import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
export const show = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/{analisisAbc}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
show.url = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { analisisAbc: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { analisisAbc: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    analisisAbc: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        analisisAbc: typeof args.analisisAbc === 'object'
                ? args.analisisAbc.id
                : args.analisisAbc,
                }

    return show.definition.url
            .replace('{analisisAbc}', parsedArgs.analisisAbc.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
show.get = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
show.head = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::calcular
 * @see app/Http/Controllers/AnalisisAbcController.php:85
 * @route '/inventario/analisis-abc/calcular'
 */
export const calcular = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcular.url(options),
    method: 'post',
})

calcular.definition = {
    methods: ["post"],
    url: '/inventario/analisis-abc/calcular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::calcular
 * @see app/Http/Controllers/AnalisisAbcController.php:85
 * @route '/inventario/analisis-abc/calcular'
 */
calcular.url = (options?: RouteQueryOptions) => {
    return calcular.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::calcular
 * @see app/Http/Controllers/AnalisisAbcController.php:85
 * @route '/inventario/analisis-abc/calcular'
 */
calcular.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calcular.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
export const reporteRotacion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteRotacion.url(options),
    method: 'get',
})

reporteRotacion.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/reportes/rotacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
reporteRotacion.url = (options?: RouteQueryOptions) => {
    return reporteRotacion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
reporteRotacion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteRotacion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
reporteRotacion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteRotacion.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
export const reporteObsoletos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteObsoletos.url(options),
    method: 'get',
})

reporteObsoletos.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/reportes/obsoletos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
reporteObsoletos.url = (options?: RouteQueryOptions) => {
    return reporteObsoletos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
reporteObsoletos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteObsoletos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
reporteObsoletos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteObsoletos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiCalcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
export const apiCalcularAnalisis = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiCalcularAnalisis.url(options),
    method: 'post',
})

apiCalcularAnalisis.definition = {
    methods: ["post"],
    url: '/inventario/analisis-abc/api/calcular-analisis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiCalcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
apiCalcularAnalisis.url = (options?: RouteQueryOptions) => {
    return apiCalcularAnalisis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiCalcularAnalisis
 * @see app/Http/Controllers/AnalisisAbcController.php:247
 * @route '/inventario/analisis-abc/api/calcular-analisis'
 */
apiCalcularAnalisis.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiCalcularAnalisis.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiRecomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
export const apiRecomendaciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiRecomendaciones.url(options),
    method: 'get',
})

apiRecomendaciones.definition = {
    methods: ["get","head"],
    url: '/inventario/analisis-abc/api/recomendaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiRecomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
apiRecomendaciones.url = (options?: RouteQueryOptions) => {
    return apiRecomendaciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalisisAbcController::apiRecomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
apiRecomendaciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiRecomendaciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalisisAbcController::apiRecomendaciones
 * @see app/Http/Controllers/AnalisisAbcController.php:284
 * @route '/inventario/analisis-abc/api/recomendaciones'
 */
apiRecomendaciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiRecomendaciones.url(options),
    method: 'head',
})
const AnalisisAbcController = { index, dashboard, show, calcular, exportMethod, reporteRotacion, reporteObsoletos, apiCalcularAnalisis, apiRecomendaciones, export: exportMethod }

export default AnalisisAbcController