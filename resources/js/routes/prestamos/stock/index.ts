import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
 * @see app/Http/Controllers/Prestamos/StockController.php:145
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
 * @see app/Http/Controllers/Prestamos/StockController.php:145
 * @route '/prestamos/stock/proveedores'
 */
proveedores.url = (options?: RouteQueryOptions) => {
    return proveedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:145
 * @route '/prestamos/stock/proveedores'
 */
proveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:145
 * @route '/prestamos/stock/proveedores'
 */
proveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedores.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:145
 * @route '/prestamos/stock/proveedores'
 */
    const proveedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:145
 * @route '/prestamos/stock/proveedores'
 */
        proveedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::proveedores
 * @see app/Http/Controllers/Prestamos/StockController.php:145
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
/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:198
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
 * @see app/Http/Controllers/Prestamos/StockController.php:198
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
 * @see app/Http/Controllers/Prestamos/StockController.php:198
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
ajuste.get = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajuste.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:198
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
ajuste.head = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ajuste.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:198
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
    const ajusteForm = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ajuste.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:198
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
        ajusteForm.get = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajuste.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Prestamos\StockController::ajuste
 * @see app/Http/Controllers/Prestamos/StockController.php:198
 * @route '/prestamos/stock/{tipo}/ajuste/{prestable_id}/{almacen_id}'
 */
        ajusteForm.head = (args: { tipo: string | number, prestable_id: string | number, almacen_id: string | number } | [tipo: string | number, prestable_id: string | number, almacen_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajuste.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ajuste.form = ajusteForm
const stock = {
    clientes,
proveedores,
ajuste,
}

export default stock