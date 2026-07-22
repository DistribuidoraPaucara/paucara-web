import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import permisos from './permisos'
import matrizAcceso from './matriz-acceso'
/**
* @see \App\Http\Controllers\ModuloSidebarController::admin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
export const admin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

admin.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::admin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
admin.url = (options?: RouteQueryOptions) => {
    return admin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::admin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
admin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::admin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
admin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ModuloSidebarController::matrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
export const matrizAcceso = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matrizAcceso.url(options),
    method: 'get',
})

matrizAcceso.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/matriz-acceso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::matrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
matrizAcceso.url = (options?: RouteQueryOptions) => {
    return matrizAcceso.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::matrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
matrizAcceso.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: matrizAcceso.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::matrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
matrizAcceso.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: matrizAcceso.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ModuloSidebarController::roles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::roles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::roles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::roles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ModuloSidebarController::preview
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
export const preview = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/preview/{rolName}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::preview
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
preview.url = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { rolName: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    rolName: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        rolName: args.rolName,
                }

    return preview.definition.url
            .replace('{rolName}', parsedArgs.rolName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::preview
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
preview.get = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::preview
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
preview.head = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ModuloSidebarController::historial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::historial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::historial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::historial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})
const modulosSidebar = {
    admin,
permisos,
matrizAcceso,
roles,
preview,
historial,
}

export default modulosSidebar