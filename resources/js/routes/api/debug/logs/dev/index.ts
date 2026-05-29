import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
 * @see routes/api.php:1448
 * @route '/api/debug/logs/dev/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/api/debug/logs/dev/clear',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/api.php:1448
 * @route '/api/debug/logs/dev/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:1448
 * @route '/api/debug/logs/dev/clear'
 */
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

    /**
 * @see routes/api.php:1448
 * @route '/api/debug/logs/dev/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url(options),
        method: 'post',
    })

            /**
 * @see routes/api.php:1448
 * @route '/api/debug/logs/dev/clear'
 */
        clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url(options),
            method: 'post',
        })
    
    clear.form = clearForm
const dev = {
    clear,
}

export default dev