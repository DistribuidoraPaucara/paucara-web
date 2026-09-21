import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\GeocodingController::reverse
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
export const reverse = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/api/geocoding/reverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\GeocodingController::reverse
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
reverse.url = (options?: RouteQueryOptions) => {
    return reverse.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GeocodingController::reverse
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
reverse.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\GeocodingController::reverse
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
    const reverseForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reverse.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\GeocodingController::reverse
 * @see app/Http/Controllers/Api/GeocodingController.php:25
 * @route '/api/geocoding/reverse'
 */
        reverseForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reverse.url(options),
            method: 'post',
        })
    
    reverse.form = reverseForm
const geocoding = {
    reverse,
}

export default geocoding