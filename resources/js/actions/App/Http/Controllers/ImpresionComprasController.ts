import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/compras/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
    const imprimirForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
        imprimirForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimir
 * @see app/Http/Controllers/ImpresionComprasController.php:61
 * @route '/compras/imprimir'
 */
        imprimirForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
export const imprimirIndividual = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirIndividual.url(args, options),
    method: 'get',
})

imprimirIndividual.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
imprimirIndividual.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return imprimirIndividual.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
imprimirIndividual.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirIndividual.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
imprimirIndividual.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirIndividual.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
    const imprimirIndividualForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirIndividual.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
        imprimirIndividualForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirIndividual.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionComprasController::imprimirIndividual
 * @see app/Http/Controllers/ImpresionComprasController.php:18
 * @route '/compras/{compra}/imprimir'
 */
        imprimirIndividualForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirIndividual.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirIndividual.form = imprimirIndividualForm
const ImpresionComprasController = { imprimir, imprimirIndividual }

export default ImpresionComprasController