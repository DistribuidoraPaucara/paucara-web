import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
export const imprimir = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos/{pago}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimir.url = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return imprimir.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimir.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
imprimir.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
    const imprimirForm = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
        imprimirForm.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2203
 * @route '/api/clientes/{cliente}/pagos/{pago}/imprimir'
 */
        imprimirForm.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
export const preview = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/pagos/{pago}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
preview.url = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                    pago: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                                pago: typeof args.pago === 'object'
                ? args.pago.id
                : args.pago,
                }

    return preview.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
preview.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
preview.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
    const previewForm = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
        previewForm.get = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2322
 * @route '/api/clientes/{cliente}/pagos/{pago}/preview'
 */
        previewForm.head = (args: { cliente: number | { id: number }, pago: number | { id: number } } | [cliente: number | { id: number }, pago: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const pago = {
    imprimir,
preview,
}

export default pago