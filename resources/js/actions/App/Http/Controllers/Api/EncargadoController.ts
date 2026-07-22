import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard'
 */
const dashboardf1e2d93ec6437123741988cc59b4615f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardf1e2d93ec6437123741988cc59b4615f.url(options),
    method: 'get',
})

dashboardf1e2d93ec6437123741988cc59b4615f.definition = {
    methods: ["get","head"],
    url: '/api/encargado/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard'
 */
dashboardf1e2d93ec6437123741988cc59b4615f.url = (options?: RouteQueryOptions) => {
    return dashboardf1e2d93ec6437123741988cc59b4615f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard'
 */
dashboardf1e2d93ec6437123741988cc59b4615f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardf1e2d93ec6437123741988cc59b4615f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard'
 */
dashboardf1e2d93ec6437123741988cc59b4615f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardf1e2d93ec6437123741988cc59b4615f.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard/stats'
 */
const dashboard41c3b76b10db8984949bf0fd16d8e3e3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard41c3b76b10db8984949bf0fd16d8e3e3.url(options),
    method: 'get',
})

dashboard41c3b76b10db8984949bf0fd16d8e3e3.definition = {
    methods: ["get","head"],
    url: '/api/encargado/dashboard/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard/stats'
 */
dashboard41c3b76b10db8984949bf0fd16d8e3e3.url = (options?: RouteQueryOptions) => {
    return dashboard41c3b76b10db8984949bf0fd16d8e3e3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard/stats'
 */
dashboard41c3b76b10db8984949bf0fd16d8e3e3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard41c3b76b10db8984949bf0fd16d8e3e3.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EncargadoController::dashboard
 * @see app/Http/Controllers/Api/EncargadoController.php:18
 * @route '/api/encargado/dashboard/stats'
 */
dashboard41c3b76b10db8984949bf0fd16d8e3e3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard41c3b76b10db8984949bf0fd16d8e3e3.url(options),
    method: 'head',
})

export const dashboard = {
    '/api/encargado/dashboard': dashboardf1e2d93ec6437123741988cc59b4615f,
    '/api/encargado/dashboard/stats': dashboard41c3b76b10db8984949bf0fd16d8e3e3,
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasAsignadas
 * @see app/Http/Controllers/Api/EncargadoController.php:176
 * @route '/api/encargado/entregas/asignadas'
 */
export const entregasAsignadas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasAsignadas.url(options),
    method: 'get',
})

entregasAsignadas.definition = {
    methods: ["get","head"],
    url: '/api/encargado/entregas/asignadas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasAsignadas
 * @see app/Http/Controllers/Api/EncargadoController.php:176
 * @route '/api/encargado/entregas/asignadas'
 */
entregasAsignadas.url = (options?: RouteQueryOptions) => {
    return entregasAsignadas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasAsignadas
 * @see app/Http/Controllers/Api/EncargadoController.php:176
 * @route '/api/encargado/entregas/asignadas'
 */
entregasAsignadas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasAsignadas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasAsignadas
 * @see app/Http/Controllers/Api/EncargadoController.php:176
 * @route '/api/encargado/entregas/asignadas'
 */
entregasAsignadas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasAsignadas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EncargadoController::procesarCargaVehiculo
 * @see app/Http/Controllers/Api/EncargadoController.php:217
 * @route '/api/encargado/entregas/{id}/procesar-carga'
 */
export const procesarCargaVehiculo = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCargaVehiculo.url(args, options),
    method: 'post',
})

procesarCargaVehiculo.definition = {
    methods: ["post"],
    url: '/api/encargado/entregas/{id}/procesar-carga',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::procesarCargaVehiculo
 * @see app/Http/Controllers/Api/EncargadoController.php:217
 * @route '/api/encargado/entregas/{id}/procesar-carga'
 */
procesarCargaVehiculo.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return procesarCargaVehiculo.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::procesarCargaVehiculo
 * @see app/Http/Controllers/Api/EncargadoController.php:217
 * @route '/api/encargado/entregas/{id}/procesar-carga'
 */
procesarCargaVehiculo.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarCargaVehiculo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EncargadoController::indexAdmin
 * @see app/Http/Controllers/Api/EncargadoController.php:270
 * @route '/api/encargado/entregas'
 */
export const indexAdmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexAdmin.url(options),
    method: 'get',
})

indexAdmin.definition = {
    methods: ["get","head"],
    url: '/api/encargado/entregas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::indexAdmin
 * @see app/Http/Controllers/Api/EncargadoController.php:270
 * @route '/api/encargado/entregas'
 */
indexAdmin.url = (options?: RouteQueryOptions) => {
    return indexAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::indexAdmin
 * @see app/Http/Controllers/Api/EncargadoController.php:270
 * @route '/api/encargado/entregas'
 */
indexAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EncargadoController::indexAdmin
 * @see app/Http/Controllers/Api/EncargadoController.php:270
 * @route '/api/encargado/entregas'
 */
indexAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexAdmin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EncargadoController::asignarEntrega
 * @see app/Http/Controllers/Api/EncargadoController.php:318
 * @route '/api/encargado/entregas/{id}/asignar'
 */
export const asignarEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: asignarEntrega.url(args, options),
    method: 'post',
})

asignarEntrega.definition = {
    methods: ["post"],
    url: '/api/encargado/entregas/{id}/asignar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::asignarEntrega
 * @see app/Http/Controllers/Api/EncargadoController.php:318
 * @route '/api/encargado/entregas/{id}/asignar'
 */
asignarEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return asignarEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::asignarEntrega
 * @see app/Http/Controllers/Api/EncargadoController.php:318
 * @route '/api/encargado/entregas/{id}/asignar'
 */
asignarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: asignarEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasActivas
 * @see app/Http/Controllers/Api/EncargadoController.php:367
 * @route '/api/encargado/entregas/activas'
 */
export const entregasActivas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasActivas.url(options),
    method: 'get',
})

entregasActivas.definition = {
    methods: ["get","head"],
    url: '/api/encargado/entregas/activas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasActivas
 * @see app/Http/Controllers/Api/EncargadoController.php:367
 * @route '/api/encargado/entregas/activas'
 */
entregasActivas.url = (options?: RouteQueryOptions) => {
    return entregasActivas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasActivas
 * @see app/Http/Controllers/Api/EncargadoController.php:367
 * @route '/api/encargado/entregas/activas'
 */
entregasActivas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasActivas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EncargadoController::entregasActivas
 * @see app/Http/Controllers/Api/EncargadoController.php:367
 * @route '/api/encargado/entregas/activas'
 */
entregasActivas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasActivas.url(options),
    method: 'head',
})
const EncargadoController = { dashboard, entregasAsignadas, procesarCargaVehiculo, indexAdmin, asignarEntrega, entregasActivas }

export default EncargadoController