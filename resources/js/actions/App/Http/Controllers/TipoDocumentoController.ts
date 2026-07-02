import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tipos-documento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::index
 * @see app/Http/Controllers/TipoDocumentoController.php:47
 * @route '/tipos-documento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::create
 * @see app/Http/Controllers/TipoDocumentoController.php:162
 * @route '/tipos-documento/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tipos-documento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::store
 * @see app/Http/Controllers/TipoDocumentoController.php:177
 * @route '/tipos-documento'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const show = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return show.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::show
 * @see app/Http/Controllers/TipoDocumentoController.php:0
 * @route '/tipos-documento/{tipoDocumento}'
 */
show.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
export const edit = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tipos-documento/{tipoDocumento}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return edit.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.get = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::edit
 * @see app/Http/Controllers/TipoDocumentoController.php:72
 * @route '/tipos-documento/{tipoDocumento}/edit'
 */
edit.head = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const update = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return update.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.put = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoDocumentoController::update
 * @see app/Http/Controllers/TipoDocumentoController.php:85
 * @route '/tipos-documento/{tipoDocumento}'
 */
update.patch = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
export const destroy = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tipos-documento/{tipoDocumento}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
destroy.url = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoDocumento: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipoDocumento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoDocumento: args.tipoDocumento,
                }

    return destroy.definition.url
            .replace('{tipoDocumento}', parsedArgs.tipoDocumento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoDocumentoController::destroy
 * @see app/Http/Controllers/TipoDocumentoController.php:244
 * @route '/tipos-documento/{tipoDocumento}'
 */
destroy.delete = (args: { tipoDocumento: string | number } | [tipoDocumento: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const TipoDocumentoController = { index, create, store, show, edit, update, destroy }

export default TipoDocumentoController