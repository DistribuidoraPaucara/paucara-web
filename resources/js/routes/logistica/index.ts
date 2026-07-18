import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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