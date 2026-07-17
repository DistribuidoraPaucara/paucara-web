import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/api/entregas/lote/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::crear
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crear.url(options),
    method: 'post',
})

crear.definition = {
    methods: ["post"],
    url: '/api/entregas/lote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::crear
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::crear
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
crear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crear.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
export const optimizar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: optimizar.url(options),
    method: 'post',
})

optimizar.definition = {
    methods: ["post"],
    url: '/api/entregas/lote/optimizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
optimizar.url = (options?: RouteQueryOptions) => {
    return optimizar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
optimizar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: optimizar.url(options),
    method: 'post',
})
const lote = {
    preview,
crear,
optimizar,
}

export default lote