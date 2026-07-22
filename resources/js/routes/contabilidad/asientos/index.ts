import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/contabilidad/asientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AsientoContableController::index
 * @see app/Http/Controllers/AsientoContableController.php:15
 * @route '/contabilidad/asientos'
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
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
export const show = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/contabilidad/asientos/{asientoContable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
show.url = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asientoContable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { asientoContable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    asientoContable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asientoContable: typeof args.asientoContable === 'object'
                ? args.asientoContable.id
                : args.asientoContable,
                }

    return show.definition.url
            .replace('{asientoContable}', parsedArgs.asientoContable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
show.get = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
show.head = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
    const showForm = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
        showForm.get = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AsientoContableController::show
 * @see app/Http/Controllers/AsientoContableController.php:50
 * @route '/contabilidad/asientos/{asientoContable}'
 */
        showForm.head = (args: { asientoContable: number | { id: number } } | [asientoContable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const asientos = {
    index,
show,
}

export default asientos