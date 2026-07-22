import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/cuentas-por-cobrar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
    const indexApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
        indexApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::indexApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
        indexApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexApi.form = indexApiForm
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
export const showApi = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/cuentas-por-cobrar/{cuentaPorCobrar}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
showApi.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cuentaPorCobrar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cuentaPorCobrar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cuentaPorCobrar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cuentaPorCobrar: typeof args.cuentaPorCobrar === 'object'
                ? args.cuentaPorCobrar.id
                : args.cuentaPorCobrar,
                }

    return showApi.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
showApi.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
showApi.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
    const showApiForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showApi.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
        showApiForm.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::showApi
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
        showApiForm.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showApi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showApi.form = showApiForm
const CuentaPorCobrarController = { indexApi, showApi }

export default CuentaPorCobrarController