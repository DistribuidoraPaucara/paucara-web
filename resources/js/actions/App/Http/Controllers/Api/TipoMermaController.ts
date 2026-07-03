import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TipoMermaController::index
 * @see app/Http/Controllers/Api/TipoMermaController.php:13
 * @route '/api/tipo-mermas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tipo-mermas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoMermaController::index
 * @see app/Http/Controllers/Api/TipoMermaController.php:13
 * @route '/api/tipo-mermas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoMermaController::index
 * @see app/Http/Controllers/Api/TipoMermaController.php:13
 * @route '/api/tipo-mermas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoMermaController::index
 * @see app/Http/Controllers/Api/TipoMermaController.php:13
 * @route '/api/tipo-mermas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TipoMermaController::store
 * @see app/Http/Controllers/Api/TipoMermaController.php:23
 * @route '/api/tipo-mermas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/tipo-mermas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TipoMermaController::store
 * @see app/Http/Controllers/Api/TipoMermaController.php:23
 * @route '/api/tipo-mermas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoMermaController::store
 * @see app/Http/Controllers/Api/TipoMermaController.php:23
 * @route '/api/tipo-mermas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TipoMermaController::show
 * @see app/Http/Controllers/Api/TipoMermaController.php:42
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
export const show = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/tipo-mermas/{tipo_merma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoMermaController::show
 * @see app/Http/Controllers/Api/TipoMermaController.php:42
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
show.url = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_merma: args.tipo_merma,
                }

    return show.definition.url
            .replace('{tipo_merma}', parsedArgs.tipo_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoMermaController::show
 * @see app/Http/Controllers/Api/TipoMermaController.php:42
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
show.get = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoMermaController::show
 * @see app/Http/Controllers/Api/TipoMermaController.php:42
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
show.head = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TipoMermaController::update
 * @see app/Http/Controllers/Api/TipoMermaController.php:50
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
export const update = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/tipo-mermas/{tipo_merma}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\TipoMermaController::update
 * @see app/Http/Controllers/Api/TipoMermaController.php:50
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
update.url = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_merma: args.tipo_merma,
                }

    return update.definition.url
            .replace('{tipo_merma}', parsedArgs.tipo_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoMermaController::update
 * @see app/Http/Controllers/Api/TipoMermaController.php:50
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
update.put = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\TipoMermaController::update
 * @see app/Http/Controllers/Api/TipoMermaController.php:50
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
update.patch = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\TipoMermaController::destroy
 * @see app/Http/Controllers/Api/TipoMermaController.php:69
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
export const destroy = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/tipo-mermas/{tipo_merma}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TipoMermaController::destroy
 * @see app/Http/Controllers/Api/TipoMermaController.php:69
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
destroy.url = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_merma: args.tipo_merma,
                }

    return destroy.definition.url
            .replace('{tipo_merma}', parsedArgs.tipo_merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoMermaController::destroy
 * @see app/Http/Controllers/Api/TipoMermaController.php:69
 * @route '/api/tipo-mermas/{tipo_merma}'
 */
destroy.delete = (args: { tipo_merma: string | number } | [tipo_merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const TipoMermaController = { index, store, show, update, destroy }

export default TipoMermaController