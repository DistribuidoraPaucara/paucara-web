import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::pendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
export const pendientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendientes.url(options),
    method: 'get',
})

pendientes.definition = {
    methods: ["get","head"],
    url: '/api/admin/cierres/pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::pendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
pendientes.url = (options?: RouteQueryOptions) => {
    return pendientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::pendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
pendientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::pendientes
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:326
 * @route '/api/admin/cierres/pendientes'
 */
pendientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendientes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/admin/cierres/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::estadisticas
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:439
 * @route '/api/admin/cierres/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
export const consolidar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidar.url(args, options),
    method: 'post',
})

consolidar.definition = {
    methods: ["post"],
    url: '/api/admin/cierres/{id}/consolidar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
consolidar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return consolidar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::consolidar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:361
 * @route '/api/admin/cierres/{id}/consolidar'
 */
consolidar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
export const rechazar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/api/admin/cierres/{id}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
rechazar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rechazar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AdminCajaApiController::rechazar
 * @see app/Http/Controllers/Api/AdminCajaApiController.php:399
 * @route '/api/admin/cierres/{id}/rechazar'
 */
rechazar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})
const cierres = {
    pendientes,
estadisticas,
consolidar,
rechazar,
}

export default cierres