import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/politicas-pago',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::index
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:45
 * @route '/api/politicas-pago'
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
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
export const disponibles = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(args, options),
    method: 'get',
})

disponibles.definition = {
    methods: ["get","head"],
    url: '/api/politicas-pago/disponibles/{clienteId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
disponibles.url = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clienteId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clienteId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clienteId: args.clienteId,
                }

    return disponibles.definition.url
            .replace('{clienteId}', parsedArgs.clienteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
disponibles.get = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: disponibles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
disponibles.head = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: disponibles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
    const disponiblesForm = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: disponibles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
        disponiblesForm.get = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disponibles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ApiPoliticaPagoController::disponibles
 * @see app/Http/Controllers/Api/ApiPoliticaPagoController.php:121
 * @route '/api/politicas-pago/disponibles/{clienteId}'
 */
        disponiblesForm.head = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: disponibles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    disponibles.form = disponiblesForm
const ApiPoliticaPagoController = { index, disponibles }

export default ApiPoliticaPagoController