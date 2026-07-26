import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ConfiguracionSitioController::index
 * @see app/Http/Controllers/ConfiguracionSitioController.php:14
 * @route '/configuracion-sitio'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/configuracion-sitio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::index
 * @see app/Http/Controllers/ConfiguracionSitioController.php:14
 * @route '/configuracion-sitio'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::index
 * @see app/Http/Controllers/ConfiguracionSitioController.php:14
 * @route '/configuracion-sitio'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConfiguracionSitioController::index
 * @see app/Http/Controllers/ConfiguracionSitioController.php:14
 * @route '/configuracion-sitio'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::edit
 * @see app/Http/Controllers/ConfiguracionSitioController.php:21
 * @route '/configuracion-sitio/editar'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/configuracion-sitio/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::edit
 * @see app/Http/Controllers/ConfiguracionSitioController.php:21
 * @route '/configuracion-sitio/editar'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::edit
 * @see app/Http/Controllers/ConfiguracionSitioController.php:21
 * @route '/configuracion-sitio/editar'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConfiguracionSitioController::edit
 * @see app/Http/Controllers/ConfiguracionSitioController.php:21
 * @route '/configuracion-sitio/editar'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::update
 * @see app/Http/Controllers/ConfiguracionSitioController.php:28
 * @route '/configuracion-sitio'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/configuracion-sitio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::update
 * @see app/Http/Controllers/ConfiguracionSitioController.php:28
 * @route '/configuracion-sitio'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionSitioController::update
 * @see app/Http/Controllers/ConfiguracionSitioController.php:28
 * @route '/configuracion-sitio'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const ConfiguracionSitioController = { index, edit, update }

export default ConfiguracionSitioController