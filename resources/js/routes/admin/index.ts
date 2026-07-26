import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import creditos from './creditos'
import reportesProductosDanados from './reportes-productos-danados'
import bannersPublicitarios from './banners-publicitarios'
import categoriasCliente from './categorias-cliente'
/**
 * @see [serialized-closure]:2
 * @route '/admin/image-backup'
 */
export const imageBackup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imageBackup.url(options),
    method: 'get',
})

imageBackup.definition = {
    methods: ["get","head"],
    url: '/admin/image-backup',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/admin/image-backup'
 */
imageBackup.url = (options?: RouteQueryOptions) => {
    return imageBackup.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/admin/image-backup'
 */
imageBackup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imageBackup.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/admin/image-backup'
 */
imageBackup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imageBackup.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const admin = {
    creditos,
imageBackup,
reportesProductosDanados,
bannersPublicitarios,
categoriasCliente,
dashboard,
}

export default admin