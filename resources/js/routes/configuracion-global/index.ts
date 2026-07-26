import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import ganancias from './ganancias'
/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::index
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:13
 * @route '/configuracion-global'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/configuracion-global',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::index
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:13
 * @route '/configuracion-global'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::index
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:13
 * @route '/configuracion-global'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::index
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:13
 * @route '/configuracion-global'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::ganancias
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:86
 * @route '/configuracion-global/ganancias'
 */
export const ganancias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ganancias.url(options),
    method: 'get',
})

ganancias.definition = {
    methods: ["get","head"],
    url: '/configuracion-global/ganancias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::ganancias
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:86
 * @route '/configuracion-global/ganancias'
 */
ganancias.url = (options?: RouteQueryOptions) => {
    return ganancias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::ganancias
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:86
 * @route '/configuracion-global/ganancias'
 */
ganancias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ganancias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::ganancias
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:86
 * @route '/configuracion-global/ganancias'
 */
ganancias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ganancias.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::store
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:127
 * @route '/configuracion-global'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/configuracion-global',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::store
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:127
 * @route '/configuracion-global'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::store
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:127
 * @route '/configuracion-global'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::show
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:30
 * @route '/configuracion-global/{clave}'
 */
export const show = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/configuracion-global/{clave}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::show
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:30
 * @route '/configuracion-global/{clave}'
 */
show.url = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clave: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clave: args.clave,
                }

    return show.definition.url
            .replace('{clave}', parsedArgs.clave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::show
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:30
 * @route '/configuracion-global/{clave}'
 */
show.get = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::show
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:30
 * @route '/configuracion-global/{clave}'
 */
show.head = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:46
 * @route '/configuracion-global/{clave}'
 */
export const update = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/configuracion-global/{clave}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:46
 * @route '/configuracion-global/{clave}'
 */
update.url = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clave: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clave: args.clave,
                }

    return update.definition.url
            .replace('{clave}', parsedArgs.clave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:46
 * @route '/configuracion-global/{clave}'
 */
update.put = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::reset
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:163
 * @route '/configuracion-global/{clave}/reset'
 */
export const reset = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reset.url(args, options),
    method: 'patch',
})

reset.definition = {
    methods: ["patch"],
    url: '/configuracion-global/{clave}/reset',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::reset
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:163
 * @route '/configuracion-global/{clave}/reset'
 */
reset.url = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clave: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clave: args.clave,
                }

    return reset.definition.url
            .replace('{clave}', parsedArgs.clave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::reset
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:163
 * @route '/configuracion-global/{clave}/reset'
 */
reset.patch = (args: { clave: string | number } | [clave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reset.url(args, options),
    method: 'patch',
})
const configuracionGlobal = {
    index,
ganancias,
store,
show,
update,
reset,
}

export default configuracionGlobal