import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
export const stockDisponible = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockDisponible.url(options),
    method: 'get',
})

stockDisponible.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/api/stock-disponible',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
stockDisponible.url = (options?: RouteQueryOptions) => {
    return stockDisponible.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
stockDisponible.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockDisponible.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
stockDisponible.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockDisponible.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
    const stockDisponibleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockDisponible.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
        stockDisponibleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockDisponible.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservaStockController::stockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
        stockDisponibleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockDisponible.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockDisponible.form = stockDisponibleForm
/**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
export const reservasPorProducto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reservasPorProducto.url(options),
    method: 'get',
})

reservasPorProducto.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/api/reservas-por-producto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
reservasPorProducto.url = (options?: RouteQueryOptions) => {
    return reservasPorProducto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
reservasPorProducto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reservasPorProducto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
reservasPorProducto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reservasPorProducto.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
    const reservasPorProductoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reservasPorProducto.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
        reservasPorProductoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reservasPorProducto.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservaStockController::reservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
        reservasPorProductoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reservasPorProducto.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reservasPorProducto.form = reservasPorProductoForm
/**
* @see \App\Http\Controllers\ReservaStockController::liberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
export const liberarVencidas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberarVencidas.url(options),
    method: 'post',
})

liberarVencidas.definition = {
    methods: ["post"],
    url: '/inventario/reservas/api/liberar-vencidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservaStockController::liberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
liberarVencidas.url = (options?: RouteQueryOptions) => {
    return liberarVencidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::liberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
liberarVencidas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberarVencidas.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReservaStockController::liberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
    const liberarVencidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: liberarVencidas.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReservaStockController::liberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
        liberarVencidasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: liberarVencidas.url(options),
            method: 'post',
        })
    
    liberarVencidas.form = liberarVencidasForm
const api = {
    stockDisponible,
reservasPorProducto,
liberarVencidas,
}

export default api