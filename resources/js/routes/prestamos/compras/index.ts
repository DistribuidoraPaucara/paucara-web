import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras'
 */
export const listado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listado.url(options),
    method: 'get',
})

listado.definition = {
    methods: ["get","head"],
    url: '/prestamos/compras',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras'
 */
listado.url = (options?: RouteQueryOptions) => {
    return listado.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras'
 */
listado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listado.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras'
 */
listado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listado.url(options),
    method: 'head',
})

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/prestamos/compras/crear',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/compras/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:85
 * @route '/prestamos/compras/{compra}'
 */
export const show = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/prestamos/compras/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:85
 * @route '/prestamos/compras/{compra}'
 */
show.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:85
 * @route '/prestamos/compras/{compra}'
 */
show.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraPrestableController::show
 * @see app/Http/Controllers/CompraPrestableController.php:85
 * @route '/prestamos/compras/{compra}'
 */
show.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const compras = {
    listado,
crear,
show,
}

export default compras