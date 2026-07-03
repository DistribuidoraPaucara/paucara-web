import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
export const store = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/confirmaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
store.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return store.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
store.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
    const storeForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
        storeForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
export const destroy = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/ventas/{venta}/confirmaciones/{confirmacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
destroy.url = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                    confirmacion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                                confirmacion: args.confirmacion,
                }

    return destroy.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace('{confirmacion}', parsedArgs.confirmacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
destroy.delete = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
    const destroyForm = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
        destroyForm.delete = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const confirmaciones = {
    store,
destroy,
}

export default confirmaciones