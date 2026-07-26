import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UnidadMedidaController::index
 * @see app/Http/Controllers/UnidadMedidaController.php:53
 * @route '/unidades'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/unidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::index
 * @see app/Http/Controllers/UnidadMedidaController.php:53
 * @route '/unidades'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::index
 * @see app/Http/Controllers/UnidadMedidaController.php:53
 * @route '/unidades'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UnidadMedidaController::index
 * @see app/Http/Controllers/UnidadMedidaController.php:53
 * @route '/unidades'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::create
 * @see app/Http/Controllers/UnidadMedidaController.php:162
 * @route '/unidades/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/unidades/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::create
 * @see app/Http/Controllers/UnidadMedidaController.php:162
 * @route '/unidades/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::create
 * @see app/Http/Controllers/UnidadMedidaController.php:162
 * @route '/unidades/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UnidadMedidaController::create
 * @see app/Http/Controllers/UnidadMedidaController.php:162
 * @route '/unidades/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::store
 * @see app/Http/Controllers/UnidadMedidaController.php:177
 * @route '/unidades'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/unidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::store
 * @see app/Http/Controllers/UnidadMedidaController.php:177
 * @route '/unidades'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::store
 * @see app/Http/Controllers/UnidadMedidaController.php:177
 * @route '/unidades'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::show
 * @see app/Http/Controllers/UnidadMedidaController.php:0
 * @route '/unidades/{unidad}'
 */
export const show = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/unidades/{unidad}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::show
 * @see app/Http/Controllers/UnidadMedidaController.php:0
 * @route '/unidades/{unidad}'
 */
show.url = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: args.unidad,
                }

    return show.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::show
 * @see app/Http/Controllers/UnidadMedidaController.php:0
 * @route '/unidades/{unidad}'
 */
show.get = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UnidadMedidaController::show
 * @see app/Http/Controllers/UnidadMedidaController.php:0
 * @route '/unidades/{unidad}'
 */
show.head = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::edit
 * @see app/Http/Controllers/UnidadMedidaController.php:203
 * @route '/unidades/{unidad}/edit'
 */
export const edit = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/unidades/{unidad}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::edit
 * @see app/Http/Controllers/UnidadMedidaController.php:203
 * @route '/unidades/{unidad}/edit'
 */
edit.url = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: args.unidad,
                }

    return edit.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::edit
 * @see app/Http/Controllers/UnidadMedidaController.php:203
 * @route '/unidades/{unidad}/edit'
 */
edit.get = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UnidadMedidaController::edit
 * @see app/Http/Controllers/UnidadMedidaController.php:203
 * @route '/unidades/{unidad}/edit'
 */
edit.head = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::update
 * @see app/Http/Controllers/UnidadMedidaController.php:222
 * @route '/unidades/{unidad}'
 */
export const update = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/unidades/{unidad}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::update
 * @see app/Http/Controllers/UnidadMedidaController.php:222
 * @route '/unidades/{unidad}'
 */
update.url = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: args.unidad,
                }

    return update.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::update
 * @see app/Http/Controllers/UnidadMedidaController.php:222
 * @route '/unidades/{unidad}'
 */
update.put = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\UnidadMedidaController::update
 * @see app/Http/Controllers/UnidadMedidaController.php:222
 * @route '/unidades/{unidad}'
 */
update.patch = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UnidadMedidaController::destroy
 * @see app/Http/Controllers/UnidadMedidaController.php:244
 * @route '/unidades/{unidad}'
 */
export const destroy = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/unidades/{unidad}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UnidadMedidaController::destroy
 * @see app/Http/Controllers/UnidadMedidaController.php:244
 * @route '/unidades/{unidad}'
 */
destroy.url = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: args.unidad,
                }

    return destroy.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UnidadMedidaController::destroy
 * @see app/Http/Controllers/UnidadMedidaController.php:244
 * @route '/unidades/{unidad}'
 */
destroy.delete = (args: { unidad: string | number } | [unidad: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const unidades = {
    index,
create,
store,
show,
edit,
update,
destroy,
}

export default unidades