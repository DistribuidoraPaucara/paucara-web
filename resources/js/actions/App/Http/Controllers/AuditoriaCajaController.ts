import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/cajas/auditoria/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditoriaCajaController::estadisticas
 * @see app/Http/Controllers/AuditoriaCajaController.php:214
 * @route '/api/cajas/auditoria/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/auditoria',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditoriaCajaController::index
 * @see app/Http/Controllers/AuditoriaCajaController.php:37
 * @route '/cajas/admin/auditoria'
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
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
export const alertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})

alertas.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/auditoria/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
alertas.url = (options?: RouteQueryOptions) => {
    return alertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
alertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
alertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
    const alertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
        alertasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditoriaCajaController::alertas
 * @see app/Http/Controllers/AuditoriaCajaController.php:176
 * @route '/cajas/admin/auditoria/alertas'
 */
        alertasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alertas.form = alertasForm
/**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/auditoria/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditoriaCajaController::show
 * @see app/Http/Controllers/AuditoriaCajaController.php:162
 * @route '/cajas/admin/auditoria/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
export const exportar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportar.url(options),
    method: 'get',
})

exportar.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/auditoria/exportar/csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
exportar.url = (options?: RouteQueryOptions) => {
    return exportar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
exportar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
exportar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
    const exportarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
        exportarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditoriaCajaController::exportar
 * @see app/Http/Controllers/AuditoriaCajaController.php:263
 * @route '/cajas/admin/auditoria/exportar/csv'
 */
        exportarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportar.form = exportarForm
const AuditoriaCajaController = { estadisticas, index, alertas, show, exportar }

export default AuditoriaCajaController