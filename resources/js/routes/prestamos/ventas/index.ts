import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see routes/web.php:869
 * @route '/prestamos/ventas'
 */
export const listado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listado.url(options),
    method: 'get',
})

listado.definition = {
    methods: ["get","head"],
    url: '/prestamos/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:869
 * @route '/prestamos/ventas'
 */
listado.url = (options?: RouteQueryOptions) => {
    return listado.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:869
 * @route '/prestamos/ventas'
 */
listado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listado.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:869
 * @route '/prestamos/ventas'
 */
listado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listado.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:870
 * @route '/prestamos/ventas/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/prestamos/ventas/crear',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:870
 * @route '/prestamos/ventas/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:870
 * @route '/prestamos/ventas/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:870
 * @route '/prestamos/ventas/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
export const show = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/prestamos/ventas/{venta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
show.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return show.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
show.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoVendidoController::show
 * @see app/Http/Controllers/PrestamoVendidoController.php:78
 * @route '/prestamos/ventas/{venta}'
 */
show.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const ventas = {
    listado,
crear,
show,
}

export default ventas