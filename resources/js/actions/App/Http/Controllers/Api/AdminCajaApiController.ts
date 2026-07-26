import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\AdminCajaApiController::obtenerAlertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
export const obtenerAlertas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAlertas.url(options),
    method: 'get',
})

obtenerAlertas.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::obtenerAlertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
obtenerAlertas.url = (options?: RouteQueryOptions) => {
    return obtenerAlertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::obtenerAlertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
obtenerAlertas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerAlertas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::obtenerAlertas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:72
 * @route '/api/admin/cajas/alertas'
 */
obtenerAlertas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerAlertas.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalleCaja
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
export const detalleCaja = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleCaja.url(args, options),
    method: 'get',
})

detalleCaja.definition = {
    methods: ["get","head"],
    url: '/api/admin/cajas/{id}/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalleCaja
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalleCaja.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalleCaja.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalleCaja
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalleCaja.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleCaja.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::detalleCaja
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:199
 * @route '/api/admin/cajas/{id}/detalle'
 */
detalleCaja.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalleCaja.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiarioGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
export const cierreDiarioGeneral = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneral.url(options),
    method: 'post',
})

cierreDiarioGeneral.definition = {
    methods: ["post"],
    url: '/api/admin/cajas/cierre-diario',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiarioGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
cierreDiarioGeneral.url = (options?: RouteQueryOptions) => {
    return cierreDiarioGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierreDiarioGeneral
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:473
 * @route '/api/admin/cajas/cierre-diario'
 */
cierreDiarioGeneral.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneral.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierresPendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
export const cierresPendientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cierresPendientes.url(options),
    method: 'get',
})

cierresPendientes.definition = {
    methods: ["get","head"],
    url: '/api/admin/cierres/pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierresPendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
cierresPendientes.url = (options?: RouteQueryOptions) => {
    return cierresPendientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierresPendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
cierresPendientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cierresPendientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::cierresPendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
cierresPendientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cierresPendientes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticasCierres
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
export const estadisticasCierres = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCierres.url(options),
    method: 'get',
})

estadisticasCierres.definition = {
    methods: ["get","head"],
    url: '/api/admin/cierres/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticasCierres
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticasCierres.url = (options?: RouteQueryOptions) => {
    return estadisticasCierres.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticasCierres
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticasCierres.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCierres.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticasCierres
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticasCierres.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasCierres.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
export const consolidarCierre = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarCierre.url(args, options),
    method: 'post',
})

consolidarCierre.definition = {
    methods: ["post"],
    url: '/api/admin/cierres/{id}/consolidar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
consolidarCierre.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return consolidarCierre.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
consolidarCierre.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarCierre.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
export const rechazarCierre = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazarCierre.url(args, options),
    method: 'post',
})

rechazarCierre.definition = {
    methods: ["post"],
    url: '/api/admin/cierres/{id}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
rechazarCierre.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rechazarCierre.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazarCierre
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
rechazarCierre.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazarCierre.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumenGastos
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
export const resumenGastos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGastos.url(options),
    method: 'get',
})

resumenGastos.definition = {
    methods: ["get","head"],
    url: '/api/admin/gastos/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumenGastos
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumenGastos.url = (options?: RouteQueryOptions) => {
    return resumenGastos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumenGastos
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumenGastos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenGastos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::resumenGastos
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:283
 * @route '/api/admin/gastos/resumen'
 */
resumenGastos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumenGastos.url(options),
    method: 'head',
})
const AdminCajaApiController = { estadoGeneral, obtenerAlertas, estadisticas, detalleCaja, cierreDiarioGeneral, cierresPendientes, estadisticasCierres, consolidarCierre, rechazarCierre, resumenGastos }

export default AdminCajaApiController