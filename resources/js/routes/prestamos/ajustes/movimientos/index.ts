import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
 * @see routes/web.php:866
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
export const clientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})

clientes.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:866
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.url = (options?: RouteQueryOptions) => {
    return clientes.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:866
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:866
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientes.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:867
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
export const proveedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})

proveedores.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:867
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.url = (options?: RouteQueryOptions) => {
    return proveedores.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:867
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:867
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedores.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:868
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
export const eventos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})

eventos.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/eventos',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:868
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.url = (options?: RouteQueryOptions) => {
    return eventos.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:868
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:868
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventos.url(options),
    method: 'head',
})
const movimientos = {
    clientes,
proveedores,
eventos,
}

export default movimientos