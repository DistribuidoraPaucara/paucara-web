import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestableStockController::show
 * @see app/Http/Controllers/PrestableStockController.php:17
 * @route '/api/prestables/{prestable}/stock/detalle'
 */
export const show = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestables/{prestable}/stock/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestableStockController::show
 * @see app/Http/Controllers/PrestableStockController.php:17
 * @route '/api/prestables/{prestable}/stock/detalle'
 */
show.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return show.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableStockController::show
 * @see app/Http/Controllers/PrestableStockController.php:17
 * @route '/api/prestables/{prestable}/stock/detalle'
 */
show.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestableStockController::show
 * @see app/Http/Controllers/PrestableStockController.php:17
 * @route '/api/prestables/{prestable}/stock/detalle'
 */
show.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestableStockController::agregarAlmacen
 * @see app/Http/Controllers/PrestableStockController.php:94
 * @route '/api/prestables/{prestable}/stock/agregar-almacen'
 */
export const agregarAlmacen = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarAlmacen.url(args, options),
    method: 'post',
})

agregarAlmacen.definition = {
    methods: ["post"],
    url: '/api/prestables/{prestable}/stock/agregar-almacen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestableStockController::agregarAlmacen
 * @see app/Http/Controllers/PrestableStockController.php:94
 * @route '/api/prestables/{prestable}/stock/agregar-almacen'
 */
agregarAlmacen.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return agregarAlmacen.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableStockController::agregarAlmacen
 * @see app/Http/Controllers/PrestableStockController.php:94
 * @route '/api/prestables/{prestable}/stock/agregar-almacen'
 */
agregarAlmacen.post = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: agregarAlmacen.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestableStockController::update
 * @see app/Http/Controllers/PrestableStockController.php:63
 * @route '/api/prestables-stock/{prestableStock}'
 */
export const update = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/prestables-stock/{prestableStock}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrestableStockController::update
 * @see app/Http/Controllers/PrestableStockController.php:63
 * @route '/api/prestables-stock/{prestableStock}'
 */
update.url = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestableStock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestableStock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestableStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestableStock: typeof args.prestableStock === 'object'
                ? args.prestableStock.id
                : args.prestableStock,
                }

    return update.definition.url
            .replace('{prestableStock}', parsedArgs.prestableStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableStockController::update
 * @see app/Http/Controllers/PrestableStockController.php:63
 * @route '/api/prestables-stock/{prestableStock}'
 */
update.put = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PrestableStockController::destroy
 * @see app/Http/Controllers/PrestableStockController.php:130
 * @route '/api/prestables-stock/{prestableStock}'
 */
export const destroy = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/prestables-stock/{prestableStock}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PrestableStockController::destroy
 * @see app/Http/Controllers/PrestableStockController.php:130
 * @route '/api/prestables-stock/{prestableStock}'
 */
destroy.url = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestableStock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestableStock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestableStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestableStock: typeof args.prestableStock === 'object'
                ? args.prestableStock.id
                : args.prestableStock,
                }

    return destroy.definition.url
            .replace('{prestableStock}', parsedArgs.prestableStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestableStockController::destroy
 * @see app/Http/Controllers/PrestableStockController.php:130
 * @route '/api/prestables-stock/{prestableStock}'
 */
destroy.delete = (args: { prestableStock: number | { id: number } } | [prestableStock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const PrestableStockController = { show, agregarAlmacen, update, destroy }

export default PrestableStockController