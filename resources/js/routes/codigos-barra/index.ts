import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/codigos-barra',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::index
 * @see app/Http/Controllers/CodigoBarraController.php:30
 * @route '/codigos-barra'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::create
 * @see app/Http/Controllers/CodigoBarraController.php:54
 * @route '/codigos-barra/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/codigos-barra',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::store
 * @see app/Http/Controllers/CodigoBarraController.php:76
 * @route '/codigos-barra'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
export const show = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return show.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::show
 * @see app/Http/Controllers/CodigoBarraController.php:0
 * @route '/codigos-barra/{codigos_barra}'
 */
show.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
export const edit = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/codigos-barra/{codigos_barra}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return edit.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.get = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::edit
 * @see app/Http/Controllers/CodigoBarraController.php:117
 * @route '/codigos-barra/{codigos_barra}/edit'
 */
edit.head = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
export const update = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return update.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.put = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::update
 * @see app/Http/Controllers/CodigoBarraController.php:129
 * @route '/codigos-barra/{codigos_barra}'
 */
update.patch = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
export const destroy = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/codigos-barra/{codigos_barra}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
destroy.url = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigos_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigos_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigos_barra: args.codigos_barra,
                }

    return destroy.definition.url
            .replace('{codigos_barra}', parsedArgs.codigos_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::destroy
 * @see app/Http/Controllers/CodigoBarraController.php:167
 * @route '/codigos-barra/{codigos_barra}'
 */
destroy.delete = (args: { codigos_barra: string | number } | [codigos_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
export const principal = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: principal.url(args, options),
    method: 'put',
})

principal.definition = {
    methods: ["put"],
    url: '/codigos-barra/{codigo_barra}/principal',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
principal.url = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo_barra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo_barra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo_barra: args.codigo_barra,
                }

    return principal.definition.url
            .replace('{codigo_barra}', parsedArgs.codigo_barra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::principal
 * @see app/Http/Controllers/CodigoBarraController.php:273
 * @route '/codigos-barra/{codigo_barra}/principal'
 */
principal.put = (args: { codigo_barra: string | number } | [codigo_barra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: principal.url(args, options),
    method: 'put',
})
const codigosBarra = {
    index,
create,
store,
show,
edit,
update,
destroy,
principal,
}

export default codigosBarra