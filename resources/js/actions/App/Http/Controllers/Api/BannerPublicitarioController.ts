import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\BannerPublicitarioController::index
 * @see app/Http/Controllers/Api/BannerPublicitarioController.php:14
 * @route '/api/banners-publicitarios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/banners-publicitarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\BannerPublicitarioController::index
 * @see app/Http/Controllers/Api/BannerPublicitarioController.php:14
 * @route '/api/banners-publicitarios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\BannerPublicitarioController::index
 * @see app/Http/Controllers/Api/BannerPublicitarioController.php:14
 * @route '/api/banners-publicitarios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\BannerPublicitarioController::index
 * @see app/Http/Controllers/Api/BannerPublicitarioController.php:14
 * @route '/api/banners-publicitarios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const BannerPublicitarioController = { index }

export default BannerPublicitarioController