import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/api/debug/logs/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/api/debug/logs/clear',
} satisfies RouteDefinition<["post"]>

/**
 * @see [serialized-closure]:2
 * @route '/api/debug/logs/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/api/debug/logs/clear'
 */
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})
const logs = {
    clear,
}

export default logs