import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
export const capacidad = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidad.url(args, options),
    method: 'get',
})

capacidad.definition = {
    methods: ["get","head"],
    url: '/api/combos/{combo}/capacidad',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
capacidad.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return capacidad.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
capacidad.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidad.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
capacidad.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: capacidad.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
    const capacidadForm = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: capacidad.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
        capacidadForm.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: capacidad.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/api/combos/{combo}/capacidad'
 */
        capacidadForm.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: capacidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    capacidad.form = capacidadForm
/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
export const capacidadDetalles = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'get',
})

capacidadDetalles.definition = {
    methods: ["get","head"],
    url: '/api/combos/{combo}/capacidad-detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return capacidadDetalles.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
    const capacidadDetallesForm = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: capacidadDetalles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
        capacidadDetallesForm.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: capacidadDetalles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/api/combos/{combo}/capacidad-detalles'
 */
        capacidadDetallesForm.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: capacidadDetalles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    capacidadDetalles.form = capacidadDetallesForm
const combos = {
    capacidad,
capacidadDetalles,
}

export default combos