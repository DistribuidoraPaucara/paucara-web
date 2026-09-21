import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import api from './api'
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
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::index
 * @see app/Http/Controllers/AnalisisAbcController.php:14
 * @route '/inventario/analisis-abc'
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
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::dashboard
 * @see app/Http/Controllers/AnalisisAbcController.php:113
 * @route '/inventario/analisis-abc/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
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
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
    const showForm = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
        showForm.get = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::show
 * @see app/Http/Controllers/AnalisisAbcController.php:63
 * @route '/inventario/analisis-abc/{analisisAbc}'
 */
        showForm.head = (args: { analisisAbc: number | { id: number } } | [analisisAbc: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
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
* @see \App\Http\Controllers\AnalisisAbcController::calcular
 * @see app/Http/Controllers/AnalisisAbcController.php:85
 * @route '/inventario/analisis-abc/calcular'
 */
    const calcularForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: calcular.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::calcular
 * @see app/Http/Controllers/AnalisisAbcController.php:85
 * @route '/inventario/analisis-abc/calcular'
 */
        calcularForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: calcular.url(options),
            method: 'post',
        })
    
    calcular.form = calcularForm
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
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::exportMethod
 * @see app/Http/Controllers/AnalisisAbcController.php:321
 * @route '/inventario/analisis-abc/export'
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
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
    const reporteRotacionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteRotacion.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
        reporteRotacionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteRotacion.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::reporteRotacion
 * @see app/Http/Controllers/AnalisisAbcController.php:179
 * @route '/inventario/analisis-abc/reportes/rotacion'
 */
        reporteRotacionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteRotacion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteRotacion.form = reporteRotacionForm
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
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
    const reporteObsoletosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteObsoletos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
        reporteObsoletosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteObsoletos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalisisAbcController::reporteObsoletos
 * @see app/Http/Controllers/AnalisisAbcController.php:218
 * @route '/inventario/analisis-abc/reportes/obsoletos'
 */
        reporteObsoletosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteObsoletos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteObsoletos.form = reporteObsoletosForm
const analisisAbc = {
    index,
dashboard,
show,
calcular,
export: exportMethod,
reporteRotacion,
reporteObsoletos,
api,
}

export default analisisAbc