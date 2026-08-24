import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
export const get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/api/ventas/clientes/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
get.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return get.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
get.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
get.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
    const getForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: get.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
        getForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::get
 * @see app/Http/Controllers/VentaController.php:3081
 * @route '/api/ventas/clientes/{id}'
 */
        getForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    get.form = getForm
const clientes = {
    get,
}

export default clientes