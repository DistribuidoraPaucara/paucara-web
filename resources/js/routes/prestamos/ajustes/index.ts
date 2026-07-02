import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import movimientos from './movimientos'
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/historial',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})
const ajustes = {
    historial,
movimientos,
}

export default ajustes