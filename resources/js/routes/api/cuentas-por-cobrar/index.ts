import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/cuentas-por-cobrar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::index
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:103
 * @route '/api/cuentas-por-cobrar'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
export const show = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/cuentas-por-cobrar/{cuentaPorCobrar}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
show.url = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{cuentaPorCobrar}', parsedArgs.cuentaPorCobrar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
show.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
show.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
    const showForm = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
        showForm.get = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CuentaPorCobrarController::show
 * @see app/Http/Controllers/Api/CuentaPorCobrarController.php:20
 * @route '/api/cuentas-por-cobrar/{cuentaPorCobrar}'
 */
        showForm.head = (args: { cuentaPorCobrar: number | { id: number } } | [cuentaPorCobrar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const cuentasPorCobrar = {
    index,
show,
}

export default cuentasPorCobrar