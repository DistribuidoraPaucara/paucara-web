import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
export const index = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return index.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
export const create = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/detalles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return create.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
export const store = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/detalles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
store.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return store.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
store.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})
const detalles = {
    index,
create,
store,
}

export default detalles