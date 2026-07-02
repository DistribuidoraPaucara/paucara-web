import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
export const stock = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(options),
    method: 'get',
})

stock.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.url = (options?: RouteQueryOptions) => {
    return stock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
stock.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stock.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
export const stockClientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockClientes.url(options),
    method: 'get',
})

stockClientes.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
stockClientes.url = (options?: RouteQueryOptions) => {
    return stockClientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
stockClientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockClientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
stockClientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockClientes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockEventos
 * @see app/Http/Controllers/Prestamos/StockController.php:220
 * @route '/prestamos/stock/eventos'
 */
export const stockEventos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockEventos.url(options),
    method: 'get',
})

stockEventos.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/eventos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockEventos
 * @see app/Http/Controllers/Prestamos/StockController.php:220
 * @route '/prestamos/stock/eventos'
 */
stockEventos.url = (options?: RouteQueryOptions) => {
    return stockEventos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockEventos
 * @see app/Http/Controllers/Prestamos/StockController.php:220
 * @route '/prestamos/stock/eventos'
 */
stockEventos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockEventos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stockEventos
 * @see app/Http/Controllers/Prestamos/StockController.php:220
 * @route '/prestamos/stock/eventos'
 */
stockEventos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockEventos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:347
 * @route '/prestamos/stock/proveedores'
 */
export const stockProveedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProveedores.url(options),
    method: 'get',
})

stockProveedores.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:347
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.url = (options?: RouteQueryOptions) => {
    return stockProveedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:347
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProveedores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:347
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockProveedores.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:509
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
export const ajuste = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajuste.url(args, options),
    method: 'get',
})

ajuste.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:509
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
ajuste.url = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    tipo: args[0],
                    prestable_id: args[1],
                    almacen_id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo: args.tipo,
                                prestable_id: args.prestable_id,
                                almacen_id: args.almacen_id,
                }

    return ajuste.definition.url
            .replace('{tipo}', parsedArgs.tipo.toString())
            .replace('{prestable_id}', parsedArgs.prestable_id.toString())
            .replace('{almacen_id}', parsedArgs.almacen_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:509
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
ajuste.get = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajuste.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:509
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
ajuste.head = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ajuste.url(args, options),
    method: 'head',
})
const StockController = { stock, stockClientes, stockEventos, stockProveedores, ajuste }

export default StockController