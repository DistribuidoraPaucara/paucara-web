import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/categorias-cliente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CategoriaClienteController::index
 * @see app/Http/Controllers/CategoriaClienteController.php:18
 * @route '/admin/categorias-cliente'
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
const categoriasCliente = {
    index,
}

export default categoriasCliente