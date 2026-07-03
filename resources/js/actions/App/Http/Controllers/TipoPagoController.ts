import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoPagoController::index
 * @see app/Http/Controllers/TipoPagoController.php:53
 * @route '/tipos-pago'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tipos-pago',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPagoController::index
 * @see app/Http/Controllers/TipoPagoController.php:53
 * @route '/tipos-pago'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::index
 * @see app/Http/Controllers/TipoPagoController.php:53
 * @route '/tipos-pago'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPagoController::index
 * @see app/Http/Controllers/TipoPagoController.php:53
 * @route '/tipos-pago'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoPagoController::create
 * @see app/Http/Controllers/TipoPagoController.php:162
 * @route '/tipos-pago/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tipos-pago/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPagoController::create
 * @see app/Http/Controllers/TipoPagoController.php:162
 * @route '/tipos-pago/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::create
 * @see app/Http/Controllers/TipoPagoController.php:162
 * @route '/tipos-pago/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPagoController::create
 * @see app/Http/Controllers/TipoPagoController.php:162
 * @route '/tipos-pago/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoPagoController::store
 * @see app/Http/Controllers/TipoPagoController.php:177
 * @route '/tipos-pago'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tipos-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoPagoController::store
 * @see app/Http/Controllers/TipoPagoController.php:177
 * @route '/tipos-pago'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::store
 * @see app/Http/Controllers/TipoPagoController.php:177
 * @route '/tipos-pago'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TipoPagoController::show
 * @see app/Http/Controllers/TipoPagoController.php:0
 * @route '/tipos-pago/{tipoPago}'
 */
export const show = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tipos-pago/{tipoPago}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPagoController::show
 * @see app/Http/Controllers/TipoPagoController.php:0
 * @route '/tipos-pago/{tipoPago}'
 */
show.url = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoPago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPago: args.tipoPago,
                }

    return show.definition.url
            .replace('{tipoPago}', parsedArgs.tipoPago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::show
 * @see app/Http/Controllers/TipoPagoController.php:0
 * @route '/tipos-pago/{tipoPago}'
 */
show.get = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPagoController::show
 * @see app/Http/Controllers/TipoPagoController.php:0
 * @route '/tipos-pago/{tipoPago}'
 */
show.head = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoPagoController::edit
 * @see app/Http/Controllers/TipoPagoController.php:79
 * @route '/tipos-pago/{tipoPago}/edit'
 */
export const edit = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tipos-pago/{tipoPago}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoPagoController::edit
 * @see app/Http/Controllers/TipoPagoController.php:79
 * @route '/tipos-pago/{tipoPago}/edit'
 */
edit.url = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoPago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPago: args.tipoPago,
                }

    return edit.definition.url
            .replace('{tipoPago}', parsedArgs.tipoPago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::edit
 * @see app/Http/Controllers/TipoPagoController.php:79
 * @route '/tipos-pago/{tipoPago}/edit'
 */
edit.get = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoPagoController::edit
 * @see app/Http/Controllers/TipoPagoController.php:79
 * @route '/tipos-pago/{tipoPago}/edit'
 */
edit.head = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoPagoController::update
 * @see app/Http/Controllers/TipoPagoController.php:92
 * @route '/tipos-pago/{tipoPago}'
 */
export const update = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tipos-pago/{tipoPago}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoPagoController::update
 * @see app/Http/Controllers/TipoPagoController.php:92
 * @route '/tipos-pago/{tipoPago}'
 */
update.url = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoPago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPago: args.tipoPago,
                }

    return update.definition.url
            .replace('{tipoPago}', parsedArgs.tipoPago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::update
 * @see app/Http/Controllers/TipoPagoController.php:92
 * @route '/tipos-pago/{tipoPago}'
 */
update.put = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoPagoController::update
 * @see app/Http/Controllers/TipoPagoController.php:92
 * @route '/tipos-pago/{tipoPago}'
 */
update.patch = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TipoPagoController::destroy
 * @see app/Http/Controllers/TipoPagoController.php:244
 * @route '/tipos-pago/{tipoPago}'
 */
export const destroy = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tipos-pago/{tipoPago}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoPagoController::destroy
 * @see app/Http/Controllers/TipoPagoController.php:244
 * @route '/tipos-pago/{tipoPago}'
 */
destroy.url = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoPago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoPago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoPago: args.tipoPago,
                }

    return destroy.definition.url
            .replace('{tipoPago}', parsedArgs.tipoPago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoPagoController::destroy
 * @see app/Http/Controllers/TipoPagoController.php:244
 * @route '/tipos-pago/{tipoPago}'
 */
destroy.delete = (args: { tipoPago: string | number } | [tipoPago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const TipoPagoController = { index, create, store, show, edit, update, destroy }

export default TipoPagoController