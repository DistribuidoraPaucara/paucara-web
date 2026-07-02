import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tipo-operacion-caja',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/tipo-operacion-caja',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
export const show = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return show.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
export const update = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return update.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update.put = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update.patch = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
export const destroy = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return destroy.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy.delete = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const tipoOperacionCaja = {
    index,
store,
show,
update,
destroy,
}

export default tipoOperacionCaja