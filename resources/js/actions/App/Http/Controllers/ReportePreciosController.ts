import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportePreciosController::index
 * @see app/Http/Controllers/ReportePreciosController.php:15
 * @route '/reportes/precios'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reportes/precios/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportePreciosController::exportMethod
 * @see app/Http/Controllers/ReportePreciosController.php:159
 * @route '/reportes/precios/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
export const ganancias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ganancias.url(options),
    method: 'get',
})

ganancias.definition = {
    methods: ["get","head"],
    url: '/reportes/ganancias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
ganancias.url = (options?: RouteQueryOptions) => {
    return ganancias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
ganancias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ganancias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
ganancias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ganancias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
    const gananciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ganancias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
        gananciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ganancias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportePreciosController::ganancias
 * @see app/Http/Controllers/ReportePreciosController.php:66
 * @route '/reportes/ganancias'
 */
        gananciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ganancias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ganancias.form = gananciasForm
/**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
export const exportGanancias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportGanancias.url(options),
    method: 'get',
})

exportGanancias.definition = {
    methods: ["get","head"],
    url: '/reportes/ganancias/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportGanancias.url = (options?: RouteQueryOptions) => {
    return exportGanancias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportGanancias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportGanancias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
exportGanancias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportGanancias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
    const exportGananciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportGanancias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
        exportGananciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportGanancias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportePreciosController::exportGanancias
 * @see app/Http/Controllers/ReportePreciosController.php:208
 * @route '/reportes/ganancias/export'
 */
        exportGananciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportGanancias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportGanancias.form = exportGananciasForm
const ReportePreciosController = { index, exportMethod, ganancias, exportGanancias, export: exportMethod }

export default ReportePreciosController