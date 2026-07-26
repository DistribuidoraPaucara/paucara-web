import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/combos/{combo}/capacidad'
 */
export const capacidad = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidad.url(args, options),
    method: 'get',
})

capacidad.definition = {
    methods: ["get","head"],
    url: '/combos/{combo}/capacidad',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/combos/{combo}/capacidad'
 */
capacidad.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return capacidad.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/combos/{combo}/capacidad'
 */
capacidad.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidad.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::capacidad
 * @see app/Http/Controllers/ComboController.php:457
 * @route '/combos/{combo}/capacidad'
 */
capacidad.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: capacidad.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/combos/{combo}/capacidad-detalles'
 */
export const capacidadDetalles = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'get',
})

capacidadDetalles.definition = {
    methods: ["get","head"],
    url: '/combos/{combo}/capacidad-detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return capacidadDetalles.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::capacidadDetalles
 * @see app/Http/Controllers/ComboController.php:481
 * @route '/combos/{combo}/capacidad-detalles'
 */
capacidadDetalles.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: capacidadDetalles.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::index
 * @see app/Http/Controllers/ComboController.php:23
 * @route '/combos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/combos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::index
 * @see app/Http/Controllers/ComboController.php:23
 * @route '/combos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::index
 * @see app/Http/Controllers/ComboController.php:23
 * @route '/combos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::index
 * @see app/Http/Controllers/ComboController.php:23
 * @route '/combos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::create
 * @see app/Http/Controllers/ComboController.php:47
 * @route '/combos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/combos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::create
 * @see app/Http/Controllers/ComboController.php:47
 * @route '/combos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::create
 * @see app/Http/Controllers/ComboController.php:47
 * @route '/combos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::create
 * @see app/Http/Controllers/ComboController.php:47
 * @route '/combos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::store
 * @see app/Http/Controllers/ComboController.php:52
 * @route '/combos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/combos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ComboController::store
 * @see app/Http/Controllers/ComboController.php:52
 * @route '/combos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::store
 * @see app/Http/Controllers/ComboController.php:52
 * @route '/combos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ComboController::show
 * @see app/Http/Controllers/ComboController.php:108
 * @route '/combos/{combo}'
 */
export const show = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/combos/{combo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::show
 * @see app/Http/Controllers/ComboController.php:108
 * @route '/combos/{combo}'
 */
show.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return show.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::show
 * @see app/Http/Controllers/ComboController.php:108
 * @route '/combos/{combo}'
 */
show.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::show
 * @see app/Http/Controllers/ComboController.php:108
 * @route '/combos/{combo}'
 */
show.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::edit
 * @see app/Http/Controllers/ComboController.php:120
 * @route '/combos/{combo}/edit'
 */
export const edit = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/combos/{combo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::edit
 * @see app/Http/Controllers/ComboController.php:120
 * @route '/combos/{combo}/edit'
 */
edit.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return edit.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::edit
 * @see app/Http/Controllers/ComboController.php:120
 * @route '/combos/{combo}/edit'
 */
edit.get = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::edit
 * @see app/Http/Controllers/ComboController.php:120
 * @route '/combos/{combo}/edit'
 */
edit.head = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ComboController::update
 * @see app/Http/Controllers/ComboController.php:135
 * @route '/combos/{combo}'
 */
export const update = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/combos/{combo}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ComboController::update
 * @see app/Http/Controllers/ComboController.php:135
 * @route '/combos/{combo}'
 */
update.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return update.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::update
 * @see app/Http/Controllers/ComboController.php:135
 * @route '/combos/{combo}'
 */
update.put = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ComboController::update
 * @see app/Http/Controllers/ComboController.php:135
 * @route '/combos/{combo}'
 */
update.patch = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ComboController::destroy
 * @see app/Http/Controllers/ComboController.php:175
 * @route '/combos/{combo}'
 */
export const destroy = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/combos/{combo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ComboController::destroy
 * @see app/Http/Controllers/ComboController.php:175
 * @route '/combos/{combo}'
 */
destroy.url = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { combo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { combo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    combo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        combo: typeof args.combo === 'object'
                ? args.combo.id
                : args.combo,
                }

    return destroy.definition.url
            .replace('{combo}', parsedArgs.combo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::destroy
 * @see app/Http/Controllers/ComboController.php:175
 * @route '/combos/{combo}'
 */
destroy.delete = (args: { combo: number | { id: number } } | [combo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const combos = {
    capacidad,
capacidadDetalles,
index,
create,
store,
show,
edit,
update,
destroy,
}

export default combos