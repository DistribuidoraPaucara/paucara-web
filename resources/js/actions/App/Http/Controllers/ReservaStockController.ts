import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReservaStockController::index
 * @see app/Http/Controllers/ReservaStockController.php:18
 * @route '/inventario/reservas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::index
 * @see app/Http/Controllers/ReservaStockController.php:18
 * @route '/inventario/reservas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::index
 * @see app/Http/Controllers/ReservaStockController.php:18
 * @route '/inventario/reservas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::index
 * @see app/Http/Controllers/ReservaStockController.php:18
 * @route '/inventario/reservas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::dashboard
 * @see app/Http/Controllers/ReservaStockController.php:331
 * @route '/inventario/reservas/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::dashboard
 * @see app/Http/Controllers/ReservaStockController.php:331
 * @route '/inventario/reservas/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::dashboard
 * @see app/Http/Controllers/ReservaStockController.php:331
 * @route '/inventario/reservas/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::dashboard
 * @see app/Http/Controllers/ReservaStockController.php:331
 * @route '/inventario/reservas/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::create
 * @see app/Http/Controllers/ReservaStockController.php:48
 * @route '/inventario/reservas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::create
 * @see app/Http/Controllers/ReservaStockController.php:48
 * @route '/inventario/reservas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::create
 * @see app/Http/Controllers/ReservaStockController.php:48
 * @route '/inventario/reservas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::create
 * @see app/Http/Controllers/ReservaStockController.php:48
 * @route '/inventario/reservas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::store
 * @see app/Http/Controllers/ReservaStockController.php:63
 * @route '/inventario/reservas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/reservas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservaStockController::store
 * @see app/Http/Controllers/ReservaStockController.php:63
 * @route '/inventario/reservas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::store
 * @see app/Http/Controllers/ReservaStockController.php:63
 * @route '/inventario/reservas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReservaStockController::show
 * @see app/Http/Controllers/ReservaStockController.php:117
 * @route '/inventario/reservas/{reservaStock}'
 */
export const show = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/{reservaStock}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::show
 * @see app/Http/Controllers/ReservaStockController.php:117
 * @route '/inventario/reservas/{reservaStock}'
 */
show.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return show.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::show
 * @see app/Http/Controllers/ReservaStockController.php:117
 * @route '/inventario/reservas/{reservaStock}'
 */
show.get = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::show
 * @see app/Http/Controllers/ReservaStockController.php:117
 * @route '/inventario/reservas/{reservaStock}'
 */
show.head = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::edit
 * @see app/Http/Controllers/ReservaStockController.php:131
 * @route '/inventario/reservas/{reservaStock}/edit'
 */
export const edit = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/{reservaStock}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::edit
 * @see app/Http/Controllers/ReservaStockController.php:131
 * @route '/inventario/reservas/{reservaStock}/edit'
 */
edit.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return edit.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::edit
 * @see app/Http/Controllers/ReservaStockController.php:131
 * @route '/inventario/reservas/{reservaStock}/edit'
 */
edit.get = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::edit
 * @see app/Http/Controllers/ReservaStockController.php:131
 * @route '/inventario/reservas/{reservaStock}/edit'
 */
edit.head = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::update
 * @see app/Http/Controllers/ReservaStockController.php:152
 * @route '/inventario/reservas/{reservaStock}'
 */
export const update = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/inventario/reservas/{reservaStock}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ReservaStockController::update
 * @see app/Http/Controllers/ReservaStockController.php:152
 * @route '/inventario/reservas/{reservaStock}'
 */
update.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return update.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::update
 * @see app/Http/Controllers/ReservaStockController.php:152
 * @route '/inventario/reservas/{reservaStock}'
 */
update.put = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ReservaStockController::destroy
 * @see app/Http/Controllers/ReservaStockController.php:231
 * @route '/inventario/reservas/{reservaStock}'
 */
export const destroy = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/inventario/reservas/{reservaStock}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ReservaStockController::destroy
 * @see app/Http/Controllers/ReservaStockController.php:231
 * @route '/inventario/reservas/{reservaStock}'
 */
