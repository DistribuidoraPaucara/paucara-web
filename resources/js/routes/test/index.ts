import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/test-csrf'
 */
export const csrf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: csrf.url(options),
    method: 'post',
})

csrf.definition = {
    methods: ["post"],
    url: '/test-csrf',
} satisfies RouteDefinition<["post"]>

/**
 * @see [serialized-closure]:2
 * @route '/test-csrf'
 */
csrf.url = (options?: RouteQueryOptions) => {
    return csrf.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/test-csrf'
 */
csrf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: csrf.url(options),
    method: 'post',
})

/**
 * @see [serialized-closure]:2
 * @route '/test-logo'
 */
export const logo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logo.url(options),
    method: 'get',
})

logo.definition = {
    methods: ["get","head"],
    url: '/test-logo',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/test-logo'
 */
logo.url = (options?: RouteQueryOptions) => {
    return logo.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/test-logo'
 */
logo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logo.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/test-logo'
 */
logo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logo.url(options),
    method: 'head',
})
const test = {
    csrf,
logo,
}

export default test