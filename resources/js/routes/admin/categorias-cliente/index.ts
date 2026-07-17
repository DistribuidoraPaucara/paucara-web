import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
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
const categoriasCliente = {
    index,
}

export default categoriasCliente