destroy.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return destroy.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::destroy
 * @see app/Http/Controllers/ReservaStockController.php:231
 * @route '/inventario/reservas/{reservaStock}'
 */
destroy.delete = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ReservaStockController::utilizar
 * @see app/Http/Controllers/ReservaStockController.php:188
 * @route '/inventario/reservas/{reservaStock}/utilizar'
 */
export const utilizar = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: utilizar.url(args, options),
    method: 'post',
})

utilizar.definition = {
    methods: ["post"],
    url: '/inventario/reservas/{reservaStock}/utilizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservaStockController::utilizar
 * @see app/Http/Controllers/ReservaStockController.php:188
 * @route '/inventario/reservas/{reservaStock}/utilizar'
 */
utilizar.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return utilizar.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::utilizar
 * @see app/Http/Controllers/ReservaStockController.php:188
 * @route '/inventario/reservas/{reservaStock}/utilizar'
 */
utilizar.post = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: utilizar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReservaStockController::liberar
 * @see app/Http/Controllers/ReservaStockController.php:209
 * @route '/inventario/reservas/{reservaStock}/liberar'
 */
export const liberar = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})

liberar.definition = {
    methods: ["post"],
    url: '/inventario/reservas/{reservaStock}/liberar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservaStockController::liberar
 * @see app/Http/Controllers/ReservaStockController.php:209
 * @route '/inventario/reservas/{reservaStock}/liberar'
 */
liberar.url = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservaStock: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reservaStock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservaStock: args.reservaStock,
                }

    return liberar.definition.url
            .replace('{reservaStock}', parsedArgs.reservaStock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::liberar
 * @see app/Http/Controllers/ReservaStockController.php:209
 * @route '/inventario/reservas/{reservaStock}/liberar'
 */
liberar.post = (args: { reservaStock: string | number } | [reservaStock: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: liberar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReservaStockController::apiStockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
export const apiStockDisponible = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiStockDisponible.url(options),
    method: 'get',
})

apiStockDisponible.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/api/stock-disponible',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::apiStockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
apiStockDisponible.url = (options?: RouteQueryOptions) => {
    return apiStockDisponible.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::apiStockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
apiStockDisponible.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiStockDisponible.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::apiStockDisponible
 * @see app/Http/Controllers/ReservaStockController.php:251
 * @route '/inventario/reservas/api/stock-disponible'
 */
apiStockDisponible.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiStockDisponible.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::apiReservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
export const apiReservasPorProducto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiReservasPorProducto.url(options),
    method: 'get',
})

apiReservasPorProducto.definition = {
    methods: ["get","head"],
    url: '/inventario/reservas/api/reservas-por-producto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservaStockController::apiReservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
apiReservasPorProducto.url = (options?: RouteQueryOptions) => {
    return apiReservasPorProducto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::apiReservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
apiReservasPorProducto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiReservasPorProducto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservaStockController::apiReservasPorProducto
 * @see app/Http/Controllers/ReservaStockController.php:275
 * @route '/inventario/reservas/api/reservas-por-producto'
 */
apiReservasPorProducto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiReservasPorProducto.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReservaStockController::apiLiberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
export const apiLiberarVencidas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiLiberarVencidas.url(options),
    method: 'post',
})

apiLiberarVencidas.definition = {
    methods: ["post"],
    url: '/inventario/reservas/api/liberar-vencidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservaStockController::apiLiberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
apiLiberarVencidas.url = (options?: RouteQueryOptions) => {
    return apiLiberarVencidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservaStockController::apiLiberarVencidas
 * @see app/Http/Controllers/ReservaStockController.php:315
 * @route '/inventario/reservas/api/liberar-vencidas'
 */
apiLiberarVencidas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apiLiberarVencidas.url(options),
    method: 'post',
})
const ReservaStockController = { index, dashboard, create, store, show, edit, update, destroy, utilizar, liberar, apiStockDisponible, apiReservasPorProducto, apiLiberarVencidas }

export default ReservaStockController