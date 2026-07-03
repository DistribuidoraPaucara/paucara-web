import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
const ApiPoliticaPagoController = { index, disponibles }

export default ApiPoliticaPagoController