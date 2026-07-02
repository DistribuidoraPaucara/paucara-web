import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1625
 * @route '/inventario/transferencias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1625
 * @route '/inventario/transferencias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1625
 * @route '/inventario/transferencias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1625
 * @route '/inventario/transferencias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1844
 * @route '/inventario/transferencias/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1844
 * @route '/inventario/transferencias/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1844
 * @route '/inventario/transferencias/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1844
 * @route '/inventario/transferencias/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1669
 * @route '/inventario/transferencias/crear'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1669
 * @route '/inventario/transferencias/crear'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1669
 * @route '/inventario/transferencias/crear'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1884
 * @route '/inventario/transferencias/{transferencia}'
 */
export const show = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1884
 * @route '/inventario/transferencias/{transferencia}'
 */
show.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return show.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1884
 * @route '/inventario/transferencias/{transferencia}'
 */
show.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1884
 * @route '/inventario/transferencias/{transferencia}'
 */
show.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:2113
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
export const edit = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:2113
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return edit.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:2113
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:2113
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:2132
 * @route '/inventario/transferencias/{transferencia}'
 */
export const update = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:2132
 * @route '/inventario/transferencias/{transferencia}'
 */
update.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return update.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:2132
 * @route '/inventario/transferencias/{transferencia}'
 */
update.put = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1903
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
export const enviar = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

enviar.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1903
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviar.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return enviar.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1903
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviar.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1924
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
export const recibir = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibir.url(args, options),
    method: 'post',
})

recibir.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/recibir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1924
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibir.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return recibir.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1924
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibir.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibir.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1945
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
export const cancelar = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1945
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelar.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return cancelar.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1945
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelar.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})
const transferencias = {
    index,
crear,
store,
show,
edit,
update,
enviar,
recibir,
cancelar,
}

export default transferencias