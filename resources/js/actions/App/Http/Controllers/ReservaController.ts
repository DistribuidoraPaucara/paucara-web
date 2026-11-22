import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reservas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservaController::index
 * @see app/Http/Controllers/ReservaController.php:18
 * @route '/reservas'
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
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
export const showPorProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPorProducto.url(args, options),
    method: 'get',
})

showPorProducto.definition = {
    methods: ["get","head"],
    url: '/reservas/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
showPorProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return showPorProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
showPorProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPorProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
showPorProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPorProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
    const showPorProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showPorProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
        showPorProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPorProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservaController::showPorProducto
 * @see app/Http/Controllers/ReservaController.php:32
 * @route '/reservas/producto/{producto}'
 */
        showPorProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPorProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showPorProducto.form = showPorProductoForm
const ReservaController = { index, showPorProducto }

export default ReservaController