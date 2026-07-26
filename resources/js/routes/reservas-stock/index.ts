import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import api from './api'
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
const reservasStock = {
    index,
dashboard,
create,
store,
show,
edit,
update,
destroy,
utilizar,
liberar,
api,
}

export default reservasStock