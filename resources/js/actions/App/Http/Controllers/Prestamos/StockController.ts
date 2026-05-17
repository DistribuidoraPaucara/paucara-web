import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
    const stockForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stock.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
        stockForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::stock
 * @see app/Http/Controllers/Prestamos/StockController.php:16
 * @route '/prestamos/stock'
 */
        stockForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stock.form = stockForm
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
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
    const stockClientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockClientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
        stockClientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockClientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::stockClientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
        stockClientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockClientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockClientes.form = stockClientesForm
/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
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
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.url = (options?: RouteQueryOptions) => {
    return stockProveedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProveedores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
stockProveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockProveedores.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
    const stockProveedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockProveedores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
        stockProveedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProveedores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::stockProveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
        stockProveedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProveedores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockProveedores.form = stockProveedoresForm
const StockController = { stock, stockClientes, stockProveedores }

export default StockController