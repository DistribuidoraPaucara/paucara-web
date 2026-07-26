import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DetalleVentaController::show
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
export const show = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::show
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
show.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return show.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::show
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
show.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::show
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
show.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::edit
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}/edit'
 */
export const edit = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/detalles/{detalle}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::edit
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return edit.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::edit
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.get = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::edit
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}/edit'
 */
edit.head = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::update
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
export const update = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::update
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
update.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return update.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::update
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
update.put = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::update
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
update.patch = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::destroy
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
export const destroy = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/detalles/{detalle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::destroy
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
destroy.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return destroy.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::destroy
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/detalles/{detalle}'
 */
destroy.delete = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
export const index = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return index.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::index
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
index.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
export const create = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/detalles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return create.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DetalleVentaController::create
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles/create'
 */
create.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
export const store = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/detalles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
store.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return store.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DetalleVentaController::store
 * @see app/Http/Controllers/DetalleVentaController.php:0
 * @route '/ventas/{venta}/detalles'
 */
store.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})
const DetalleVentaController = { show, edit, update, destroy, index, create, store }

export default DetalleVentaController