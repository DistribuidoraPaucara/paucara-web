import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
export const estadoGeneral = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadoGeneral.url(options),
    method: 'get',
})

estadoGeneral.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/estado-general',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
estadoGeneral.url = (options?: RouteQueryOptions) => {
    return estadoGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
estadoGeneral.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadoGeneral.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
estadoGeneral.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadoGeneral.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
    const estadoGeneralForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadoGeneral.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
        estadoGeneralForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadoGeneral.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadoGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:38
 * @route '/api/admin/cajas/estado-general'
 */
        estadoGeneralForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadoGeneral.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadoGeneral.form = estadoGeneralForm
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
export const alertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})

alertas.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
alertas.url = (options?: RouteQueryOptions) => {
    return alertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
alertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
alertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alertas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
    const alertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alertas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
        alertasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alertas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::alertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
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
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:130
 * @route '/api/admin/cajas/estadisticas'
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
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
export const detalle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})

detalle.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/{id}/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalle.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalle.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
    const detalleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
        detalleForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalle
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
        detalleForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalle.form = detalleForm
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiario
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
export const cierreDiario = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiario.url(options),
    method: 'post',
})

cierreDiario.definition = {
    methods: ["post"],
    url: '/api/admin/cajas/cierre-diario',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiario
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
cierreDiario.url = (options?: RouteQueryOptions) => {
    return cierreDiario.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiario
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
cierreDiario.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiario.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiario
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
    const cierreDiarioForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cierreDiario.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiario
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
        cierreDiarioForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cierreDiario.url(options),
            method: 'post',
        })
    
    cierreDiario.form = cierreDiarioForm
const cajas = {
    estadoGeneral,
alertas,
estadisticas,
detalle,
cierreDiario,
}

export default cajas