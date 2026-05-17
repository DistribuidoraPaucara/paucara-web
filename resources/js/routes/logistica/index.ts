import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import envios from './envios'
import entregas from './entregas'
import reportes from './reportes'
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/logistica/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::estadisticas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:178
 * @route '/api/logistica/estadisticas'
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
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
export const resincronizar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resincronizar.url(options),
    method: 'post',
})

resincronizar.definition = {
    methods: ["post"],
    url: '/api/logistica/resincronizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
resincronizar.url = (options?: RouteQueryOptions) => {
    return resincronizar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
resincronizar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resincronizar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
    const resincronizarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resincronizar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::resincronizar
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:210
 * @route '/api/logistica/resincronizar'
 */
        resincronizarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resincronizar.url(options),
            method: 'post',
        })
    
    resincronizar.form = resincronizarForm
/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/logistica/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\LogisticaController::dashboard
 * @see app/Http/Controllers/Web/LogisticaController.php:18
 * @route '/logistica/dashboard'
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
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
export const proformasPendientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proformasPendientes.url(options),
    method: 'get',
})

proformasPendientes.definition = {
    methods: ["get","head"],
    url: '/logistica/proformas-pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
proformasPendientes.url = (options?: RouteQueryOptions) => {
    return proformasPendientes.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
proformasPendientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proformasPendientes.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
proformasPendientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proformasPendientes.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
    const proformasPendientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proformasPendientes.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
        proformasPendientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proformasPendientes.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/logistica/proformas-pendientes'
 */
        proformasPendientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proformasPendientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proformasPendientes.form = proformasPendientesForm
const logistica = {
    estadisticas,
resincronizar,
dashboard,
proformasPendientes,
envios,
entregas,
reportes,
}

export default logistica