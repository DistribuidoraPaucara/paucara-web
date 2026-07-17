import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\GeocodingController::reverseGeocode
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
export const reverseGeocode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverseGeocode.url(options),
    method: 'post',
})

reverseGeocode.definition = {
    methods: ["post"],
    url: '/api/geocoding/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\GeocodingController::reverseGeocode
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
reverseGeocode.url = (options?: RouteQueryOptions) => {
    return reverseGeocode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GeocodingController::reverseGeocode
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
reverseGeocode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverseGeocode.url(options),
    method: 'post',
})
const GeocodingController = { reverseGeocode }

export default GeocodingController