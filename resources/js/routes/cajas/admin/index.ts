import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import reportesDiarios from './reportes-diarios'
import cajas from './cajas'
import gastos from './gastos'
import auditoria from './auditoria'
/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:853
 * @route '/cajas/admin/dashboard'
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
* @see \App\Http\Controllers\CajaController::cierreDiario
 * @see app/Http/Controllers/CajaController.php:1380
 * @route '/cajas/admin/cierre-diario'
 */
export const cierreDiario = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiario.url(options),
    method: 'post',
})

cierreDiario.definition = {
    methods: ["post"],
    url: '/cajas/admin/cierre-diario',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cierreDiario
 * @see app/Http/Controllers/CajaController.php:1380
 * @route '/cajas/admin/cierre-diario'
 */
cierreDiario.url = (options?: RouteQueryOptions) => {
    return cierreDiario.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cierreDiario
 * @see app/Http/Controllers/CajaController.php:1380
 * @route '/cajas/admin/cierre-diario'
 */
cierreDiario.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiario.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::cierreDiario
 * @see app/Http/Controllers/CajaController.php:1380
 * @route '/cajas/admin/cierre-diario'
 */
    const cierreDiarioForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cierreDiario.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::cierreDiario
 * @see app/Http/Controllers/CajaController.php:1380
 * @route '/cajas/admin/cierre-diario'
 */
        cierreDiarioForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cierreDiario.url(options),
            method: 'post',
        })
    
    cierreDiario.form = cierreDiarioForm
/**
* @see \App\Http\Controllers\CajaController::cierreDiarioJson
 * @see app/Http/Controllers/CajaController.php:1200
 * @route '/cajas/admin/cierre-diario-json'
 */
export const cierreDiarioJson = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioJson.url(options),
    method: 'post',
})

cierreDiarioJson.definition = {
    methods: ["post"],
    url: '/cajas/admin/cierre-diario-json',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioJson
 * @see app/Http/Controllers/CajaController.php:1200
 * @route '/cajas/admin/cierre-diario-json'
 */
cierreDiarioJson.url = (options?: RouteQueryOptions) => {
    return cierreDiarioJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioJson
 * @see app/Http/Controllers/CajaController.php:1200
 * @route '/cajas/admin/cierre-diario-json'
 */
cierreDiarioJson.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioJson.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::cierreDiarioJson
 * @see app/Http/Controllers/CajaController.php:1200
 * @route '/cajas/admin/cierre-diario-json'
 */
    const cierreDiarioJsonForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cierreDiarioJson.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::cierreDiarioJson
 * @see app/Http/Controllers/CajaController.php:1200
 * @route '/cajas/admin/cierre-diario-json'
 */
        cierreDiarioJsonForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cierreDiarioJson.url(options),
            method: 'post',
        })
    
    cierreDiarioJson.form = cierreDiarioJsonForm
/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
    const reportesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
        reportesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:998
 * @route '/cajas/admin/reportes'
 */
        reportesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportes.form = reportesForm
/**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
export const conciliacion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conciliacion.url(options),
    method: 'get',
})

conciliacion.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/conciliacion',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
conciliacion.url = (options?: RouteQueryOptions) => {
    return conciliacion.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
conciliacion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conciliacion.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
conciliacion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conciliacion.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
    const conciliacionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: conciliacion.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
        conciliacionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conciliacion.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/cajas/admin/conciliacion'
 */
        conciliacionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conciliacion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    conciliacion.form = conciliacionForm
const admin = {
    dashboard,
cierreDiario,
cierreDiarioJson,
reportesDiarios,
cajas,
reportes,
conciliacion,
gastos,
auditoria,
}

export default admin