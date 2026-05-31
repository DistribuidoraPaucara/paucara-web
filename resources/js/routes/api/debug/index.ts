import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import logs from './logs'
/**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
export const logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/api/debug/logs',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
logs.url = (options?: RouteQueryOptions) => {
    return logs.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
    const logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: logs.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
        logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:1368
 * @route '/api/debug/logs'
 */
        logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    logs.form = logsForm
const debug = {
    logs,
}

export default debug