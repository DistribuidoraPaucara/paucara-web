import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
export const page = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: page.url(options),
    method: 'get',
})

page.definition = {
    methods: ["get","head"],
    url: '/roles/templates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
page.url = (options?: RouteQueryOptions) => {
    return page.definition.url + queryParams(options)
}

/**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
page.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: page.url(options),
    method: 'get',
})
/**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
page.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: page.url(options),
    method: 'head',
})

    /**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
    const pageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: page.url(options),
        method: 'get',
    })

            /**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
        pageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: page.url(options),
            method: 'get',
        })
            /**
 * @see routes/roles.php:13
 * @route '/roles/templates'
 */
        pageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: page.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    page.form = pageForm