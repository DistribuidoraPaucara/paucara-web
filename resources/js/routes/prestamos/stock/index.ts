import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
export const clientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})

clientes.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
clientes.url = (options?: RouteQueryOptions) => {
    return clientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
clientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
clientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
    const clientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
        clientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::clientes
 * @see app/Http/Controllers/Prestamos/StockController.php:83
 * @route '/prestamos/stock/clientes'
 */
        clientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clientes.form = clientesForm
/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
export const proveedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})

proveedores.definition = {
    methods: ["get","head"],
    url: '/prestamos/stock/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
proveedores.url = (options?: RouteQueryOptions) => {
    return proveedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
proveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
proveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedores.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
    const proveedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
        proveedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:153
 * @route '/prestamos/stock/proveedores'
 */
        proveedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proveedores.form = proveedoresForm
const stock = {
    clientes,
proveedores,
}

export default stock