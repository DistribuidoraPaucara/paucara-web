import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonedaController::index
 * @see app/Http/Controllers/MonedaController.php:12
 * @route '/monedas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monedas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonedaController::index
 * @see app/Http/Controllers/MonedaController.php:12
 * @route '/monedas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::index
 * @see app/Http/Controllers/MonedaController.php:12
 * @route '/monedas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonedaController::index
 * @see app/Http/Controllers/MonedaController.php:12
 * @route '/monedas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonedaController::create
 * @see app/Http/Controllers/MonedaController.php:46
 * @route '/monedas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/monedas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonedaController::create
 * @see app/Http/Controllers/MonedaController.php:46
 * @route '/monedas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::create
 * @see app/Http/Controllers/MonedaController.php:46
 * @route '/monedas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonedaController::create
 * @see app/Http/Controllers/MonedaController.php:46
 * @route '/monedas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonedaController::store
 * @see app/Http/Controllers/MonedaController.php:53
 * @route '/monedas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/monedas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonedaController::store
 * @see app/Http/Controllers/MonedaController.php:53
 * @route '/monedas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::store
 * @see app/Http/Controllers/MonedaController.php:53
 * @route '/monedas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonedaController::show
 * @see app/Http/Controllers/MonedaController.php:73
 * @route '/monedas/{moneda}'
 */
export const show = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/monedas/{moneda}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonedaController::show
 * @see app/Http/Controllers/MonedaController.php:73
 * @route '/monedas/{moneda}'
 */
show.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return show.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::show
 * @see app/Http/Controllers/MonedaController.php:73
 * @route '/monedas/{moneda}'
 */
show.get = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonedaController::show
 * @see app/Http/Controllers/MonedaController.php:73
 * @route '/monedas/{moneda}'
 */
show.head = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonedaController::edit
 * @see app/Http/Controllers/MonedaController.php:80
 * @route '/monedas/{moneda}/edit'
 */
export const edit = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/monedas/{moneda}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonedaController::edit
 * @see app/Http/Controllers/MonedaController.php:80
 * @route '/monedas/{moneda}/edit'
 */
edit.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return edit.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::edit
 * @see app/Http/Controllers/MonedaController.php:80
 * @route '/monedas/{moneda}/edit'
 */
edit.get = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonedaController::edit
 * @see app/Http/Controllers/MonedaController.php:80
 * @route '/monedas/{moneda}/edit'
 */
edit.head = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonedaController::update
 * @see app/Http/Controllers/MonedaController.php:87
 * @route '/monedas/{moneda}'
 */
export const update = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/monedas/{moneda}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MonedaController::update
 * @see app/Http/Controllers/MonedaController.php:87
 * @route '/monedas/{moneda}'
 */
update.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return update.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::update
 * @see app/Http/Controllers/MonedaController.php:87
 * @route '/monedas/{moneda}'
 */
update.put = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MonedaController::update
 * @see app/Http/Controllers/MonedaController.php:87
 * @route '/monedas/{moneda}'
 */
update.patch = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MonedaController::destroy
 * @see app/Http/Controllers/MonedaController.php:107
 * @route '/monedas/{moneda}'
 */
export const destroy = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/monedas/{moneda}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MonedaController::destroy
 * @see app/Http/Controllers/MonedaController.php:107
 * @route '/monedas/{moneda}'
 */
destroy.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return destroy.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::destroy
 * @see app/Http/Controllers/MonedaController.php:107
 * @route '/monedas/{moneda}'
 */
destroy.delete = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MonedaController::activas
 * @see app/Http/Controllers/MonedaController.php:126
 * @route '/monedas/{moneda}/activas'
 */
export const activas = (args: { moneda: string | number } | [moneda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activas.url(args, options),
    method: 'get',
})

activas.definition = {
    methods: ["get","head"],
    url: '/monedas/{moneda}/activas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonedaController::activas
 * @see app/Http/Controllers/MonedaController.php:126
 * @route '/monedas/{moneda}/activas'
 */
activas.url = (args: { moneda: string | number } | [moneda: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: args.moneda,
                }

    return activas.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::activas
 * @see app/Http/Controllers/MonedaController.php:126
 * @route '/monedas/{moneda}/activas'
 */
activas.get = (args: { moneda: string | number } | [moneda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonedaController::activas
 * @see app/Http/Controllers/MonedaController.php:126
 * @route '/monedas/{moneda}/activas'
 */
activas.head = (args: { moneda: string | number } | [moneda: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activas.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonedaController::convertir
 * @see app/Http/Controllers/MonedaController.php:133
 * @route '/monedas/convertir'
 */
export const convertir = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertir.url(options),
    method: 'post',
})

convertir.definition = {
    methods: ["post"],
    url: '/monedas/convertir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonedaController::convertir
 * @see app/Http/Controllers/MonedaController.php:133
 * @route '/monedas/convertir'
 */
convertir.url = (options?: RouteQueryOptions) => {
    return convertir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::convertir
 * @see app/Http/Controllers/MonedaController.php:133
 * @route '/monedas/convertir'
 */
convertir.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertir.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonedaController::toggleActivo
 * @see app/Http/Controllers/MonedaController.php:170
 * @route '/monedas/{moneda}/toggle-activo'
 */
export const toggleActivo = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

toggleActivo.definition = {
    methods: ["patch"],
    url: '/monedas/{moneda}/toggle-activo',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MonedaController::toggleActivo
 * @see app/Http/Controllers/MonedaController.php:170
 * @route '/monedas/{moneda}/toggle-activo'
 */
toggleActivo.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return toggleActivo.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::toggleActivo
 * @see app/Http/Controllers/MonedaController.php:170
 * @route '/monedas/{moneda}/toggle-activo'
 */
toggleActivo.patch = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MonedaController::establecerBase
 * @see app/Http/Controllers/MonedaController.php:180
 * @route '/monedas/{moneda}/establecer-base'
 */
export const establecerBase = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: establecerBase.url(args, options),
    method: 'patch',
})

establecerBase.definition = {
    methods: ["patch"],
    url: '/monedas/{moneda}/establecer-base',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MonedaController::establecerBase
 * @see app/Http/Controllers/MonedaController.php:180
 * @route '/monedas/{moneda}/establecer-base'
 */
establecerBase.url = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moneda: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moneda: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moneda: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moneda: typeof args.moneda === 'object'
                ? args.moneda.id
                : args.moneda,
                }

    return establecerBase.definition.url
            .replace('{moneda}', parsedArgs.moneda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonedaController::establecerBase
 * @see app/Http/Controllers/MonedaController.php:180
 * @route '/monedas/{moneda}/establecer-base'
 */
establecerBase.patch = (args: { moneda: number | { id: number } } | [moneda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: establecerBase.url(args, options),
    method: 'patch',
})
const MonedaController = { index, create, store, show, edit, update, destroy, activas, convertir, toggleActivo, establecerBase }

export default MonedaController