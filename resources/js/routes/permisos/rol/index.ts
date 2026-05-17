import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
export const editar = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editar.url(args, options),
    method: 'get',
})

editar.definition = {
    methods: ["get","head"],
    url: '/permisos/rol/{role}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
editar.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return editar.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
editar.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
editar.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
    const editarForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
        editarForm.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PermissionController::editar
 * @see app/Http/Controllers/PermissionController.php:123
 * @route '/permisos/rol/{role}/editar'
 */
        editarForm.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/PermissionController.php:139
 * @route '/permisos/rol/{role}'
 */
export const actualizar = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizar.url(args, options),
    method: 'patch',
})

actualizar.definition = {
    methods: ["patch"],
    url: '/permisos/rol/{role}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:139
 * @route '/permisos/rol/{role}'
 */
actualizar.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return actualizar.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:139
 * @route '/permisos/rol/{role}'
 */
actualizar.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PermissionController::actualizar
 * @see app/Http/Controllers/PermissionController.php:139
 * @route '/permisos/rol/{role}'
 */
    const actualizarForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/PermissionController.php:139
 * @route '/permisos/rol/{role}'
 */
        actualizarForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizar.form = actualizarForm
const rol = {
    editar,
actualizar,
}

export default rol