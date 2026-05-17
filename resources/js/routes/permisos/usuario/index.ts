import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
export const editar = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editar.url(args, options),
    method: 'get',
})

editar.definition = {
    methods: ["get","head"],
    url: '/permisos/usuario/{user}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
editar.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return editar.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
editar.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
editar.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
    const editarForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
        editarForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:34
 * @route '/permisos/usuario/{user}/editar'
 */
        editarForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editar.form = editarForm
/**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:85
 * @route '/permisos/usuario/{user}'
 */
export const actualizar = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizar.url(args, options),
    method: 'patch',
})

actualizar.definition = {
    methods: ["patch"],
    url: '/permisos/usuario/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:85
 * @route '/permisos/usuario/{user}'
 */
actualizar.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return actualizar.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:85
 * @route '/permisos/usuario/{user}'
 */
actualizar.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:85
 * @route '/permisos/usuario/{user}'
 */
    const actualizarForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:85
 * @route '/permisos/usuario/{user}'
 */
        actualizarForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizar.form = actualizarForm
const usuario = {
    editar,
actualizar,
}

export default usuario