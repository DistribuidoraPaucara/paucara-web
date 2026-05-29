import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
import dev from './dev'
/**
 * @see routes/api.php:1378
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
 * @see routes/api.php:1378
 * @route '/api/debug/logs/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:1378
 * @route '/api/debug/logs/clear'
 */
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

    /**
 * @see routes/api.php:1378
 * @route '/api/debug/logs/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url(options),
        method: 'post',
    })

            /**
 * @see routes/api.php:1378
 * @route '/api/debug/logs/clear'
 */
        clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url(options),
            method: 'post',
        })
    
    clear.form = clearForm
/**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
export const dev = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dev.url(options),
    method: 'get',
})

dev.definition = {
    methods: ["get","head"],
    url: '/api/debug/logs/dev',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
dev.url = (options?: RouteQueryOptions) => {
    return dev.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
dev.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dev.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
dev.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dev.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
    const devForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dev.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
        devForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dev.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:1413
 * @route '/api/debug/logs/dev'
 */
        devForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dev.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dev.form = devForm
const logs = {
    clear,
dev,
}

export default logs