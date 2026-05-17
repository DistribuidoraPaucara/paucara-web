import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
export const imprimir = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimir.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return imprimir.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimir.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
imprimir.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
    const imprimirForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
        imprimirForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::imprimir
 * @see app/Http/Controllers/ClienteController.php:2063
 * @route '/api/clientes/{cliente}/credito/imprimir'
 */
        imprimirForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
export const preview = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/clientes/{cliente}/credito/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
preview.url = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cliente: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cliente: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cliente: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cliente: typeof args.cliente === 'object'
                ? args.cliente.id
                : args.cliente,
                }

    return preview.definition.url
            .replace('{cliente}', parsedArgs.cliente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
preview.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
preview.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
    const previewForm = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
        previewForm.get = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClienteController::preview
 * @see app/Http/Controllers/ClienteController.php:2142
 * @route '/api/clientes/{cliente}/credito/preview'
 */
        previewForm.head = (args: { cliente: number | { id: number } } | [cliente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const credito = {
    imprimir,
preview,
}

export default credito