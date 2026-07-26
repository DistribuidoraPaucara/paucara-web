import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:27
 * @route '/usuarios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:27
 * @route '/usuarios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:27
 * @route '/usuarios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:27
 * @route '/usuarios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::create
 * @see app/Http/Controllers/UserController.php:61
 * @route '/usuarios/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/usuarios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::create
 * @see app/Http/Controllers/UserController.php:61
 * @route '/usuarios/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::create
 * @see app/Http/Controllers/UserController.php:61
 * @route '/usuarios/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::create
 * @see app/Http/Controllers/UserController.php:61
 * @route '/usuarios/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:74
 * @route '/usuarios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/usuarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:74
 * @route '/usuarios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::store
 * @see app/Http/Controllers/UserController.php:74
 * @route '/usuarios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:110
 * @route '/usuarios/{usuario}'
 */
export const show = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/usuarios/{usuario}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:110
 * @route '/usuarios/{usuario}'
 */
show.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return show.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:110
 * @route '/usuarios/{usuario}'
 */
show.get = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::show
 * @see app/Http/Controllers/UserController.php:110
 * @route '/usuarios/{usuario}'
 */
show.head = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:123
 * @route '/usuarios/{usuario}/edit'
 */
export const edit = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/usuarios/{usuario}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:123
 * @route '/usuarios/{usuario}/edit'
 */
edit.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return edit.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:123
 * @route '/usuarios/{usuario}/edit'
 */
edit.get = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::edit
 * @see app/Http/Controllers/UserController.php:123
 * @route '/usuarios/{usuario}/edit'
 */
edit.head = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:141
 * @route '/usuarios/{usuario}'
 */
export const update = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/usuarios/{usuario}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:141
 * @route '/usuarios/{usuario}'
 */
update.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return update.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:141
 * @route '/usuarios/{usuario}'
 */
update.put = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:141
 * @route '/usuarios/{usuario}'
 */
update.patch = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:183
 * @route '/usuarios/{usuario}'
 */
export const destroy = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/usuarios/{usuario}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:183
 * @route '/usuarios/{usuario}'
 */
destroy.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return destroy.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::destroy
 * @see app/Http/Controllers/UserController.php:183
 * @route '/usuarios/{usuario}'
 */
destroy.delete = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserController::assignRole
 * @see app/Http/Controllers/UserController.php:210
 * @route '/usuarios/{usuario}/assign-role'
 */
export const assignRole = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRole.url(args, options),
    method: 'post',
})

assignRole.definition = {
    methods: ["post"],
    url: '/usuarios/{usuario}/assign-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::assignRole
 * @see app/Http/Controllers/UserController.php:210
 * @route '/usuarios/{usuario}/assign-role'
 */
assignRole.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return assignRole.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::assignRole
 * @see app/Http/Controllers/UserController.php:210
 * @route '/usuarios/{usuario}/assign-role'
 */
assignRole.post = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::removeRole
 * @see app/Http/Controllers/UserController.php:221
 * @route '/usuarios/{usuario}/remove-role'
 */
export const removeRole = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeRole.url(args, options),
    method: 'delete',
})

removeRole.definition = {
    methods: ["delete"],
    url: '/usuarios/{usuario}/remove-role',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::removeRole
 * @see app/Http/Controllers/UserController.php:221
 * @route '/usuarios/{usuario}/remove-role'
 */
removeRole.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return removeRole.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::removeRole
 * @see app/Http/Controllers/UserController.php:221
 * @route '/usuarios/{usuario}/remove-role'
 */
removeRole.delete = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeRole.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserController::assignPermission
 * @see app/Http/Controllers/UserController.php:232
 * @route '/usuarios/{usuario}/assign-permission'
 */
export const assignPermission = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermission.url(args, options),
    method: 'post',
})

assignPermission.definition = {
    methods: ["post"],
    url: '/usuarios/{usuario}/assign-permission',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::assignPermission
 * @see app/Http/Controllers/UserController.php:232
 * @route '/usuarios/{usuario}/assign-permission'
 */
assignPermission.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return assignPermission.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::assignPermission
 * @see app/Http/Controllers/UserController.php:232
 * @route '/usuarios/{usuario}/assign-permission'
 */
assignPermission.post = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignPermission.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::removePermission
 * @see app/Http/Controllers/UserController.php:243
 * @route '/usuarios/{usuario}/remove-permission'
 */
export const removePermission = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removePermission.url(args, options),
    method: 'delete',
})

removePermission.definition = {
    methods: ["delete"],
    url: '/usuarios/{usuario}/remove-permission',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::removePermission
 * @see app/Http/Controllers/UserController.php:243
 * @route '/usuarios/{usuario}/remove-permission'
 */
removePermission.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return removePermission.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::removePermission
 * @see app/Http/Controllers/UserController.php:243
 * @route '/usuarios/{usuario}/remove-permission'
 */
removePermission.delete = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removePermission.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserController::toggleStatus
 * @see app/Http/Controllers/UserController.php:196
 * @route '/usuarios/{usuario}/toggle-status'
 */
export const toggleStatus = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/usuarios/{usuario}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserController::toggleStatus
 * @see app/Http/Controllers/UserController.php:196
 * @route '/usuarios/{usuario}/toggle-status'
 */
toggleStatus.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return toggleStatus.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::toggleStatus
 * @see app/Http/Controllers/UserController.php:196
 * @route '/usuarios/{usuario}/toggle-status'
 */
toggleStatus.patch = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})
const UserController = { index, create, store, show, edit, update, destroy, assignRole, removeRole, assignPermission, removePermission, toggleStatus }

export default UserController