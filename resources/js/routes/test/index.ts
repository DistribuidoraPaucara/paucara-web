import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:17
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
 * @see routes/web.php:17
 * @route '/test-csrf'
 */
csrf.url = (options?: RouteQueryOptions) => {
    return csrf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:17
 * @route '/test-csrf'
 */
csrf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: csrf.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:17
 * @route '/test-csrf'
 */
    const csrfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: csrf.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:17
 * @route '/test-csrf'
 */
        csrfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: csrf.url(options),
            method: 'post',
        })
    
    csrf.form = csrfForm
/**
 * @see routes/web.php:22
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
 * @see routes/web.php:22
 * @route '/test-logo'
 */
logo.url = (options?: RouteQueryOptions) => {
    return logo.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:22
 * @route '/test-logo'
 */
logo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logo.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:22
 * @route '/test-logo'
 */
logo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logo.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:22
 * @route '/test-logo'
 */
    const logoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: logo.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:22
 * @route '/test-logo'
 */
        logoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logo.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:22
 * @route '/test-logo'
 */
        logoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    logo.form = logoForm
const test = {
    csrf,
logo,
}

export default test