import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:417
 * @route '/ventas-comidas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ventas-comidas',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:417
 * @route '/ventas-comidas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:417
 * @route '/ventas-comidas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:417
 * @route '/ventas-comidas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const ventasComidas = {
    index,
}

export default ventasComidas