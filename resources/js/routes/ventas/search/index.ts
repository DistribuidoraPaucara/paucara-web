import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
export const clientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})

clientes.definition = {
    methods: ["get","head"],
    url: '/api/ventas/search/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
clientes.url = (options?: RouteQueryOptions) => {
    return clientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
clientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
clientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
    const clientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
        clientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::clientes
 * @see app/Http/Controllers/VentaController.php:3013
 * @route '/api/ventas/search/clientes'
 */
        clientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clientes.form = clientesForm
/**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
export const usuarios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usuarios.url(options),
    method: 'get',
})

usuarios.definition = {
    methods: ["get","head"],
    url: '/api/ventas/search/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
usuarios.url = (options?: RouteQueryOptions) => {
    return usuarios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
usuarios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usuarios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
usuarios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usuarios.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
    const usuariosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: usuarios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
        usuariosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usuarios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::usuarios
 * @see app/Http/Controllers/VentaController.php:3133
 * @route '/api/ventas/search/usuarios'
 */
        usuariosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usuarios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    usuarios.form = usuariosForm
const search = {
    clientes,
usuarios,
}

export default search