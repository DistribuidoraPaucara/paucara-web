import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloSidebarController::disponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
export const disponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})

disponibles.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/permisos/disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::disponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
disponibles.url = (options?: RouteQueryOptions) => {
    return disponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::disponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
disponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::disponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
disponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disponibles.url(options),
    method: 'head',
})
const permisos = {
    disponibles,
}

export default permisos